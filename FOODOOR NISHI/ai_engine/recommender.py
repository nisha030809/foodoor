"""
FOODOOR AI Engine - Personalized Food Recommendation & Discovery
Implements content-based filtering, similarity scoring, and budget optimization.
"""

import sys
import json
import numpy as np

# Sample Food Catalog with Feature Vectors
FOOD_CATALOG = [
    {
        "id": "food-1",
        "name": "Truffle Glazed Smash Burger",
        "category": "Artisan Burgers",
        "price": 249,
        "is_vegetarian": False,
        "is_vegan": False,
        "is_gluten_free": False,
        "spice_level": 1,
        "calories": 780,
        "prep_time_minutes": 14,
        "rating": 4.9,
        "tags": ["burger", "beef", "truffle", "savory", "comfort"],
        "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "food-2",
        "name": "Artisanal Burrata Margherita Pizza",
        "category": "Woodfired Pizza",
        "price": 299,
        "is_vegetarian": True,
        "is_vegan": False,
        "is_gluten_free": False,
        "spice_level": 0,
        "calories": 820,
        "prep_time_minutes": 16,
        "rating": 4.95,
        "tags": ["pizza", "cheese", "burrata", "italian", "vegetarian"],
        "image_url": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "food-3",
        "name": "Smoked Butter Chicken Rice Bowl",
        "category": "Bowls & Curries",
        "price": 249,
        "is_vegetarian": False,
        "is_vegan": False,
        "is_gluten_free": True,
        "spice_level": 2,
        "calories": 690,
        "prep_time_minutes": 15,
        "rating": 4.88,
        "tags": ["curry", "chicken", "rice", "aromatic", "gluten-free"],
        "image_url": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "food-4",
        "name": "Avocado Superfood Grain Bowl",
        "category": "Healthy Salads",
        "price": 199,
        "is_vegetarian": True,
        "is_vegan": True,
        "is_gluten_free": True,
        "spice_level": 0,
        "calories": 480,
        "prep_time_minutes": 10,
        "rating": 4.82,
        "tags": ["avocado", "quinoa", "healthy", "vegan", "gluten-free"],
        "image_url": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "food-5",
        "name": "Crispy Korean Gochujang Wings",
        "category": "Asian Wok",
        "price": 199,
        "is_vegetarian": False,
        "is_vegan": False,
        "is_gluten_free": False,
        "spice_level": 3,
        "calories": 620,
        "prep_time_minutes": 18,
        "rating": 4.91,
        "tags": ["wings", "korean", "spicy", "crispy", "chicken"],
        "image_url": "https://images.unsplash.com/photo-1527477378408-1bc0932147d3?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "food-6",
        "name": "Belgian Dark Chocolate Molten Lava",
        "category": "Desserts & Shakes",
        "price": 149,
        "is_vegetarian": True,
        "is_vegan": False,
        "is_gluten_free": False,
        "spice_level": 0,
        "calories": 490,
        "prep_time_minutes": 8,
        "rating": 4.96,
        "tags": ["chocolate", "dessert", "sweet", "cake", "warm"],
        "image_url": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "food-7",
        "name": "Fire-Roasted Paneer Tikka Masala",
        "category": "Bowls & Curries",
        "price": 229,
        "is_vegetarian": True,
        "is_vegan": False,
        "is_gluten_free": True,
        "spice_level": 2,
        "calories": 610,
        "prep_time_minutes": 15,
        "rating": 4.85,
        "tags": ["paneer", "curry", "rice", "vegetarian", "gluten-free"],
        "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "food-8",
        "name": "Spicy Tokyo Shoyu Ramen Bowl",
        "category": "Asian Wok",
        "price": 279,
        "is_vegetarian": False,
        "is_vegan": False,
        "is_gluten_free": False,
        "spice_level": 2,
        "calories": 710,
        "prep_time_minutes": 16,
        "rating": 4.89,
        "tags": ["ramen", "noodles", "japanese", "broth", "asian"],
        "image_url": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": "food-9",
        "name": "Crispy Peri Peri Fries",
        "category": "Artisan Burgers",
        "price": 99,
        "is_vegetarian": True,
        "is_vegan": True,
        "is_gluten_free": True,
        "spice_level": 2,
        "calories": 360,
        "prep_time_minutes": 8,
        "rating": 4.88,
        "tags": ["fries", "crispy", "snack", "peri-peri", "vegetarian"],
        "image_url": "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80"
    }
]

def calculate_dish_similarity(item_a, item_b):
    """Computes similarity score between two dishes based on category, spice, tags, and dietary overlap."""
    if item_a["id"] == item_b["id"]:
        return 0.0

    score = 0.0
    # Category match
    if item_a["category"] == item_b["category"]:
        score += 0.45

    # Dietary alignment
    if item_a["is_vegetarian"] == item_b["is_vegetarian"]:
        score += 0.15
    if item_a["is_gluten_free"] == item_b["is_gluten_free"]:
        score += 0.10

    # Spice closeness
    spice_diff = abs(item_a["spice_level"] - item_b["spice_level"])
    score += max(0, 0.15 - (spice_diff * 0.05))

    # Shared tags Jaccard similarity
    tags_a = set(item_a.get("tags", []))
    tags_b = set(item_b.get("tags", []))
    if tags_a and tags_b:
        jaccard = len(tags_a.intersection(tags_b)) / len(tags_a.union(tags_b))
        score += jaccard * 0.15

    return round(score, 3)

def recommend_similar_dishes(dish_id, top_n=3):
    """Finds top N similar dishes for 'You May Also Like' recommendations."""
    target_dish = next((item for item in FOOD_CATALOG if item["id"] == dish_id), None)
    if not target_dish:
        return []

    scored_items = []
    for item in FOOD_CATALOG:
        if item["id"] == dish_id:
            continue
        sim = calculate_dish_similarity(target_dish, item)
        scored_items.append({
            **item,
            "ai_match_score": sim,
            "recommendation_reason": f"Matches your palate profile ({int(sim*100)}% match)"
        })

    scored_items.sort(key=lambda x: x["ai_match_score"], reverse=True)
    return scored_items[:top_n]

def recommend_by_user_preferences(preferences):
    """
    Ranks items based on customer dietary preferences, spice tolerance, and order history.
    preferences example: {
        "dietary": ["vegetarian", "gluten_free"],
        "max_spice": 2,
        "max_budget": 350.0,
        "preferred_category": "Bowls & Curries"
    }
    """
    dietary = preferences.get("dietary", [])
    max_spice = preferences.get("max_spice", 3)
    max_budget = preferences.get("max_budget", 1000.0)
    preferred_category = preferences.get("preferred_category")

    scored = []
    for item in FOOD_CATALOG:
        # Hard constraints
        if item["price"] > max_budget:
            continue
        if "vegetarian" in dietary and not item["is_vegetarian"]:
            continue
        if "vegan" in dietary and not item["is_vegan"]:
            continue
        if "gluten_free" in dietary and not item["is_gluten_free"]:
            continue
        if item["spice_level"] > max_spice:
            continue

        # Ranking score
        score = item["rating"] / 5.0 # Base score from rating
        if preferred_category and item["category"] == preferred_category:
            score += 0.35

        scored.append({
            **item,
            "ai_affinity_score": round(score, 3),
            "recommendation_reason": "AI Personalized Match for your dietary & spice preferences"
        })

    scored.sort(key=lambda x: x["ai_affinity_score"], reverse=True)
    return scored

def get_budget_meal_combos(budget=400.0):
    """
    AI Budget Meal Planner: Finds optimal Main + Drink/Dessert combinations under a given budget.
    """
    mains = [item for item in FOOD_CATALOG if item["category"] != "Desserts & Shakes"]
    desserts = [item for item in FOOD_CATALOG if item["category"] == "Desserts & Shakes"]

    combos = []
    for m in mains:
        for d in desserts:
            combo_price = round(m["price"] + d["price"], 2)
            if combo_price <= budget:
                savings = round((combo_price * 0.15), 2)
                discounted_price = round(combo_price - savings, 2)
                combos.append({
                    "main": m["name"],
                    "dessert": d["name"],
                    "total_price": discounted_price,
                    "original_total": combo_price,
                    "savings": savings,
                    "total_calories": m["calories"] + d["calories"],
                    "tags": list(set(m.get("tags", []) + d.get("tags", [])))
                })

    combos.sort(key=lambda x: (x["savings"], -x["total_price"]), reverse=True)
    return combos[:3]

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--json":
        res = {
            "similar_to_burger": recommend_similar_dishes("food-1"),
            "personalized_veg": recommend_by_user_preferences({"dietary": ["vegetarian"], "max_spice": 2}),
            "budget_combos": get_budget_meal_combos(350.0)
        }
        print(json.dumps(res, indent=2))
    else:
        print("Recommender engine operational. Total catalog items:", len(FOOD_CATALOG))
        print("Top similar to food-1:", [x['name'] for x in recommend_similar_dishes("food-1")])

