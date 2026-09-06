import os, re, requests
from bs4 import BeautifulSoup
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

HEADERS = {"User-Agent": "Mozilla/5.0"}
OFFICIAL_DOMAINS = ["gov.in", "nic.in", "bank.in", "bpsc.bihar.gov.in", "mpsc.gov.in", "ibps.in", "sbi.co.in", "ssc.gov.in", "rrbapply.gov.in", "licindia.in"]

# Load your 10 exams official sites (from SQL you ran in supab1.JPG)
exams_resp = supabase.table("exams").select("id,name,official_website").execute()
EXAM_MAP = {e['id']: e for e in exams_resp.data}
def guess_exam_official(title):
    title = title.lower()
    for e in EXAM_MAP.values():
        if e['name'].lower().split()[0] in title:
            return e['official_website'], e['id']
    return "https://ssc.gov.in", None

def extract_real_links(detail_url):
    try:
        r = requests.get(detail_url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(r.text, "lxml")
        pdf_url = None
        official_link = None
        for a in soup.find_all("a", href=True):
            href = a['href'].strip()
            if "sarkariresult" in href.lower():
                continue # ❌ NEVER save.cm aggregator
            if any(d in href for d in OFFICIAL_DOMAINS):
                if href.lower().endswith(".pdf") and not pdf_url:
                    pdf_url = href
                if not official_link and ".pdf" not in href.lower():
                    official_link = href
        return pdf_url, official_link
    except:
        return None, None

def scrape():
    # Example: scrape sarkariresult for discovery, but save ONLY gov links
    base = "https://sarkariresult.com.cm"
    r = requests.get(base, headers=HEADERS, timeout=20)
    soup = BeautifulSoup(r.text, "lxml")

    count = 0
    for a in soup.select("a")[:50]: # latest 50
        title = a.get_text(strip=True)
        href = a.get("href")
        if not href or len(title) < 15: continue
        if not href.startswith("http"): href = base + href

        # Skip non-exam links
        if any(x in title.lower() for x in ["sarkari", "result", "admit"] ) and len(title) > 20:
            pdf, official = extract_real_links(href)
            exam_official, exam_id = guess_exam_official(title)

            if not official: official = exam_official
            if official and "sarkariresult" in official: official = exam_official

            if not official: continue # don't insert fake link

            data = {
                "title": title[:250],
                "organization": title.split()[0],
                "official_link": official,
                "pdf_url": pdf,
                "exam_id": exam_id,
                "notification_date": None
            }
            try:
                supabase.table("notifications").upsert(data, on_conflict="title").execute()
                count+=1
            except Exception as e:
                print(f"skip {title}: {e}")

    print(f"Inserted {count} with REAL govt links")

if __name__ == "__main__":
    scrape()
