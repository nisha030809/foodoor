"""
FOODOOR - Unified Full-Stack Cloud Kitchen Platform Server (Python + Scikit-Learn Engine)
Serves REST API, AI Demand Forecaster, Inventory Management, and Modern Frontend SPA.
"""

import os
import sys
import json
import mimetypes
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Add ai_engine to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'ai_engine'))
from demand_forecaster import CloudKitchenForecaster, generate_synthetic_historical_data
from recommender import recommend_similar_dishes, recommend_by_user_preferences, get_budget_meal_combos, FOOD_CATALOG
from inventory_optimizer import analyze_inventory_health, simulate_order_consumption

PORT = int(os.environ.get('PORT', 5000))
PUBLIC_DIR = os.path.join(os.path.dirname(__file__), 'public')

# Train AI Forecaster once at startup
print("Training Scikit-Learn RandomForest Demand Forecaster...")
synth_df = generate_synthetic_historical_data(days=60)
forecaster = CloudKitchenForecaster()
forecaster.train(synth_df)
print("Forecaster Model Ready!")

# In-Memory State
CATEGORIES = [
    {"id": "cat-1", "name": "Artisan Burgers", "slug": "artisan-burgers", "icon": "🍔", "description": "Smashed Angus patties and truffle glazes", "items_count": 1},
    {"id": "cat-2", "name": "Woodfired Pizza", "slug": "woodfired-pizza", "icon": "🍕", "description": "72-hour sourdough and creamy burrata", "items_count": 1},
    {"id": "cat-3", "name": "Bowls & Curries", "slug": "bowls-curries", "icon": "🍛", "description": "Slow-simmered aromatic gravies with saffron basmati", "items_count": 2},
    {"id": "cat-4", "name": "Healthy Salads", "slug": "healthy-salads", "icon": "🥗", "description": "Farm-fresh organic greens and superfood grains", "items_count": 1},
    {"id": "cat-5", "name": "Asian Wok", "slug": "asian-wok", "icon": "🍜", "description": "Hand-pulled ramen and spicy gochujang wings", "items_count": 2},
    {"id": "cat-6", "name": "Desserts & Shakes", "slug": "desserts-shakes", "icon": "🍰", "description": "Belgian molten lava cakes and artisan gelato", "items_count": 1}
]

FOOD_ITEMS = [
    {
        "id": "food-1",
        "categoryId": "cat-1",
        "name": "Truffle Glazed Smash Burger",
        "description": "Double smash Angus beef, black truffle aioli, aged English cheddar, crispy shallots, and toasted brioche bun.",
        "price": 249,
        "prep_time_minutes": 14,
        "calories": 780,
        "protein_g": 44,
        "carbs_g": 52,
        "fat_g": 38,
        "is_vegetarian": False,
        "is_vegan": False,
        "is_gluten_free": False,
        "spice_level": 1,
        "is_available": True,
        "is_featured": True,
        "rating": 4.9,
        "reviews_count": 142,
        "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        "ingredients": ["Angus Ground Beef", "Brioche Bun", "Truffle Aioli", "Aged Cheddar", "Shallots", "Butter"],
        "allergens": ["Gluten", "Dairy", "Eggs"]
    },
    {
        "id": "food-2",
        "categoryId": "cat-2",
        "name": "Artisanal Burrata Margherita Pizza",
        "description": "Neapolitan crust, DOP San Marzano tomato reduction, whole creamy Pugliese burrata, fresh basil, and cold-pressed olive oil.",
        "price": 299,
        "prep_time_minutes": 16,
        "calories": 820,
        "protein_g": 32,
        "carbs_g": 88,
        "fat_g": 36,
        "is_vegetarian": True,
        "is_vegan": False,
        "is_gluten_free": False,
        "spice_level": 0,
        "is_available": True,
        "is_featured": True,
        "rating": 4.95,
        "reviews_count": 218,
        "image_url": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
        "ingredients": ["00 Sourdough Flour", "San Marzano Tomatoes", "Burrata Cheese", "Fresh Basil", "Extra Virgin Olive Oil"],
        "allergens": ["Gluten", "Dairy"]
    },
    {
        "id": "food-3",
        "categoryId": "cat-3",
        "name": "Smoked Butter Chicken Rice Bowl",
        "description": "Tandoor-charred chicken thigh steeped in a velvety tomato makhani sauce, topped with fenugreek and served over aged saffron basmati rice.",
        "price": 249,
        "prep_time_minutes": 15,
        "calories": 690,
        "protein_g": 48,
        "carbs_g": 65,
        "fat_g": 28,
        "is_vegetarian": False,
        "is_vegan": False,
        "is_gluten_free": True,
        "spice_level": 2,
        "is_available": True,
        "is_featured": True,
        "rating": 4.88,
        "reviews_count": 310,
        "image_url": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
        "ingredients": ["Free-Range Chicken", "Makhani Gravy", "Basmati Rice", "Churned Butter", "Ginger", "Kasuri Methi"],
        "allergens": ["Dairy"]
    },
    {
        "id": "food-4",
        "categoryId": "cat-4",
        "name": "Avocado Superfood Grain Bowl",
        "description": "Sliced Hass avocado, organic tricolor quinoa, massaged Tuscan kale, roasted chickpeas, pickled radish, and lemon tahini dressing.",
        "price": 199,
        "prep_time_minutes": 10,
        "calories": 480,
        "protein_g": 18,
        "carbs_g": 58,
        "fat_g": 22,
        "is_vegetarian": True,
        "is_vegan": True,
        "is_gluten_free": True,
        "spice_level": 0,
        "is_available": True,
        "is_featured": False,
        "rating": 4.82,
        "reviews_count": 94,
        "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
        "ingredients": ["Hass Avocado", "Tricolor Quinoa", "Tuscan Kale", "Chickpeas", "Lemon Tahini Dressing"],
        "allergens": ["Sesame"]
    },
    {
        "id": "food-5",
        "categoryId": "cat-5",
        "name": "Crispy Korean Gochujang Wings",
        "description": "Double-fried crispy chicken wings glazed in sticky sweet-spicy gochujang chili sauce, toasted white sesame, and scallions.",
        "price": 199,
        "prep_time_minutes": 18,
        "calories": 620,
        "protein_g": 42,
        "carbs_g": 34,
        "fat_g": 30,
        "is_vegetarian": False,
        "is_vegan": False,
        "is_gluten_free": False,
        "spice_level": 3,
        "is_available": True,
        "is_featured": True,
        "rating": 4.91,
        "reviews_count": 175,
        "image_url": "https://images.unsplash.com/photo-1527477378408-1bc0932147d3?auto=format&fit=crop&w=800&q=80",
        "ingredients": ["Chicken Wings", "Gochujang Paste", "Honey", "Rice Vinegar", "Toasted Sesame"],
        "allergens": ["Soy", "Gluten", "Sesame"]
    },
    {
        "id": "food-6",
        "categoryId": "cat-6",
        "name": "Belgian Dark Chocolate Molten Lava",
        "description": "Rich 70% Callebaut dark chocolate cake with a warm flowing fudge center, dusted with Dutch cocoa and served with vanilla bean creme.",
        "price": 149,
        "prep_time_minutes": 8,
        "calories": 490,
        "protein_g": 8,
        "carbs_g": 54,
        "fat_g": 26,
        "is_vegetarian": True,
        "is_vegan": False,
        "is_gluten_free": False,
        "spice_level": 0,
        "is_available": True,
        "is_featured": False,
        "rating": 4.96,
        "reviews_count": 240,
        "image_url": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
        "ingredients": ["70% Belgian Chocolate", "Butter", "Eggs", "Cane Sugar", "Flour"],
        "allergens": ["Gluten", "Dairy", "Eggs"]
    },
    {
        "id": "food-7",
        "categoryId": "cat-3",
        "name": "Fire-Roasted Paneer Tikka Masala",
        "description": "Cottage cheese cubes marinated in yogurt and Kashmiri chili, flame-seared and simmered in a spiced bell pepper and cashew-onion sauce.",
        "price": 229,
        "prep_time_minutes": 15,
        "calories": 610,
        "protein_g": 34,
        "carbs_g": 48,
        "fat_g": 32,
        "is_vegetarian": True,
        "is_vegan": False,
        "is_gluten_free": True,
        "spice_level": 2,
        "is_available": True,
        "is_featured": False,
        "rating": 4.85,
        "reviews_count": 129,
        "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
        "ingredients": ["Artisan Paneer", "Bell Peppers", "Cashew Onion Gravy", "Greek Yogurt", "Basmati Rice"],
        "allergens": ["Dairy", "Tree Nuts"]
    },
    {
        "id": "food-8",
        "categoryId": "cat-5",
        "name": "Spicy Tokyo Shoyu Ramen Bowl",
        "description": "Hand-pulled wavy noodles, 18-hour chicken and dashi broth, torched chashu chicken, soft-boiled ajitsuke egg, nori sheet, and black garlic oil.",
        "price": 279,
        "prep_time_minutes": 16,
        "calories": 710,
        "protein_g": 40,
        "carbs_g": 78,
        "fat_g": 26,
        "is_vegetarian": False,
        "is_vegan": False,
        "is_gluten_free": False,
        "spice_level": 2,
        "is_available": True,
        "is_featured": True,
        "rating": 4.89,
        "reviews_count": 188,
        "image_url": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        "ingredients": ["Wheat Ramen Noodles", "Slow-Cooked Shoyu Broth", "Chashu Chicken", "Ajitsuke Egg", "Nori"],
        "allergens": ["Gluten", "Soy", "Eggs"]
    },
    {
        "id": "food-9",
        "categoryId": "cat-1",
        "name": "Crispy Peri Peri Fries",
        "description": "Crispy golden potato skin-on fries tossed in hot peri-peri spice dust, served with creamy chipotle dip.",
        "price": 99,
        "prep_time_minutes": 8,
        "calories": 360,
        "protein_g": 5,
        "carbs_g": 46,
        "fat_g": 16,
        "is_vegetarian": True,
        "is_vegan": True,
        "is_gluten_free": True,
        "spice_level": 2,
        "is_available": True,
        "is_featured": False,
        "rating": 4.88,
        "reviews_count": 96,
        "image_url": "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
        "ingredients": ["Russet Potatoes", "Peri Peri Seasoning", "Sea Salt", "Sunflower Oil"],
        "allergens": []
    }
]

INVENTORY = [
    {"id": "inv-1", "ingredient_name": "Ground Beef Patty (Premium Angus)", "category": "Meat & Poultry", "unit": "kg", "current_stock": 14.5, "minimum_threshold": 12.0, "reorder_quantity": 40.0, "unit_cost": 320.00, "status": "optimal"},
    {"id": "inv-2", "ingredient_name": "Brioche Burger Buns", "category": "Bakery", "unit": "units", "current_stock": 18.0, "minimum_threshold": 30.0, "reorder_quantity": 100.0, "unit_cost": 15.00, "status": "critical"},
    {"id": "inv-3", "ingredient_name": "Fresh Burrata Cheese", "category": "Dairy", "unit": "kg", "current_stock": 6.8, "minimum_threshold": 8.0, "reorder_quantity": 20.0, "unit_cost": 450.00, "status": "low"},
    {"id": "inv-4", "ingredient_name": "San Marzano Tomato Sauce", "category": "Pantry", "unit": "liters", "current_stock": 24.0, "minimum_threshold": 10.0, "reorder_quantity": 50.0, "unit_cost": 95.00, "status": "optimal"},
    {"id": "inv-5", "ingredient_name": "Marinated Boneless Chicken", "category": "Meat & Poultry", "unit": "kg", "current_stock": 22.0, "minimum_threshold": 15.0, "reorder_quantity": 60.0, "unit_cost": 280.00, "status": "optimal"},
    {"id": "inv-6", "ingredient_name": "Aromatic Basmati Rice", "category": "Grains", "unit": "kg", "current_stock": 45.0, "minimum_threshold": 20.0, "reorder_quantity": 100.0, "unit_cost": 85.00, "status": "optimal"},
    {"id": "inv-7", "ingredient_name": "Ripe Hass Avocados", "category": "Produce", "unit": "units", "current_stock": 15.0, "minimum_threshold": 25.0, "reorder_quantity": 60.0, "unit_cost": 65.00, "status": "low"},
    {"id": "inv-8", "ingredient_name": "Belgian Dark Chocolate (70%)", "category": "Bakery", "unit": "kg", "current_stock": 8.5, "minimum_threshold": 5.0, "reorder_quantity": 15.0, "unit_cost": 550.00, "status": "optimal"}
]

ORDERS = [
    {
        "id": "ord-1001",
        "order_number": "FD-8921",
        "customer_name": "Sarah Sharma",
        "customer_phone": "+91 98201 45892",
        "status": "kitchen_prep",
        "created_at": datetime.now().isoformat(),
        "status_timestamps": {"received": datetime.now().isoformat(), "kitchen_prep": datetime.now().isoformat()},
        "items": [
            {"food_id": "food-1", "food_name": "Truffle Glazed Smash Burger", "price": 249, "quantity": 2, "total_price": 498},
            {"food_id": "food-6", "food_name": "Belgian Dark Chocolate Molten Lava", "price": 149, "quantity": 1, "total_price": 149}
        ],
        "total": 714,
        "estimated_delivery_minutes": 22
    },
    {
        "id": "ord-1002",
        "order_number": "FD-8922",
        "customer_name": "Marcus Verma",
        "customer_phone": "+91 98712 30914",
        "status": "ready_dispatch",
        "created_at": datetime.now().isoformat(),
        "status_timestamps": {"received": datetime.now().isoformat(), "ready_dispatch": datetime.now().isoformat()},
        "items": [
            {"food_id": "food-2", "food_name": "Artisanal Burrata Margherita Pizza", "price": 299, "quantity": 1, "total_price": 299}
        ],
        "total": 349,
        "estimated_delivery_minutes": 10
    }
]

REVIEWS = [
    {"id": "rev-1", "food_id": "food-1", "customer_name": "David K.", "rating": 5, "comment": "Truffle glaze on the smash burger is restaurant grade!", "created_at": "2026-11-04"},
    {"id": "rev-2", "food_id": "food-2", "customer_name": "Amara Patel", "rating": 5, "comment": "Real burrata on delivery pizza is rare. Perfectly charred crust.", "created_at": "2026-11-05"},
    {"id": "rev-3", "food_id": "food-3", "customer_name": "Liam O'Connor", "rating": 5, "comment": "Butter chicken bowl was smoky, aromatic, and portion was generous.", "created_at": "2026-11-05"}
]

class FoodoorHandler(BaseHTTPRequestHandler):
    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data, indent=2).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        # 1. API Health
        if path == '/api/health':
            return self._send_json({
                "status": "operational",
                "platform": "FOODOOR Cloud Kitchen & Delivery",
                "ai_model": "Smart Cloud Kitchen Intelligence",
                "version": "2.0.0"
            })

        # 2. Categories
        if path == '/api/categories':
            return self._send_json({"status": "success", "data": CATEGORIES})

        # 3. Food Items
        if path == '/api/food':
            res = list(FOOD_ITEMS)
            if 'category' in params:
                cat_id = params['category'][0]
                res = [f for f in res if f.get('categoryId') == cat_id]
            if 'search' in params:
                q = params['search'][0].lower()
                res = [f for f in res if q in f['name'].lower() or q in f['description'].lower()]
            return self._send_json({"status": "success", "count": len(res), "data": res})

        # 4. Inventory
        if path == '/api/inventory':
            low = len([i for i in INVENTORY if i['status'] != 'optimal'])
            tot = sum(i['current_stock'] * i['unit_cost'] for i in INVENTORY)
            return self._send_json({
                "status": "success",
                "total_items": len(INVENTORY),
                "low_stock_count": low,
                "total_inventory_value": round(tot, 2),
                "data": INVENTORY
            })

        # 5. Orders
        if path == '/api/orders':
            return self._send_json({"status": "success", "count": len(ORDERS), "data": ORDERS})

        # 6. Reviews
        if path == '/api/reviews':
            return self._send_json({"status": "success", "data": REVIEWS})

        # 7. AI Demand Forecast (Machine Learning)
        if path == '/api/ai/forecast':
            weather = params.get('weather', ['Clear'])[0]
            forecast = forecaster.predict_next_24_hours(weather_forecast=weather)
            forecast['seven_day_outlook'] = forecaster.predict_7_day_outlook()
            return self._send_json(forecast)

        # 8. AI Recommendations
        if path == '/api/ai/recommendations':
            featured = [f for f in FOOD_ITEMS if f.get('is_featured')]
            return self._send_json({
                "status": "success",
                "ai_chefs_picks": featured,
                "budget_meals": [
                    {
                        "main": "Truffle Glazed Smash Burger",
                        "dessert": "Belgian Dark Chocolate Molten Lava",
                        "combo_price": 349,
                        "original_price": 398,
                        "savings": 49,
                        "ai_match_tag": "Savory & Sweet Pair"
                    },
                    {
                        "main": "Avocado Superfood Grain Bowl",
                        "dessert": "Belgian Dark Chocolate Molten Lava",
                        "combo_price": 299,
                        "original_price": 348,
                        "savings": 49,
                        "ai_match_tag": "Guilt-Free Balance"
                    }
                ]
            })

        # 9. Analytics
        if path == '/api/analytics':
            total_rev = sum(o.get('total', 0) for o in ORDERS)
            return self._send_json({
                "status": "success",
                "kpis": {
                    "total_revenue": round(total_rev + 184500.00, 2),
                    "total_orders": len(ORDERS) + 740,
                    "waste_reduction_rate": "77.1%",
                    "average_prep_time_minutes": 15.4
                },
                "sales_chart": [
                    {"date": "Nov 01", "revenue": 28400, "orders": 152},
                    {"date": "Nov 02", "revenue": 31200, "orders": 168},
                    {"date": "Nov 03", "revenue": 29800, "orders": 159},
                    {"date": "Nov 04", "revenue": 34500, "orders": 182},
                    {"date": "Nov 05", "revenue": 42100, "orders": 215},
                    {"date": "Nov 06", "revenue": 51400, "orders": 254}
                ],
                "hourly_rush": [
                    {"hour": "11 AM", "orders": 28},
                    {"hour": "12 PM", "orders": 94},
                    {"hour": "1 PM", "orders": 112},
                    {"hour": "2 PM", "orders": 65},
                    {"hour": "3 PM", "orders": 32},
                    {"hour": "6 PM", "orders": 74},
                    {"hour": "7 PM", "orders": 128},
                    {"hour": "8 PM", "orders": 145},
                    {"hour": "9 PM", "orders": 104}
                ]
            })

        # Static File Serving
        rel_path = path.lstrip('/')
        if not rel_path:
            rel_path = 'index.html'

        file_path = os.path.join(PUBLIC_DIR, rel_path)
        if not os.path.isfile(file_path):
            file_path = os.path.join(PUBLIC_DIR, 'index.html')

        if os.path.isfile(file_path):
            mime_type, _ = mimetypes.guess_type(file_path)
            self.send_response(200)
            self.send_header('Content-Type', mime_type or 'text/html')
            self.end_headers()
            with open(file_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'404 Not Found')

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length).decode('utf-8')) if length > 0 else {}

        if path == '/api/orders':
            new_ord = {
                "id": f"ord-{int(datetime.now().timestamp()*1000)}",
                "order_number": f"FD-{int(datetime.now().timestamp()) % 10000}",
                "customer_name": body.get("customer_name", "Valued Foodie"),
                "customer_phone": body.get("customer_phone", "+91 98201 45892"),
                "status": "received",
                "created_at": datetime.now().isoformat(),
                "status_timestamps": {"received": datetime.now().isoformat()},
                "items": body.get("items", []),
                "total": body.get("total", 629.00),
                "estimated_delivery_minutes": 25
            }
            ORDERS.insert(0, new_ord)

            # Auto-deplete inventory
            simulate_order_consumption(body.get("items", []))
            return self._send_json({"status": "success", "order": new_ord}, status=201)

        if path == '/api/food':
            new_dish = {
                "id": f"food-{int(datetime.now().timestamp()*1000)}",
                **body,
                "is_available": True,
                "rating": 5.0,
                "reviews_count": 0
            }
            FOOD_ITEMS.insert(0, new_dish)
            return self._send_json({"status": "success", "data": new_dish}, status=201)

        if path == '/api/reviews':
            new_rev = {
                "id": f"rev-{int(datetime.now().timestamp()*1000)}",
                **body,
                "created_at": datetime.now().isoformat()
            }
            REVIEWS.insert(0, new_rev)
            return self._send_json({"status": "success", "data": new_rev}, status=201)

        self._send_json({"error": "Not Found"}, status=404)

    def do_PATCH(self):
        parsed = urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length).decode('utf-8')) if length > 0 else {}

        # Advance order: /api/orders/<id>/advance
        if '/api/orders/' in path and path.endswith('/advance'):
            parts = path.split('/')
            ord_id = parts[3]
            order = next((o for o in ORDERS if o['id'] == ord_id), None)
            if not order:
                return self._send_json({"error": "Order not found"}, 404)

            stages = ['received', 'confirmed', 'kitchen_prep', 'quality_check', 'ready_dispatch', 'delivered']
            cur_idx = stages.index(order['status']) if order['status'] in stages else 0
            if cur_idx < len(stages) - 1:
                next_stage = stages[cur_idx + 1]
                order['status'] = next_stage
                if 'status_timestamps' not in order:
                    order['status_timestamps'] = {}
                order['status_timestamps'][next_stage] = datetime.now().isoformat()
                if next_stage == 'delivered':
                    order['estimated_delivery_minutes'] = 0
                else:
                    order['estimated_delivery_minutes'] = max(0, order.get('estimated_delivery_minutes', 20) - 5)

            return self._send_json({"status": "success", "order": order})

        # Restock inventory: /api/inventory/<id>/restock
        if '/api/inventory/' in path and path.endswith('/restock'):
            parts = path.split('/')
            inv_id = parts[3]
            item = next((i for i in INVENTORY if i['id'] == inv_id), None)
            if not item:
                return self._send_json({"error": "Item not found"}, 404)

            add_qty = float(body.get('quantity', 20.0))
            item['current_stock'] = round(item['current_stock'] + add_qty, 2)
            item['status'] = 'optimal' if item['current_stock'] > item['minimum_threshold'] else 'low'
            return self._send_json({"status": "success", "item": item})

        # Toggle food availability: /api/food/<id>/availability
        if '/api/food/' in path and path.endswith('/availability'):
            parts = path.split('/')
            food_id = parts[3]
            dish = next((f for f in FOOD_ITEMS if f['id'] == food_id), None)
            if not dish:
                return self._send_json({"error": "Dish not found"}, 404)
            dish['is_available'] = not dish['is_available']
            return self._send_json({"status": "success", "data": dish})

        self._send_json({"error": "Not Found"}, status=404)

def run():
    server = HTTPServer(('', PORT), FoodoorHandler)
    print("=" * 60)
    print(f"  FOODOOR CLOUD KITCHEN PLATFORM RUNNING AT http://localhost:{PORT}")
    print("  Frontend UI, REST API, & Scikit-Learn AI Engine Active!")
    print("=" * 60)
    server.serve_forever()

if __name__ == '__main__':
    run()
