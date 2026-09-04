
import os
import re
import requests
from bs4 import BeautifulSoup
from supabase import create_client
from datetime import datetime

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_KEY:
    print("Missing SUPABASE_URL or SERVICE_KEY secrets")
    exit(1)

supabase = create_client(SUPABASE_URL, SERVICE_KEY)
print("Connected to Supabase")

# Sites to try (first one is your target)
SITES = [
    "https://sarkariresult.com.cm/",
    "https://sarkariresult.com/",
    "https://www.sarkariresult.com.cm/",
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
}

ORG_KEYWORDS = ["UPSC", "SSC", "IBPS", "SBI", "RRB", "LIC", "UPPSC", "BPSC", "MPSC", "UPSSSC", "Railway", "Bank", "Police", "Navy", "Air Force", "Army"]

def detect_org(title):
    t = title.upper()
    for org in ORG_KEYWORDS:
        if org.upper() in t:
            return org
    return "Govt"

def detect_category(title):
    tl = title.lower()
    if "admit card" in tl:
        return "admit_cards"
    elif "result" in tl or "merit list" in tl or "cut off" in tl:
        return "results"
    else:
        return "notifications"

def scrape_site(url):
    try:
        print(f"Fetching {url}")
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "lxml")
        # Find all links that look like jobs
        links = []
        for a in soup.find_all("a", href=True):
            text = a.get_text(strip=True)
            href = a["href"]
            if len(text) < 15:  # skip short menu links
                continue
            if len(text) > 150:
                continue
            # Filter job-like titles
            if any(k in text.lower() for k in ["result", "admit", "notification", "recruitment", "apply", "vacancy", "exam", "form", "2025", "2026"]):
                links.append((text, href))
        print(f"Found {len(links)} candidates from {url}")
        return links
    except Exception as e:
        print(f"Failed {url}: {e}")
        return []

all_jobs = []
for site in SITES:
    jobs = scrape_site(site)
    all_jobs.extend(jobs)
    if len(all_jobs) > 20:
        break

# Deduplicate by title
seen = set()
unique_jobs = []
for title, link in all_jobs:
    if title.lower() not in seen:
        seen.add(title.lower())
        unique_jobs.append((title, link))

print(f"Total unique jobs: {len(unique_jobs)}")

inserted = {"notifications":0, "admit_cards":0, "results":0}

for title, link in unique_jobs[:40]:  # limit to 40 per day
    org = detect_org(title)
    table = detect_category(title)
    
    # Check duplicate in that table
    try:
        exists = supabase.table(table).select("id").eq("title", title).execute()
        if exists.data and len(exists.data) > 0:
            continue
    except Exception as e:
        print(f"Check error {e}")
        continue

    data = {
        "title": title,
        "organization": org,
    }
    # Add extra columns if table supports them
    if table == "notifications":
        data["category"] = org
        data["official_link"] = link if link.startswith("http") else f"https://sarkariresult.com.cm{link}" if link.startswith("/") else link
    elif table == "admit_cards":
        # admit_cards schema: title, organization, exam_date, download_link
        try:
            data["download_link"] = link
            data["exam_date"] = datetime.now().date().isoformat()
        except: pass
    elif table == "results":
        data["official_link"] = link if "official_link" in str(supabase.table(table).select("*").limit(1).execute()) else None
        # we try to insert only title/org if schema is minimal
        # remove None values
        data = {k:v for k,v in data.items() if v is not None}
        # fallback: if official_link column doesn't exist, keep only title/org
        if table == "results":
            # results table we made nullable, so try with official_link first
            pass

    try:
        # Try full insert, if fails try minimal
        supabase.table(table).insert(data).execute()
        inserted[table] += 1
        print(f"Inserted [{table}] {title}")
    except Exception as e:
        # Fallback minimal insert
        try:
            minimal = {"title": title, "organization": org}
            if table == "notifications":
                minimal["category"] = org
                minimal["official_link"] = link
            supabase.table(table).insert(minimal).execute()
            inserted[table] += 1
            print(f"Inserted minimal [{table}] {title}")
        except Exception as e2:
            print(f"Failed {title}: {e2}")

print(f"DONE - Inserted: {inserted}")

# Also ensure exams table has data
try:
    ex = supabase.table("exams").select("id").limit(1).execute()
    if not ex.data:
        for name, full in [("UPSC","Union Public Service Commission"), ("SSC","Staff Selection Commission"), ("IBPS","Banking"), ("SBI","State Bank of India"), ("RRB","Railway Recruitment Board")]:
            supabase.table("exams").insert({"name": full, "short_name": name}).execute()
except: pass
