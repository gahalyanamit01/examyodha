
from datetime import datetime
def scrape_all():
    # Template - add real scrapers for UPPSC, BPSC, MPSC, RPSC, MPPSC, TNPSC, KPSC
    states = [
        ("UPPSC PCS 2026 Prelims Notification", "UPPSC", "State PCS", "https://uppsc.up.nic.in"),
        ("BPSC 71st CCE 2026 Notification Out", "BPSC", "State PCS", "https://bpsc.bih.nic.in"),
        ("MPSC Rajyaseva 2026 Notification", "MPSC", "State PCS", "https://mpsc.gov.in"),
        ("RPSC RAS 2026 Notification", "RPSC", "State PCS", "https://rpsc.rajasthan.gov.in"),
        ("MPPSC State Service 2026", "MPPSC", "State PCS", "https://mppsc.mp.gov.in"),
    ]
    return [{"title": t, "organization": org, "category": cat, "official_link": link, "notification_date": datetime.now().date().isoformat(), "status": "New"} for t, org, cat, link in states]
