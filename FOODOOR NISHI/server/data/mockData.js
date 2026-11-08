// FOODOOR Initial Seed Data
// Realistic cloud kitchen items, categories, inventory, orders, and reviews

export const initialCategories = [
  {
    id: "cat-1",
    name: "Artisan Burgers",
    slug: "artisan-burgers",
    icon: "🍔",
    description: "Smashed Angus patties, artisanal brioche, and house-made truffle glazes",
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-2",
    name: "Woodfired Pizza",
    slug: "woodfired-pizza",
    icon: "🍕",
    description: "72-hour fermented sourdough, San Marzano tomatoes, and creamy burrata",
    image_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-3",
    name: "Bowls & Curries",
    slug: "bowls-curries",
    icon: "🍛",
    description: "Slow-simmered aromatic gravies with saffron basmati and char-grilled skewers",
    image_url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-4",
    name: "Healthy Salads",
    slug: "healthy-salads",
    icon: "🥗",
    description: "Farm-fresh organic greens, superfood grains, and cold-pressed citrus vinaigrettes",
    image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-5",
    name: "Asian Wok",
    slug: "asian-wok",
    icon: "🍜",
    description: "Hand-pulled ramen, spicy gochujang wings, and wok-tossed pad thai",
    image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-6",
    name: "Desserts & Shakes",
    slug: "desserts-shakes",
    icon: "🍰",
    description: "Belgian molten lava cakes, artisan gelato, and handcrafted cold brews",
    image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"
  }
];

export const initialFoodItems = [
  {
    id: "food-1",
    categoryId: "cat-1",
    name: "Truffle Glazed Smash Burger",
    slug: "truffle-glazed-smash-burger",
    description: "Double smash Angus beef, black truffle aioli, aged English cheddar, crispy shallots, and toasted brioche bun.",
    price: 249,
    original_price: 299,
    prep_time_minutes: 14,
    calories: 780,
    protein_g: 44,
    carbs_g: 52,
    fat_g: 38,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    spice_level: 1,
    is_available: true,
    is_featured: true,
    rating: 4.9,
    reviews_count: 142,
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Angus Ground Beef", "Brioche Bun", "Truffle Aioli", "Aged Cheddar", "Shallots", "Butter"],
    allergens: ["Gluten", "Dairy", "Eggs"]
  },
  {
    id: "food-2",
    categoryId: "cat-2",
    name: "Artisanal Burrata Margherita Pizza",
    slug: "artisanal-burrata-margherita-pizza",
    description: "Neapolitan crust, DOP San Marzano tomato reduction, whole creamy Pugliese burrata, fresh basil, and cold-pressed olive oil.",
    price: 299,
    original_price: 349,
    prep_time_minutes: 16,
    calories: 820,
    protein_g: 32,
    carbs_g: 88,
    fat_g: 36,
    is_vegetarian: true,
    is_vegan: false,
    is_gluten_free: false,
    spice_level: 0,
    is_available: true,
    is_featured: true,
    rating: 4.95,
    reviews_count: 218,
    image_url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    ingredients: ["00 Sourdough Flour", "San Marzano Tomatoes", "Burrata Cheese", "Fresh Basil", "Extra Virgin Olive Oil"],
    allergens: ["Gluten", "Dairy"]
  },
  {
    id: "food-3",
    categoryId: "cat-3",
    name: "Smoked Butter Chicken Rice Bowl",
    slug: "smoked-butter-chicken-rice-bowl",
    description: "Tandoor-charred chicken thigh steeped in a velvety tomato makhani sauce, topped with fenugreek and served over aged saffron basmati rice.",
    price: 249,
    original_price: 289,
    prep_time_minutes: 15,
    calories: 690,
    protein_g: 48,
    carbs_g: 65,
    fat_g: 28,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: true,
    spice_level: 2,
    is_available: true,
    is_featured: true,
    rating: 4.88,
    reviews_count: 310,
    image_url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Free-Range Chicken", "Makhani Gravy", "Basmati Rice", "Churned Butter", "Ginger", "Kasuri Methi"],
    allergens: ["Dairy"]
  },
  {
    id: "food-4",
    categoryId: "cat-4",
    name: "Avocado Superfood Grain Bowl",
    slug: "avocado-superfood-grain-bowl",
    description: "Sliced Hass avocado, organic tricolor quinoa, massaged Tuscan kale, roasted chickpeas, pickled radish, and lemon tahini dressing.",
    price: 199,
    original_price: 249,
    prep_time_minutes: 10,
    calories: 480,
    protein_g: 18,
    carbs_g: 58,
    fat_g: 22,
    is_vegetarian: true,
    is_vegan: true,
    is_gluten_free: true,
    spice_level: 0,
    is_available: true,
    is_featured: false,
    rating: 4.82,
    reviews_count: 94,
    image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Hass Avocado", "Tricolor Quinoa", "Tuscan Kale", "Chickpeas", "Lemon Tahini Dressing", "Pumpkin Seeds"],
    allergens: ["Sesame"]
  },
  {
    id: "food-5",
    categoryId: "cat-5",
    name: "Crispy Korean Gochujang Wings",
    slug: "crispy-korean-gochujang-wings",
    description: "Double-fried crispy chicken wings glazed in sticky sweet-spicy gochujang chili sauce, toasted white sesame, and scallions.",
    price: 199,
    original_price: 229,
    prep_time_minutes: 18,
    calories: 620,
    protein_g: 42,
    carbs_g: 34,
    fat_g: 30,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    spice_level: 3,
    is_available: true,
    is_featured: true,
    rating: 4.91,
    reviews_count: 175,
    image_url: "https://images.unsplash.com/photo-1527477378408-1bc0932147d3?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Chicken Wings", "Gochujang Paste", "Honey", "Rice Vinegar", "Toasted Sesame", "Garlic"],
    allergens: ["Soy", "Gluten", "Sesame"]
  },
  {
    id: "food-6",
    categoryId: "cat-6",
    name: "Belgian Dark Chocolate Molten Lava",
    slug: "belgian-dark-chocolate-molten-lava",
    description: "Rich 70% Callebaut dark chocolate cake with a warm flowing fudge center, dusted with Dutch cocoa and served with vanilla bean creme.",
    price: 149,
    original_price: 179,
    prep_time_minutes: 8,
    calories: 490,
    protein_g: 8,
    carbs_g: 54,
    fat_g: 26,
    is_vegetarian: true,
    is_vegan: false,
    is_gluten_free: false,
    spice_level: 0,
    is_available: true,
    is_featured: false,
    rating: 4.96,
    reviews_count: 240,
    image_url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    ingredients: ["70% Belgian Chocolate", "Butter", "Eggs", "Cane Sugar", "Flour", "Vanilla Pod"],
    allergens: ["Gluten", "Dairy", "Eggs"]
  },
  {
    id: "food-7",
    categoryId: "cat-3",
    name: "Fire-Roasted Paneer Tikka Masala",
    slug: "fire-roasted-paneer-tikka-masala",
    description: "Cottage cheese cubes marinated in yogurt and Kashmiri chili, flame-seared and simmered in a spiced bell pepper and cashew-onion sauce.",
    price: 229,
    original_price: 269,
    prep_time_minutes: 15,
    calories: 610,
    protein_g: 34,
    carbs_g: 48,
    fat_g: 32,
    is_vegetarian: true,
    is_vegan: false,
    is_gluten_free: true,
    spice_level: 2,
    is_available: true,
    is_featured: false,
    rating: 4.85,
    reviews_count: 129,
    image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Artisan Paneer", "Bell Peppers", "Cashew Onion Gravy", "Greek Yogurt", "Basmati Rice"],
    allergens: ["Dairy", "Tree Nuts"]
  },
  {
    id: "food-8",
    categoryId: "cat-5",
    name: "Spicy Tokyo Shoyu Ramen Bowl",
    slug: "spicy-tokyo-shoyu-ramen-bowl",
    description: "Hand-pulled wavy noodles, 18-hour chicken and dashi broth, torched chashu chicken, soft-boiled ajitsuke egg, nori sheet, and black garlic oil.",
    price: 279,
    original_price: 319,
    prep_time_minutes: 16,
    calories: 710,
    protein_g: 40,
    carbs_g: 78,
    fat_g: 26,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    spice_level: 2,
    is_available: true,
    is_featured: true,
    rating: 4.89,
    reviews_count: 188,
    image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Wheat Ramen Noodles", "Slow-Cooked Shoyu Broth", "Chashu Chicken", "Ajitsuke Egg", "Nori", "Menma"],
    allergens: ["Gluten", "Soy", "Eggs"]
  },
  {
    id: "food-9",
    categoryId: "cat-1",
    name: "Crispy Peri Peri Fries",
    slug: "crispy-peri-peri-fries",
    description: "Crispy golden potato skin-on fries tossed in hot peri-peri spice dust, served with creamy chipotle dip.",
    price: 99,
    original_price: 129,
    prep_time_minutes: 8,
    calories: 360,
    protein_g: 5,
    carbs_g: 46,
    fat_g: 16,
    is_vegetarian: true,
    is_vegan: true,
    is_gluten_free: true,
    spice_level: 2,
    is_available: true,
    is_featured: false,
    rating: 4.88,
    reviews_count: 96,
    image_url: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Russet Potatoes", "Peri Peri Seasoning", "Sea Salt", "Sunflower Oil"],
    allergens: []
  }
];

export const initialInventory = [
  {
    id: "inv-1",
    ingredient_name: "Ground Beef Patty (Premium Angus)",
    category: "Meat & Poultry",
    unit: "kg",
    current_stock: 14.5,
    minimum_threshold: 12.0,
    reorder_quantity: 40.0,
    unit_cost: 320.00,
    shelf_life_days: 4,
    status: "optimal"
  },
  {
    id: "inv-2",
    ingredient_name: "Brioche Burger Buns",
    category: "Bakery",
    unit: "units",
    current_stock: 18.0,
    minimum_threshold: 30.0,
    reorder_quantity: 100.0,
    unit_cost: 15.00,
    shelf_life_days: 3,
    status: "critical"
  },
  {
    id: "inv-3",
    ingredient_name: "Fresh Burrata Cheese",
    category: "Dairy",
    unit: "kg",
    current_stock: 6.8,
    minimum_threshold: 8.0,
    reorder_quantity: 20.0,
    unit_cost: 450.00,
    shelf_life_days: 5,
    status: "low"
  },
  {
    id: "inv-4",
    ingredient_name: "San Marzano Tomato Sauce",
    category: "Pantry",
    unit: "liters",
    current_stock: 24.0,
    minimum_threshold: 10.0,
    reorder_quantity: 50.0,
    unit_cost: 95.00,
    shelf_life_days: 30,
    status: "optimal"
  },
  {
    id: "inv-5",
    ingredient_name: "Marinated Boneless Chicken",
    category: "Meat & Poultry",
    unit: "kg",
    current_stock: 22.0,
    minimum_threshold: 15.0,
    reorder_quantity: 60.0,
    unit_cost: 280.00,
    shelf_life_days: 4,
    status: "optimal"
  },
  {
    id: "inv-6",
    ingredient_name: "Aromatic Basmati Rice",
    category: "Grains",
    unit: "kg",
    current_stock: 45.0,
    minimum_threshold: 20.0,
    reorder_quantity: 100.0,
    unit_cost: 85.00,
    shelf_life_days: 180,
    status: "optimal"
  },
  {
    id: "inv-7",
    ingredient_name: "Ripe Hass Avocados",
    category: "Produce",
    unit: "units",
    current_stock: 15.0,
    minimum_threshold: 25.0,
    reorder_quantity: 60.0,
    unit_cost: 65.00,
    shelf_life_days: 3,
    status: "low"
  },
  {
    id: "inv-8",
    ingredient_name: "Belgian Dark Chocolate (70%)",
    category: "Bakery",
    unit: "kg",
    current_stock: 8.5,
    minimum_threshold: 5.0,
    reorder_quantity: 15.0,
    unit_cost: 550.00,
    shelf_life_days: 90,
    status: "optimal"
  }
];

export const initialOrders = [
  {
    id: "ord-1001",
    order_number: "FD-8921",
    customer_name: "Sarah Sharma",
    customer_phone: "+91 98201 45892",
    customer_email: "sarah.s@example.in",
    delivery_address: {
      street: "Flat 402, Lotus Grandeur, Central Avenue, Powai",
      city: "Mumbai",
      zip: "400076",
      instructions: "Ring doorbell or leave at front door security"
    },
    status: "kitchen_prep",
    created_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    status_timestamps: {
      received: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
      confirmed: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      kitchen_prep: new Date(Date.now() - 6 * 60 * 1000).toISOString()
    },
    items: [
      {
        food_id: "food-1",
        food_name: "Truffle Glazed Smash Burger",
        price: 249,
        quantity: 2,
        customizations: { cheese: "Extra English Cheddar", onion: "Well done" },
        total_price: 498
      },
      {
        food_id: "food-6",
        food_name: "Belgian Dark Chocolate Molten Lava",
        price: 149,
        quantity: 1,
        customizations: {},
        total_price: 149
      }
    ],
    subtotal: 647,
    delivery_fee: 0,
    tax: 32,
    discount: 50,
    total: 629,
    payment_method: "upi",
    payment_status: "paid",
    estimated_delivery_minutes: 24,
    ai_predicted_prep_duration: 16
  },
  {
    id: "ord-1002",
    order_number: "FD-8922",
    customer_name: "Marcus Verma",
    customer_phone: "+91 98712 30914",
    customer_email: "marcus.v@example.in",
    delivery_address: {
      street: "Plot 12, Indiranagar 100ft Road",
      city: "Bengaluru",
      zip: "560038",
      instructions: "Call on arrival"
    },
    status: "ready_dispatch",
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status_timestamps: {
      received: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      confirmed: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
      kitchen_prep: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
      quality_check: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
      ready_dispatch: new Date(Date.now() - 2 * 60 * 1000).toISOString()
    },
    items: [
      {
        food_id: "food-2",
        food_name: "Artisanal Burrata Margherita Pizza",
        price: 299,
        quantity: 1,
        customizations: { crust: "Crispy well baked" },
        total_price: 299
      },
      {
        food_id: "food-5",
        food_name: "Crispy Korean Gochujang Wings",
        price: 199,
        quantity: 1,
        customizations: {},
        total_price: 199
      }
    ],
    subtotal: 498,
    delivery_fee: 0,
    tax: 25,
    discount: 0,
    total: 523,
    payment_method: "upi",
    payment_status: "paid",
    estimated_delivery_minutes: 12,
    ai_predicted_prep_duration: 18
  },
  {
    id: "ord-1003",
    order_number: "FD-8920",
    customer_name: "Ananya Iyer",
    customer_phone: "+91 98450 11982",
    customer_email: "ananya.i@example.in",
    delivery_address: {
      street: "A-502, Prestige Palms, Whitefield",
      city: "Bengaluru",
      zip: "560066",
      instructions: "Drop off outside door"
    },
    status: "delivered",
    created_at: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    status_timestamps: {
      received: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      confirmed: new Date(Date.now() - 53 * 60 * 1000).toISOString(),
      kitchen_prep: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
      quality_check: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
      ready_dispatch: new Date(Date.now() - 26 * 60 * 1000).toISOString(),
      delivered: new Date(Date.now() - 8 * 60 * 1000).toISOString()
    },
    items: [
      {
        food_id: "food-3",
        food_name: "Smoked Butter Chicken Rice Bowl",
        price: 249,
        quantity: 2,
        customizations: {},
        total_price: 498
      }
    ],
    subtotal: 498,
    delivery_fee: 0,
    tax: 25,
    discount: 100,
    total: 423,
    payment_method: "card",
    payment_status: "paid",
    estimated_delivery_minutes: 0,
    ai_predicted_prep_duration: 15
  }
];

export const initialReviews = [
  {
    id: "rev-1",
    food_id: "food-1",
    customer_name: "David K.",
    rating: 5,
    comment: "The truffle glaze on the smash burger is restaurant grade. Arrived steaming hot and brioche was super fluffy!",
    created_at: "2026-11-04T18:42:00Z"
  },
  {
    id: "rev-2",
    food_id: "food-2",
    customer_name: "Amara Patel",
    rating: 5,
    comment: "Real burrata on delivery pizza is rare. Crust had perfect leopard spots from the woodfire oven.",
    created_at: "2026-11-05T12:15:00Z"
  },
  {
    id: "rev-3",
    food_id: "food-3",
    customer_name: "Liam O'Connor",
    rating: 5,
    comment: "Butter chicken bowl was smoky, aromatic, and portion size was generous. AI recommendation was spot on!",
    created_at: "2026-11-05T20:05:00Z"
  }
];

