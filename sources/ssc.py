
import requests
from bs4 import BeautifulSoup
from datetime import datetime

def scrape():
    results = []
    try:
        url = "https://ssc.gov.in"
        r = requests.get(url, timeout=15, headers={"User-Agent":"Mozilla/5.0"})
        soup = BeautifulSoup(r.text, 'lxml')
        # SSC structure changes often, this is resilient logic
        for a in soup.select("a")[:100]:
            txt = a.get_text(strip=True)
            if any(k in txt.lower() for k in ["notice","notification","cgl","chsl","mts","gd"]):
                if len(txt) > 10:
                    results.append({
                        "title": txt[:200],
                        "organization": "SSC",
                        "category": "SSC",
                        "official_link": a.get('href') if a.get('href','').startswith('http') else url + a.get('href',''),
                        "pdf_url": a.get('href',''),
                        "notification_date": datetime.now().date().isoformat(),
                        "status": "New"
                    })
        print(f"SSC: Found {len(results)}")
    except Exception as e:
        print(f"SSC scrape error: {e}")
    return results[:8]
