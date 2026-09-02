
import os, datetime
from dotenv import load_dotenv
from supabase import create_client
from sources import ssc, upsc, ibps, rrb, state_pcs

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print(f"[{datetime.datetime.now()}] Starting daily scrape...")

all_data = []
all_data += ssc.scrape()
all_data += upsc.scrape()
all_data += ibps.scrape()
all_data += rrb.scrape()
all_data += state_pcs.scrape_all()

# AI summary placeholder + dedup
for item in all_data:
    # Avoid copyright: rewrite title to summary (you can call OpenAI here)
    item['summary'] = f"{item['organization']} has released {item['title']}. Check official link for details. Last date {item.get('last_date','TBA')}"
    try:
        supabase.table("notifications").upsert(item, on_conflict="title,organization").execute()
        print(f"Upserted: {item['title']}")
    except Exception as e:
        print(f"Error {item['title']}: {e}")

# Trigger Vercel rebuild
import requests
hook = os.getenv("VERCEL_DEPLOY_HOOK")
if hook:
    requests.post(hook)
    print("Vercel rebuild triggered")

print(f"Done. Total: {len(all_data)} notifications processed.")
