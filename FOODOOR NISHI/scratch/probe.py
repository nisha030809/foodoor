import urllib.request
import json

base = "http://localhost:5000"

# 1. Health
with urllib.request.urlopen(f"{base}/api/health") as res:
    data = json.loads(res.read().decode('utf-8'))
    print("HEALTH OK:", data["status"])

# 2. Food
with urllib.request.urlopen(f"{base}/api/food") as res:
    foods = json.loads(res.read().decode('utf-8'))["data"]
    print(f"FOOD ITEMS ({len(foods)} items):")
    for f in foods:
        print(f" - {f['name']}: Rs {f['price']}")

# 3. Analytics
with urllib.request.urlopen(f"{base}/api/analytics") as res:
    an = json.loads(res.read().decode('utf-8'))
    print("ANALYTICS TOTAL REVENUE: Rs", an['kpis']['total_revenue'])
    print("SAMPLE SALES CHART BAR:", an['sales_chart'][0])

# 4. Recommendations
with urllib.request.urlopen(f"{base}/api/ai/recommendations") as res:
    recs = json.loads(res.read().decode('utf-8'))
    print("BUDGET COMBOS:")
    for b in recs.get('budget_meals', []):
        print(f" - {b['main']} + {b['dessert']}: Rs {b['combo_price']} (was Rs {b['original_price']}, save Rs {b['savings']})")

# 5. Frontend Root
with urllib.request.urlopen(f"{base}/") as res:
    html = res.read().decode('utf-8')
    print("FRONTEND HTML OK, length:", len(html))
