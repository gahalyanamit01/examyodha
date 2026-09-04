import os
from supabase import create_client
from datetime import datetime, timedelta
import random

# Get env
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SERVICE_KEY:
    print("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY secrets")
    print(f"URL present: {bool(SUPABASE_URL)}, KEY present: {bool(SERVICE_KEY)}")
    exit(1)

supabase = create_client(SUPABASE_URL, SERVICE_KEY)

print("Connected to Supabase, fetching exams...")
exams_resp = supabase.table("exams").select("*").execute()
exams = exams_resp.data or []
print(f"Found {len(exams)} exams")

# Check existing notifications
notif_count = supabase.table("notifications").select("id", count="exact").execute()
print(f"Existing notifications: {notif_count.count}")

# Generate sample notifications for today if empty or always add fresh ones
today = datetime.now().strftime("%Y-%m-%d")

sample_titles = [
    "UPSC CSE 2026 Notification Released - Apply Online",
    "SSC CGL 2026 Registration Starts - Last Date 15 Oct",
    "IBPS PO 2026 Admit Card Out - Download Now",
    "SBI PO 2026 Result Declared - Check Merit List",
    "RRB NTPC 2026 Answer Key Released",
    "LIC AAO 2026 Vacancy 2026 Increased to 1000+",
    "UPPSC PCS 2026 Mains Exam Date Announced",
    "BPSC 71st Prelims Result 2026 Declared",
    "MPSC Rajyaseva 2026 Application Correction Window Open",
    "SSC CHSL 2026 Tier 1 Result Out"
]

types = ["Notification", "Admit Card", "Result", "Answer Key", "Vacancy"]

inserted = 0
for i, title in enumerate(sample_titles):
    # Avoid duplicates by title
    exists = supabase.table("notifications").select("id").eq("title", title).execute()
    if exists.data:
        print(f"Skipping duplicate: {title}")
        continue
    
    data = {
        "title": title,
        "notification_type": random.choice(types),
        "published_date": (datetime.now() - timedelta(days=random.randint(0,5))).strftime("%Y-%m-%d"),
        "source_url": "https://sarkariresult.com.cm/",
        "exam_id": random.choice(exams)["id"] if exams else None
    }
    try:
        supabase.table("notifications").insert(data).execute()
        inserted += 1
        print(f"Inserted: {title}")
    except Exception as e:
        print(f"Failed to insert {title}: {e}")

print(f"DONE! Inserted {inserted} new notifications")
