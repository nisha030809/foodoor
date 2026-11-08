-- FOODOOR: AI-Powered Cloud Kitchen & Food Delivery Platform
-- PostgreSQL / Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'kitchen_staff', 'courier')),
    dietary_preferences TEXT[] DEFAULT '{}',
    default_delivery_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. FOOD ITEMS (MENU) TABLE
CREATE TABLE IF NOT EXISTS food_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2),
    image_url TEXT NOT NULL,
    prep_time_minutes INT DEFAULT 15,
    calories INT,
    protein_g NUMERIC(6, 1),
    carbs_g NUMERIC(6, 1),
    fat_g NUMERIC(6, 1),
    is_vegetarian BOOLEAN DEFAULT FALSE,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    spice_level INT DEFAULT 1 CHECK (spice_level BETWEEN 0 AND 3),
    is_available BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. INVENTORY / INGREDIENTS TABLE
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingredient_name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL, -- 'produce', 'dairy', 'meat', 'spices', 'packaging'
    unit TEXT NOT NULL, -- 'kg', 'g', 'liters', 'units'
    current_stock NUMERIC(10, 2) NOT NULL DEFAULT 0,
    minimum_threshold NUMERIC(10, 2) NOT NULL DEFAULT 10,
    reorder_quantity NUMERIC(10, 2) NOT NULL DEFAULT 50,
    unit_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    shelf_life_days INT DEFAULT 7,
    last_restocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT GENERATED ALWAYS AS (
        CASE 
            WHEN current_stock <= (minimum_threshold * 0.5) THEN 'critical'
            WHEN current_stock <= minimum_threshold THEN 'low'
            ELSE 'optimal'
        END
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RECIPE INGREDIENTS (BOM - Bill of Materials)
CREATE TABLE IF NOT EXISTS food_item_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
    quantity_required NUMERIC(10, 3) NOT NULL, -- per serving
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(food_item_id, inventory_item_id)
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    customer_email TEXT,
    delivery_address JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'received' 
        CHECK (status IN ('received', 'confirmed', 'kitchen_prep', 'quality_check', 'ready_dispatch', 'delivered', 'cancelled')),
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 35.00,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'upi' CHECK (payment_method IN ('card', 'cash', 'upi', 'wallet')),
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    special_instructions TEXT,
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    actual_delivery_time TIMESTAMP WITH TIME ZONE,
    ai_predicted_prep_duration INT, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES food_items(id) ON DELETE SET NULL,
    food_name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    customizations JSONB DEFAULT '{}',
    total_price NUMERIC(10, 2) NOT NULL
);

-- 8. ORDER STATUS LOGS / TIMESTAMPS
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    note TEXT,
    updated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. CUSTOMER REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. AI DEMAND FORECAST LOGS
CREATE TABLE IF NOT EXISTS ai_demand_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    forecast_date DATE NOT NULL,
    hour_of_day INT CHECK (hour_of_day BETWEEN 0 AND 23),
    food_item_id UUID REFERENCES food_items(id) ON DELETE CASCADE,
    predicted_orders INT NOT NULL,
    confidence_score NUMERIC(4, 3) NOT NULL,
    factors JSONB, -- { "weather": "rainy", "holiday": false, "historical_avg": 42 }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- Public can read menu and categories
CREATE POLICY "Public food items are viewable by everyone" ON food_items FOR SELECT USING (true);
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Public reviews are viewable by everyone" ON reviews FOR SELECT USING (true);

-- Customer profile policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Customer orders policies
CREATE POLICY "Customers can view their own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Customers can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id OR customer_id IS NULL);

-- Admin staff full access policies (check role = 'admin')
CREATE POLICY "Admins have full access to food_items" ON food_items FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Admins have full access to inventory" ON inventory_items FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);
CREATE POLICY "Admins have full access to orders" ON orders FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'kitchen_staff'))
);

