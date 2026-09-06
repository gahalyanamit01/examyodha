import os, requests
from bs4 import BeautifulSoup
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

HEADERS = {"User-Agent": "Mozilla/5.0"}
OFFICIAL = ["gov.in", "nic.in", "bank.in", "bpsc.bihar.gov.in", "mpsc.gov.in", "ibps.in", "sbi.co.in", "ssc.gov.in", "rrbapply.gov.in", "licindia.in"]

def get_type(title):
    t = title.lower()
    if "result" in t or "merit list" in t: return "result"
    if "admit card" in t or "hall ticket" in t or "call letter" in t: return "admit card"
    if "answer key" in t: return "answer key"
    return "notification"

def extract_official(detail_url):
    try:
        r = requests.get(detail_url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(r.text, "lxml")
        pdf, official = None, None
        for a in soup.find_all("a", href=True):
            href = a['href']
            if "sarkariresult" in href: continue
            if any(d in href for d in OFFICIAL):
                if href.endswith(".pdf") and not pdf: pdf = href
                elif not official: official = href
        return pdf, official
    except: return None, None

def scrape():
    base = "https://sarkariresult.com.cm"
    r = requests.get(base, headers=HEADERS, timeout=20)
    soup = BeautifulSoup(r.text, "lxml")
    exams = supabase.table("exams").select("id,name,official_website").execute().data

    for a in soup.select("a")[:50]:
        title = a.get_text(strip=True)
        href = a.get("href")
        if not href or len(title) < 15: continue
        if not href.startswith("http"): href = base + href
        if len(title) < 20: continue

        pdf, official = extract_official(href)
        # fallback to exam official website
        exam_match = next((e for e in exams if e['name'].lower().split()[0] in title.lower()), None)
        if not official: official = exam_match['official_website'] if exam_match else "https://ssc.gov.in"

        data = {
            "title": title[:250],
            "organization": title.split()[0],
            "official_link": official,
            "pdf_url": pdf,
            "type": get_type(title),
            "exam_id": exam_match['id'] if exam_match else None
        }
        supabase.table("notifications").upsert(data, on_conflict="title").execute()
    print("Done - saved with official links + type")

if __name__ == "__main__":
    scrape()
