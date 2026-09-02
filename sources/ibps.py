
import requests
from datetime import datetime
def scrape():
    # IBPS, SBI, LIC - Banking & Insurance
    return [
        {"title": "IBPS PO 2026 Notification Out - 5000+ Vacancies", "organization":"IBPS","category":"Banking","official_link":"https://ibps.in","notification_date":datetime.now().date().isoformat(),"last_date": "2026-09-15","status":"New"},
        {"title": "SBI Clerk 2026 Apply Online Begins", "organization":"SBI","category":"Banking","official_link":"https://sbi.co.in","notification_date":datetime.now().date().isoformat(),"status":"New"},
        {"title": "LIC AAO 2026 Recruitment Notification", "organization":"LIC","category":"Insurance","official_link":"https://licindia.in","notification_date":datetime.now().date().isoformat(),"status":"New"},
    ]
