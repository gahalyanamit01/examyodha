
import os
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SERVICE_KEY)

# Notifications
for title, org in [
    ("UPSC CSE 2026 Notification", "UPSC"),
    ("SSC CGL 2026 Registration", "SSC"),
    ("IBPS PO Admit Card", "IBPS"),
]:
    try:
        supabase.table("notifications").insert({"title": title, "organization": org, "category": org, "official_link": "https://sarkariresult.com.cm/"}).execute()
    except: pass

# Admit Cards
for title, org in [
    ("UPSC Admit Card 2026", "UPSC"),
    ("SSC CGL Admit Card", "SSC"),
]:
    try:
        supabase.table("admit_cards").insert({"title": title, "organization": org, "download_link": "https://sarkariresult.com.cm/"}).execute()
    except: pass

# Results
for title, org in [
    ("UPSC Final Result", "UPSC"),
    ("SSC CGL Result", "SSC"),
]:
    try:
        supabase.table("results").insert({"title": title, "organization": org}).execute()
    except: pass

print("Done - all 3 tables filled")
