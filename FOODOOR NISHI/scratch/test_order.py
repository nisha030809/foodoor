import urllib.request
import json

base = "http://localhost:5000"
order_payload = {
    "customer_name": "Rohan Gupta",
    "customer_phone": "+91 99887 76655",
    "customer_email": "rohan.gupta@example.in",
    "delivery_address": {
        "street": "14B Silver Sands, Bandra West",
        "city": "Mumbai",
        "zip": "400050",
        "instructions": "Call at gate"
    },
    "payment_method": "upi",
    "items": [
        {
            "food_id": "food-9",
            "food_name": "Crispy Peri Peri Fries",
            "price": 99,
            "quantity": 1,
            "customizations": {},
            "total_price": 99
        },
        {
            "food_id": "food-1",
            "food_name": "Truffle Glazed Smash Burger",
            "price": 249,
            "quantity": 1,
            "customizations": {},
            "total_price": 249
        }
    ],
    "delivery_fee": 35,
    "discount": 0,
    "tip": 30
}

data = json.dumps(order_payload).encode('utf-8')
req = urllib.request.Request(f"{base}/api/orders", data=data, headers={"Content-Type": "application/json"}, method="POST")

with urllib.request.urlopen(req) as res:
    resp = json.loads(res.read().decode('utf-8'))
    print("ORDER PLACEMENT STATUS:", resp["status"])
    print("NEW ORDER NUMBER:", resp["order"]["order_number"])
    print("NEW ORDER TOTAL: Rs", resp["order"]["total"])
