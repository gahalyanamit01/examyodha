import os, requests
from bs4 import BeautifulSoup
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

HEADERS = {"User-Agent": "Mozilla/5.0"}
OFFICIAL_DOMAINS = ["gov.in", "nic.in"]

def get_type(title):
    t = title.lower()
    if "result" in t or "merit" in t: return "result"
    if "admit" in t or "hall ticket" in t or "call letter" in t: return "admit card"
    return "notification"

def find_exam_id(title, exams):
    # longest name match first
    title_l = title.lower()
    for e in sorted(exams, key=lambda x: len(x['name']), reverse=True):
        if e['name'].split()[0].lower() in title_l or e['state'].lower() in title_l:
            # e.g. "Rajasthan Police" matches "Rajasthan Police Constable 2026"
            if e['name'].lower().split()[0] in title_l:
                return e['id']
        # second check: state name present
        if e['state'].lower()!= 'central' and e['state'].lower() in title_l:
            return e['id']
    return None

def scrape():
    exams = supabase.table("exams").select("id,name,state,official_website").execute().data
    urls = ["https://sarkariresult.com.cm/", "https://sarkariresult.com.cm/page/2/"]
    all_links = []
    for base in urls:
        try:
            r = requests.get(base, headers=HEADERS, timeout=20)
            soup = BeautifulSoup(r.text, "lxml")
            for a in soup.find_all("a", href=True):
                txt = a.get_text(strip=True)
                href = a['href']
                if len(txt) > 15 and "http" in href and len(all_links) < 400:
                    all_links.append((txt, href))
        except: pass

    print(f"Found {len(all_links)} links")
    for title, detail_url in all_links[:250]:
        if "sarkariresult" not in detail_url: continue
        exam_id = find_exam_id(title, exams)
        # fallback official link = exam's official site
        official = next((e['official_website'] for e in exams if e['id']==exam_id), "https://ssc.gov.in") if exam_id else "https://ssc.gov.in"

        data = {
            "title": title[:250],
            "organization": title.split()[0],
            "official_link": official,
            "type": get_type(title),
            "exam_id": exam_id
        }
        try:
            supabase.table("notifications").upsert(data, on_conflict="title").execute()
        except: pass
    print("Done - state exams will now auto-map")

if __name__ == "__main__":
    scrape()
