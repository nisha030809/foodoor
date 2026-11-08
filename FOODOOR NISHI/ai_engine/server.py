"""
FOODOOR AI Microservice Server
Exposes Demand Forecasting, Recommender, and Inventory Optimization over HTTP JSON API.
Configured for port 5001 with production CORS and health monitoring.
"""

import sys
import os
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Import AI modules
from demand_forecaster import CloudKitchenForecaster, generate_synthetic_historical_data
from recommender import recommend_similar_dishes, recommend_by_user_preferences, get_budget_meal_combos, FOOD_CATALOG
from inventory_optimizer import analyze_inventory_health, simulate_order_consumption

# Initialize and train forecaster once on startup
print("Initializing Scikit-Learn Forecaster...")
synthetic_data = generate_synthetic_historical_data(days=60)
forecaster = CloudKitchenForecaster()
forecaster.train(synthetic_data)
print("Forecaster Model Trained Successfully!")

PORT = int(os.environ.get('PORT', os.environ.get('AI_PORT', 5001)))

class AIRequestHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))

    def do_HEAD(self):
        self.do_GET()

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)

        # 1. AI Demand Forecast (24-Hour Curve + 7-Day Outlook)
        if parsed.path == '/api/ai/forecast':
            weather = params.get('weather', ['Clear'])[0]
            forecast_24h = forecaster.predict_next_24_hours(weather_forecast=weather)
            outlook_7d = forecaster.predict_7_day_outlook()
            forecast_24h['seven_day_outlook'] = outlook_7d
            self._send_json(forecast_24h)

        # 2. AI Recommendations & Value Combos
        elif parsed.path == '/api/ai/recommendations':
            dish_id = params.get('dish_id', [None])[0]
            if dish_id:
                similar = recommend_similar_dishes(dish_id)
                self._send_json({"status": "success", "similar_dishes": similar})
            else:
                featured = [f for f in FOOD_CATALOG if f.get('rating', 0) >= 4.88]
                combos = get_budget_meal_combos(budget=400.0)
                self._send_json({
                    "status": "success",
                    "ai_chefs_picks": featured,
                    "catalog": FOOD_CATALOG,
                    "budget_meals": [
                        {
                            "main": c["main"],
                            "dessert": c["dessert"],
                            "combo_price": c["total_price"],
                            "original_price": c["original_total"],
                            "savings": c["savings"],
                            "ai_match_tag": "AI Smart Combo"
                        } for c in combos[:4]
                    ]
                })

        # 3. Budget Meals Solver
        elif parsed.path == '/api/ai/budget-meals':
            budget = float(params.get('budget', [350.0])[0])
            combos = get_budget_meal_combos(budget=budget)
            self._send_json({"status": "success", "budget": budget, "combos": combos})

        # 4. Inventory Health & Depletion Analysis
        elif parsed.path == '/api/ai/inventory-health':
            health = analyze_inventory_health()
            self._send_json(health)

        # 5. Service Health Check
        elif parsed.path == '/api/ai/health' or parsed.path == '/health':
            self._send_json({
                "status": "operational",
                "service": "FOODOOR AI Intelligence Service",
                "model": "FOODOOR Smart Kitchen Intelligence",
                "ready": forecaster.is_trained,
                "port": PORT
            })
        else:
            self._send_json({"error": "Endpoint not found"}, status=404)

    def do_POST(self):
        parsed = urlparse(self.path)
        content_len = int(self.headers.get('Content-Length', 0))
        post_body = self.rfile.read(content_len).decode('utf-8') if content_len > 0 else "{}"
        try:
            body = json.loads(post_body)
        except Exception:
            body = {}

        if parsed.path == '/api/ai/personalized':
            recommendations = recommend_by_user_preferences(body)
            self._send_json({"status": "success", "recommendations": recommendations})

        elif parsed.path == '/api/ai/simulate-order':
            items = body.get('items', [])
            report = simulate_order_consumption(items)
            self._send_json({"status": "success", "depleted_ingredients": report})
        else:
            self._send_json({"error": "Endpoint not found"}, status=404)

def run():
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, AIRequestHandler)
    print(f"=======================================================")
    print(f"  FOODOOR AI Microservice running on http://localhost:{PORT}")
    print(f"  Ready for demand forecasting & recommendation queries")
    print(f"=======================================================")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
