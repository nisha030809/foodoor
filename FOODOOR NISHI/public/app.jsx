// FOODOOR Premium Frontend Application
// AI-Powered Cloud Kitchen Management & Food Delivery Platform
// Built with React 18, Tailwind CSS, and Real-Time State Architecture

const { useState, useEffect, useMemo, useRef } = React;

// API Base URL (Configurable for decoupled deployments, defaults to same-origin /api)
const API_BASE = (typeof window !== 'undefined' && window.__FOODOOR_API_URL__) ? window.__FOODOOR_API_URL__ : '/api';

// Currency Formatter (Indian Rupee ₹ with standard Indian number formatting en-IN)
const inrCurrencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR'
});

const formatCurrency = (val, options) => {
  const num = Number(val) || 0;
  if (options) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      ...options
    }).format(num);
  }
  return inrCurrencyFormatter.format(num);
};

// Icon Component Helper (Clean SVG Icons)
const Icon = ({ name, className = "w-5 h-5", ...props }) => {
  const icons = {
    flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>,
    sparkles: <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>,
    cart: <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z M3 6h18 M16 10a4 4 0 0 1-8 0"/>,
    search: <path d="m21 21-4.3-4.3 M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>,
    clock: <path d="M12 6v6l4 2 M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    utensils: <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2 M15 11v11 M5 2v10a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V2 M7 14v8"/>,
    trending: <path d="m22 7-8.5 8.5-5-5L2 17 M16 7h6v6"/>,
    check: <path d="M20 6 9 17l-5-5"/>,
    cross: <path d="M18 6 6 18 M6 6l12 12"/>,
    chef: <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z M6 17h12"/>,
    box: <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z M3.27 6.96 12 12.01l8.73-5.05 M12 22.08V12"/>,
    alert: <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z M12 9v4 M12 17h.01"/>,
    truck: <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2 M15 18H9 M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14 M17 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0 M5 18a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/>,
    sliders: <path d="M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6"/>,
    refresh: <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8 M3 3v5h5 M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16 M16 16h5v5"/>,
    user: <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>,
    plus: <path d="M12 5v14 M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
    leaf: <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>,
    cloudRain: <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242 M16 14v6 M8 14v6 M12 16v6"/>,
    sun: <path d="M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41 M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/>
  };

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className} 
      {...props}
    >
      {icons[name] || icons.flame}
    </svg>
  );
};

// ==========================================
// MAIN ROOT APP COMPONENT
// ==========================================
function FoodoorApp() {
  // Navigation & View Mode: 'customer', 'admin', 'kds'
  const [viewMode, setViewMode] = useState('customer');
  const [adminTab, setAdminTab] = useState('dashboard'); // 'dashboard', 'kds', 'forecast', 'menu', 'inventory', 'reviews'

  // Data State
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [aiForecast, setAiForecast] = useState(null);
  const [aiRecs, setAiRecs] = useState(null);
  const [loading, setLoading] = useState(true);

  // Customer Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all', 'vegetarian', 'vegan', 'gluten_free'
  const [maxSpice, setMaxSpice] = useState(3);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortBy, setSortBy] = useState('recommended');

  // Customer Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedTip, setSelectedTip] = useState(30);

  // Modals State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(null); // food item for review
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('foodoor_user');
      return saved ? JSON.parse(saved) : {
        id: 'usr-1',
        email: 'sarah.sharma@example.in',
        full_name: 'Sarah Sharma',
        phone: '+91 98201 45892',
        role: 'customer'
      };
    } catch (e) {
      return { id: 'usr-1', email: 'sarah.sharma@example.in', full_name: 'Sarah Sharma', role: 'customer' };
    }
  });
  const [isAddDishOpen, setIsAddDishOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(null);

  // Weather simulation for AI Forecast
  const [forecastWeather, setForecastWeather] = useState('Clear');

  // Notification Toast
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial Data Fetch
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [catRes, foodRes, invRes, ordRes, revRes, anRes, recRes] = await Promise.all([
        fetch(`${API_BASE}/categories`).then(r => r.json()),
        fetch(`${API_BASE}/food`).then(r => r.json()),
        fetch(`${API_BASE}/inventory`).then(r => r.json()),
        fetch(`${API_BASE}/orders`).then(r => r.json()),
        fetch(`${API_BASE}/reviews`).then(r => r.json()),
        fetch(`${API_BASE}/analytics`).then(r => r.json()),
        fetch(`${API_BASE}/ai/recommendations`).then(r => r.json())
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (foodRes.data) setFoodItems(foodRes.data);
      if (invRes.data) setInventory(invRes.data);
      if (ordRes.data) setOrders(ordRes.data);
      if (revRes.data) setReviews(revRes.data);
      if (anRes) setAnalytics(anRes);
      if (recRes) setAiRecs(recRes);

      // Load AI Forecast
      loadAiForecast('Clear');
    } catch (err) {
      console.error('Failed to load FOODOOR data:', err);
      showToast('Offline Mode: Loaded initial state', 'info');
    } finally {
      setLoading(false);
    }
  };

  const loadAiForecast = async (weather = 'Clear') => {
    try {
      const res = await fetch(`${API_BASE}/ai/forecast?weather=${weather}`).then(r => r.json());
      setAiForecast(res);
    } catch (err) {
      console.error('Error fetching forecast:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Poll orders & inventory updates every 12 seconds for live sync
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [ordRes, invRes] = await Promise.all([
          fetch(`${API_BASE}/orders`).then(r => r.json()),
          fetch(`${API_BASE}/inventory`).then(r => r.json())
        ]);
        if (ordRes.data) setOrders(ordRes.data);
        if (invRes.data) setInventory(invRes.data);

        // Update active tracking order if currently tracking
        if (activeTrackingOrder) {
          const fresh = ordRes.data.find(o => o.id === activeTrackingOrder.id);
          if (fresh) setActiveTrackingOrder(fresh);
        }
      } catch (e) {
        // quiet poll
      }
    }, 12000);
    return () => clearInterval(interval);
  }, [activeTrackingOrder]);

  // Cart Management
  const addToCart = (item, qty = 1, customizations = {}) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + qty } : p);
      }
      return [...prev, { ...item, quantity: qty, customizations }];
    });
    showToast(`Added ${item.name} to order bag`);
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const deliveryFee = cartSubtotal >= 399 ? 0 : (cartSubtotal > 0 ? 35 : 0);
  const tax = Math.round(cartSubtotal * 0.05); // 5% GST
  const cartTotal = Math.max(0, cartSubtotal + deliveryFee + tax + selectedTip - discountAmount);

  const applyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'FOODOOR20') {
      const discount = Math.min(100, Math.round(cartSubtotal * 0.20));
      setDiscountAmount(discount);
      showToast('Promo code applied: 20% discount (up to ₹100)!', 'success');
    } else if (promoCode.trim().toUpperCase() === 'TASTYAI') {
      const discount = Math.min(cartSubtotal, 50);
      setDiscountAmount(discount);
      showToast('Promo code applied: ₹50 off!', 'success');
    } else {
      showToast('Invalid promo code. Try FOODOOR20 or TASTYAI', 'error');
    }
  };

  // Place Order Action
  const handlePlaceOrder = async (orderData) => {
    try {
      const payload = {
        customer_name: orderData.fullName,
        customer_phone: orderData.phone,
        customer_email: orderData.email,
        delivery_address: {
          street: orderData.street,
          city: orderData.city,
          zip: orderData.zip,
          instructions: orderData.instructions
        },
        payment_method: orderData.paymentMethod,
        items: cart.map(i => ({
          food_id: i.id,
          food_name: i.name,
          price: i.price,
          quantity: i.quantity,
          customizations: i.customizations,
          total_price: i.price * i.quantity
        })),
        delivery_fee: deliveryFee,
        discount: discountAmount,
        tip: selectedTip
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.status === 'success') {
        // Trigger celebratory confetti
        if (window.confetti) {
          window.confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        }
        setOrders(prev => [res.order, ...prev]);
        setCart([]);
        setIsCartOpen(false);
        setIsCheckoutOpen(false);
        setActiveTrackingOrder(res.order);
        showToast('Order confirmed! Sending live tracking updates...');

        // Refresh inventory to reflect automatic ingredient depletion
        fetch(`${API_BASE}/inventory`).then(r => r.json()).then(inv => {
          if (inv.data) setInventory(inv.data);
        });
      }
    } catch (err) {
      console.error('Order creation error:', err);
      showToast('Failed to place order. Try again.', 'error');
    }
  };

  // Advance Order Pipeline (KDS / Admin)
  const handleAdvanceOrderStatus = async (orderId) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/advance`, {
        method: 'PATCH'
      }).then(r => r.json());

      if (res.status === 'success') {
        setOrders(prev => prev.map(o => o.id === orderId ? res.order : o));
        if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
          setActiveTrackingOrder(res.order);
        }
        showToast(`Order status updated to: ${res.order.status.replace('_', ' ').toUpperCase()}`);
      }
    } catch (e) {
      showToast('Error updating order stage', 'error');
    }
  };

  // Toggle Food Availability (Menu Management)
  const handleToggleAvailability = async (foodId) => {
    try {
      const res = await fetch(`${API_BASE}/food/${foodId}/availability`, { method: 'PATCH' }).then(r => r.json());
      if (res.status === 'success') {
        setFoodItems(prev => prev.map(f => f.id === foodId ? res.data : f));
        showToast(`Availability updated for ${res.data.name}`);
      }
    } catch (e) {
      showToast('Error toggling item availability', 'error');
    }
  };

  // Restock Inventory
  const handleRestock = async (invId, qty) => {
    try {
      const res = await fetch(`${API_BASE}/inventory/${invId}/restock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: qty })
      }).then(r => r.json());

      if (res.status === 'success') {
        setInventory(prev => prev.map(i => i.id === invId ? res.item : i));
        setIsRestockModalOpen(null);
        showToast(`Stock replenished: +${qty} ${res.item.unit}`);
      }
    } catch (e) {
      showToast('Error restocking inventory', 'error');
    }
  };

  // Filtered Food Items for Customer Menu
  const filteredFood = useMemo(() => {
    return foodItems.filter(item => {
      if (selectedCategory && item.categoryId !== selectedCategory) return false;
      if (dietaryFilter === 'vegetarian' && !item.is_vegetarian) return false;
      if (dietaryFilter === 'vegan' && !item.is_vegan) return false;
      if (dietaryFilter === 'gluten_free' && !item.is_gluten_free) return false;
      if (item.spice_level > maxSpice) return false;
      if (item.price > maxPrice) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesIng = item.ingredients && item.ingredients.some(i => i.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIng) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'prep_time') return a.prep_time_minutes - b.prep_time_minutes;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.rating - a.rating; // default recommended
    });
  }, [foodItems, selectedCategory, dietaryFilter, maxSpice, maxPrice, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-zinc-900 border border-brand-500/40 text-white shadow-2xl shadow-brand-500/10 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping"></div>
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* GLOBAL APPLICATION NAVBAR */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Platform Badge */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('customer')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
              <Icon name="flame" className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                  FOODOOR
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/15 text-brand-400 border border-brand-500/30 flex items-center gap-1">
                  <Icon name="sparkles" className="w-2.5 h-2.5" /> AI Cloud Kitchen
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium tracking-wide">Next-Gen Food-Tech Platform</p>
            </div>
          </div>

          {/* Center: View Switcher (Customer vs Admin vs KDS) */}
          <div className="hidden md:flex items-center p-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <button
              onClick={() => setViewMode('customer')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'customer'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon name="utensils" className="w-4 h-4" />
              Customer Store
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'admin'
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon name="sliders" className="w-4 h-4" />
              Admin Portal
            </button>
            <button
              onClick={() => { setViewMode('admin'); setAdminTab('kds'); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'admin' && adminTab === 'kds'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live KDS ({orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length})
            </button>
          </div>

          {/* Right: Order Tracking, Order History & Cart */}
          <div className="flex items-center gap-3">
            {activeTrackingOrder && (
              <button
                onClick={() => setActiveTrackingOrder(activeTrackingOrder)}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all animate-pulse"
              >
                <Icon name="truck" className="w-4 h-4" />
                Track #{activeTrackingOrder.order_number}
              </button>
            )}

            <button
              onClick={() => setIsOrderHistoryOpen(true)}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
              title="Order History"
            >
              <Icon name="clock" className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all"
              title="Customer Profile & Dietary Preferences"
            >
              <Icon name="sliders" className="w-5 h-5" />
            </button>

            {/* Auth / Account Trigger */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-700 text-xs font-bold transition-all"
              title="Account Login & Registration"
            >
              <Icon name="user" className="w-4 h-4 text-brand-400" />
              <span className="hidden sm:inline">{currentUser ? currentUser.full_name.split(' ')[0] : 'Sign In'}</span>
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all transform active:scale-95"
            >
              <Icon name="cart" className="w-5 h-5" />
              <span>{formatCurrency(cartTotal)}</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white text-zinc-950 text-xs font-black flex items-center justify-center shadow-md animate-scale">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* ============================================================ */}
      {/* BODY CONTENT: CUSTOMER VIEW OR ADMIN CONTROL PANEL */}
      {/* ============================================================ */}
      <main className="flex-1 pb-24">
        {viewMode === 'customer' ? (
          <CustomerPlatform
            categories={categories}
            foodItems={filteredFood}
            allFoodItems={foodItems}
            aiRecs={aiRecs}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dietaryFilter={dietaryFilter}
            setDietaryFilter={setDietaryFilter}
            maxSpice={maxSpice}
            setMaxSpice={setMaxSpice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onSelectProduct={setSelectedProduct}
            onAddToCart={addToCart}
          />
        ) : (
          <AdminControlPanel
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            analytics={analytics}
            orders={orders}
            foodItems={foodItems}
            inventory={inventory}
            reviews={reviews}
            aiForecast={aiForecast}
            forecastWeather={forecastWeather}
            setForecastWeather={setForecastWeather}
            onAdvanceOrder={handleAdvanceOrderStatus}
            onToggleAvailability={handleToggleAvailability}
            onOpenAddDish={() => setIsAddDishOpen(true)}
            onOpenRestock={(item) => setIsRestockModalOpen(item)}
            onRefreshForecast={loadAiForecast}
          />
        )}
      </main>

      {/* ============================================================ */}
      {/* CART DRAWER SLIDE-OVER */}
      {/* ============================================================ */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm transition-opacity flex justify-end">
          <div className="w-full max-w-md bg-zinc-900 border-l border-zinc-800 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="cart" className="w-5 h-5 text-brand-500" />
                <h3 className="text-lg font-bold">Your Order Bag</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-semibold">
                  {cartItemCount} items
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <Icon name="cross" className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
                  <div className="w-16 h-16 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400 mb-4">
                    <Icon name="cart" className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-zinc-300">Your bag is empty</h4>
                  <p className="text-sm mt-1 max-w-xs">Explore chef specials and add freshly prepared dishes to start your order.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 flex items-center gap-3">
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-zinc-100 truncate">{item.name}</h4>
                      <div className="text-xs text-brand-400 font-semibold mt-0.5">
                        {formatCurrency(item.price)} each
                      </div>
                      {item.customizations && Object.keys(item.customizations).length > 0 && (
                        <div className="text-[11px] text-zinc-400 mt-1">
                          {Object.entries(item.customizations).map(([k, v]) => `${v}`).join(', ')}
                        </div>
                      )}
                    </div>
                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-xl px-2 py-1">
                      <button 
                        onClick={() => updateCartQty(item.id, -1)}
                        className="text-zinc-400 hover:text-brand-500 font-bold px-1"
                      >
                        <Icon name="minus" className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQty(item.id, 1)}
                        className="text-zinc-400 hover:text-brand-500 font-bold px-1"
                      >
                        <Icon name="plus" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer & Bill */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-zinc-800 bg-zinc-950/60 space-y-4">
                {/* Promo Code Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (FOODOOR20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl transition"
                  >
                    Apply
                  </button>
                </div>

                {/* Driver Tip Selection */}
                <div>
                  <div className="text-xs font-semibold text-zinc-400 mb-2 flex items-center justify-between">
                    <span>Courier Delivery Tip</span>
                    <span className="text-emerald-400 font-bold">100% goes to driver</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 20, 30, 50].map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedTip(t)}
                        className={`py-1.5 text-xs font-bold rounded-xl border transition ${
                          selectedTip === t
                            ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {t === 0 ? 'No tip' : formatCurrency(t)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-zinc-200 font-medium">{formatCurrency(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-zinc-200 font-medium">
                      {deliveryFee === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated GST (5%)</span>
                    <span className="text-zinc-200 font-medium">{formatCurrency(tax)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Promo Discount</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  {selectedTip > 0 && (
                    <div className="flex justify-between">
                      <span>Driver Tip</span>
                      <span className="text-zinc-200 font-medium">{formatCurrency(selectedTip)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                    <span>Total Bill</span>
                    <span className="text-brand-400">{formatCurrency(cartTotal)}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-xl shadow-brand-500/20 transition transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <Icon name="check" className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CHECKOUT MODAL */}
      {/* ============================================================ */}
      {isCheckoutOpen && (
        <CheckoutModal
          cartTotal={cartTotal}
          onClose={() => setIsCheckoutOpen(false)}
          onConfirmOrder={handlePlaceOrder}
        />
      )}

      {/* ============================================================ */}
      {/* PRODUCT DETAIL MODAL */}
      {/* ============================================================ */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(item, qty, cust) => {
            addToCart(item, qty, cust);
            setSelectedProduct(null);
          }}
          onSelectSimilar={(p) => setSelectedProduct(p)}
        />
      )}

      {/* ============================================================ */}
      {/* LIVE ORDER STATUS TRACKING MODAL */}
      {/* ============================================================ */}
      {activeTrackingOrder && (
        <LiveOrderTrackingModal
          order={activeTrackingOrder}
          onClose={() => setActiveTrackingOrder(null)}
        />
      )}

      {/* ============================================================ */}
      {/* ORDER HISTORY MODAL */}
      {/* ============================================================ */}
      {isOrderHistoryOpen && (
        <OrderHistoryModal
          orders={orders}
          onClose={() => setIsOrderHistoryOpen(false)}
          onTrack={(o) => { setIsOrderHistoryOpen(false); setActiveTrackingOrder(o); }}
          onReorder={(o) => {
            o.items.forEach(i => addToCart({ id: i.food_id, name: i.food_name, price: i.price, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' }, i.quantity));
            setIsOrderHistoryOpen(false);
            setIsCartOpen(true);
          }}
          onRate={(item) => setIsReviewModalOpen(item)}
        />
      )}

      {/* ============================================================ */}
      {/* REVIEW & RATING SUBMISSION MODAL */}
      {/* ============================================================ */}
      {isReviewModalOpen && (
        <ReviewModal
          foodItem={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(null)}
          onSubmitSuccess={(rev) => {
            setReviews(prev => [rev, ...prev]);
            setIsReviewModalOpen(null);
            showToast('Review submitted! Thank you for rating.');
          }}
        />
      )}

      {/* ============================================================ */}
      {/* USER AUTHENTICATION & LOGIN MODAL */}
      {/* ============================================================ */}
      {isAuthModalOpen && (
        <AuthModal
          currentUser={currentUser}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            try {
              localStorage.setItem('foodoor_user', JSON.stringify(user));
            } catch (e) {}
            setIsAuthModalOpen(false);
            showToast(`Welcome, ${user.full_name}!`);
            if (user.role === 'admin') setViewMode('admin');
          }}
          onLogout={() => {
            setCurrentUser(null);
            try {
              localStorage.removeItem('foodoor_user');
              localStorage.removeItem('foodoor_token');
            } catch (e) {}
            setIsAuthModalOpen(false);
            setViewMode('customer');
            showToast('You have been signed out');
          }}
        />
      )}

      {/* ============================================================ */}
      {/* CUSTOMER PROFILE & PREFERENCES MODAL */}
      {/* ============================================================ */}
      {isProfileModalOpen && (
        <CustomerProfileModal
          onClose={() => setIsProfileModalOpen(false)}
          onSavePreferences={(prefs) => {
            showToast('Dietary preferences updated');
            setIsProfileModalOpen(false);
          }}
        />
      )}

      {/* ============================================================ */}
      {/* ADMIN: ADD NEW DISH MODAL */}
      {/* ============================================================ */}
      {isAddDishOpen && (
        <AddDishModal
          categories={categories}
          onClose={() => setIsAddDishOpen(false)}
          onCreated={(newItem) => {
            setFoodItems(prev => [newItem, ...prev]);
            setIsAddDishOpen(false);
            showToast(`Added ${newItem.name} to Cloud Kitchen Menu`);
          }}
        />
      )}

      {/* ============================================================ */}
      {/* ADMIN: RESTOCK INVENTORY MODAL */}
      {/* ============================================================ */}
      {isRestockModalOpen && (
        <RestockModal
          item={isRestockModalOpen}
          onClose={() => setIsRestockModalOpen(null)}
          onConfirmRestock={(qty) => handleRestock(isRestockModalOpen.id, qty)}
        />
      )}

      {/* Global Footer */}
      <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white">
              <Icon name="flame" className="w-5 h-5 fill-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">FOODOOR PLATFORM</span>
            <span className="text-xs text-zinc-500 font-medium">© 2026 AI Cloud Kitchen Systems</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-400 font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All 6 Cloud Kitchen Stations Operating
            </span>
            <span>Zero-Waste Kitchen Planning</span>
            <span>Supabase PostgreSQL Secured</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// CUSTOMER PLATFORM SUB-VIEW
// ==========================================
function CustomerPlatform({
  categories,
  foodItems,
  allFoodItems,
  aiRecs,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  dietaryFilter,
  setDietaryFilter,
  maxSpice,
  setMaxSpice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  onSelectProduct,
  onAddToCart
}) {
  return (
    <div className="space-y-12">
      {/* HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 bg-gradient-to-br from-zinc-900 via-charcoal-900 to-zinc-950 border border-zinc-800/80 shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-14 sm:py-20 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="max-w-2xl space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold tracking-wider uppercase">
              <Icon name="sparkles" className="w-3.5 h-3.5" />
              Intelligent Cloud Kitchen & Fast Delivery
            </div>

            {/* MAIN BRAND HIGHLIGHT - BIG, BOLD, ATTRACTIVE */}
            <div className="space-y-3">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-amber-400 to-orange-500 drop-shadow-[0_10px_35px_rgba(249,115,22,0.45)]">
                  FOODOOR
                </span>
              </h1>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Your Favourite Food, Delivered Fresh.
              </p>
            </div>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
              Freshly prepared artisan meals crafted in cloud kitchens with real-time order tracking, smart kitchen intelligence, and ultra-fast hot delivery right to your doorstep.
            </p>

            {/* Quick Search & Popular tags */}
            <div className="space-y-3 pt-2">
              <div className="relative max-w-lg">
                <input
                  type="text"
                  placeholder="Search craft smash burgers, burrata pizza, curry bowls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-850/90 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm font-medium focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-xl"
                />
                <Icon name="search" className="absolute left-4 top-4 text-zinc-400 w-5 h-5" />
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-zinc-400">
                <span className="font-semibold text-zinc-500">Popular:</span>
                {['Truffle Burger', 'Burrata Pizza', 'Butter Chicken Bowl', 'Peri Peri Fries'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 font-medium transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Visual Card: Featured Dish */}
          <div className="relative w-full max-w-md">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-700/60 shadow-2xl bg-zinc-900 group">
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" 
                alt="Chef Special Smash Burger" 
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
              
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-black shadow-lg">
                  #1 Best Seller
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold flex items-center gap-1">
                  <Icon name="star" className="w-3 h-3 fill-amber-300" /> 4.95 (240+ reviews)
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Truffle Glazed Smash Burger</h3>
                  <p className="text-xs text-zinc-300">14 min avg prep • Double Angus patty</p>
                </div>
                <button
                  onClick={() => onAddToCart(allFoodItems.find(f => f.id === 'food-1') || allFoodItems[0])}
                  className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg transition transform active:scale-95"
                >
                  Quick Add {formatCurrency(249)}
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* AI RECOMMENDATION SHELF */}
      {aiRecs && aiRecs.budget_meals && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-orange-500/5 border border-brand-500/25">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
                  <Icon name="sparkles" className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Chef's Value Combos</h3>
                  <p className="text-xs text-zinc-400">Personalized main + dessert pairings with guaranteed multi-item discount</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ⚡ Save up to 18%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiRecs.budget_meals.map((combo, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md">
                      {combo.ai_match_tag}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{combo.main} + {combo.dessert}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-black text-brand-400">{formatCurrency(combo.combo_price)}</span>
                      <span className="text-xs text-zinc-500 line-through">{formatCurrency(combo.original_price)}</span>
                      <span className="text-[11px] font-bold text-emerald-400">Save {formatCurrency(combo.savings)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const m = allFoodItems.find(f => f.name === combo.main);
                      const d = allFoodItems.find(f => f.name === combo.dessert);
                      if (m) onAddToCart(m);
                      if (d) onAddToCart(d);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-brand-500 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Icon name="plus" className="w-3.5 h-3.5" />
                    <span>Order Combo</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORIES HORIZONTAL NAVIGATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Explore Menu Categories</span>
          </h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-bold text-brand-400 hover:text-brand-300"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className={`p-4 rounded-2xl border text-center transition-all group flex flex-col items-center gap-2 ${
                  isSelected
                    ? 'bg-brand-500/15 border-brand-500 shadow-lg shadow-brand-500/10'
                    : 'bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-850'
                }`}
              >
                <span className="text-2xl transform group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className={`text-xs font-bold truncate w-full ${isSelected ? 'text-brand-400' : 'text-zinc-200'}`}>
                  {cat.name}
                </span>
                <span className="text-[10px] text-zinc-500 font-medium">
                  {cat.items_count || 0} dishes
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* FILTERS & MENU GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          {/* Dietary Tabs */}
          <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {[
              { id: 'all', label: 'All Dishes' },
              { id: 'vegetarian', label: '🌿 Veg' },
              { id: 'vegan', label: '🌱 Vegan' },
              { id: 'gluten_free', label: '🌾 Gluten-Free' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDietaryFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  dietaryFilter === tab.id
                    ? 'bg-brand-500 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Spice & Sort Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Spice Selector */}
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
              <Icon name="flame" className="w-3.5 h-3.5 text-brand-500" />
              <span>Max Spice:</span>
              <select
                value={maxSpice}
                onChange={(e) => setMaxSpice(Number(e.target.value))}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-zinc-900">Mild (0)</option>
                <option value={1} className="bg-zinc-900">Medium (1)</option>
                <option value={2} className="bg-zinc-900">Spicy (2)</option>
                <option value={3} className="bg-zinc-900">Fire (3)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="recommended" className="bg-zinc-900">Recommended</option>
                <option value="rating" className="bg-zinc-900">Highest Rated</option>
                <option value="prep_time" className="bg-zinc-900">Fastest Prep</option>
                <option value="price_asc" className="bg-zinc-900">Price: Low to High</option>
                <option value="price_desc" className="bg-zinc-900">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foodItems.length === 0 ? (
            <div className="col-span-full py-16 text-center text-zinc-500">
              <Icon name="search" className="w-10 h-10 mx-auto text-zinc-600 mb-2" />
              <h4 className="text-base font-bold text-zinc-300">No matching dishes found</h4>
              <p className="text-sm mt-1">Try resetting the dietary or spice filters to see more menu options.</p>
            </div>
          ) : (
            foodItems.map(item => (
              <div 
                key={item.id}
                className="rounded-3xl bg-zinc-900/90 border border-zinc-800/80 overflow-hidden flex flex-col transition-all duration-300 hover:border-zinc-700 hover:shadow-xl hover:shadow-brand-500/5 group"
              >
                {/* Photo & Badge Overlays */}
                <div 
                  className="relative h-48 overflow-hidden cursor-pointer"
                  onClick={() => onSelectProduct(item)}
                >
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>

                  {/* Dietary Tag Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {item.is_vegetarian && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-black shadow">
                        VEG
                      </span>
                    )}
                    {item.is_vegan && (
                      <span className="px-2 py-0.5 rounded-full bg-green-600/90 text-white text-[10px] font-black shadow">
                        VEGAN
                      </span>
                    )}
                    {item.is_gluten_free && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/90 text-white text-[10px] font-black shadow">
                        GF
                      </span>
                    )}
                  </div>

                  {/* Rating & Prep Time Overlays */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg">
                      <Icon name="star" className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {item.rating} ({item.reviews_count})
                    </span>
                    <span className="flex items-center gap-1 font-semibold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg">
                      <Icon name="clock" className="w-3.5 h-3.5 text-brand-400" />
                      {item.prep_time_minutes} min
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div 
                    className="cursor-pointer" 
                    onClick={() => onSelectProduct(item)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white group-hover:text-brand-400 transition truncate">
                        {item.name}
                      </h3>
                      {item.spice_level > 0 && (
                        <span className="text-xs" title={`Spice level: ${item.spice_level}`}>
                          {'🌶️'.repeat(item.spice_level)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-4 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-brand-400">
                        {formatCurrency(item.price)}
                      </div>
                      {item.calories && (
                        <div className="text-[10px] font-medium text-zinc-500">
                          {item.calories} kcal
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onAddToCart(item)}
                      disabled={!item.is_available}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 transform active:scale-95 ${
                        item.is_available
                          ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      }`}
                    >
                      <Icon name="plus" className="w-3.5 h-3.5" />
                      <span>{item.is_available ? 'Add' : 'Sold Out'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </section>
    </div>
  );
}

// ==========================================
// ADMIN CONTROL PANEL & KDS SUB-VIEW
// ==========================================
function AdminControlPanel({
  adminTab,
  setAdminTab,
  analytics,
  orders,
  foodItems,
  inventory,
  reviews,
  aiForecast,
  forecastWeather,
  setForecastWeather,
  onAdvanceOrder,
  onToggleAvailability,
  onOpenAddDish,
  onOpenRestock,
  onRefreshForecast
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-8">
      {/* Admin Top Header & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-2xl font-black text-white tracking-tight">Cloud Kitchen Control Panel</h1>
          </div>
          <p className="text-xs text-zinc-400 font-medium mt-0.5">
            Real-Time Operations, Kitchen Display System (KDS) & Smart Demand Forecasting
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
          {[
            { id: 'dashboard', label: 'Executive KPIs', icon: 'trending' },
            { id: 'kds', label: `Live KDS (${orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length})`, icon: 'chef' },
            { id: 'forecast', label: 'AI Demand Forecast', icon: 'sparkles' },
            { id: 'menu', label: 'Menu CRUD', icon: 'utensils' },
            { id: 'inventory', label: `Inventory (${inventory.filter(i => i.status !== 'optimal').length} alerts)`, icon: 'box' },
            { id: 'reviews', label: 'Customer Reviews', icon: 'star' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition ${
                adminTab === tab.id
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Icon name={tab.icon} className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: EXECUTIVE DASHBOARD */}
      {adminTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Sales Revenue</span>
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
                  <Icon name="trending" className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {formatCurrency(analytics?.kpis?.total_revenue || 23820)}
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <span>↑ +18.4%</span>
                  <span className="text-zinc-500">vs last week</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Icon name="cart" className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {orders.length}
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">
                  100% fulfill rate
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-bold uppercase tracking-wider">Waste Reduction</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Icon name="leaf" className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  77.1%
                </div>
                <div className="text-xs text-zinc-400 font-medium mt-1">
                  {formatCurrency(28500)} monthly saved
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-bold uppercase tracking-wider">Kitchen Avg Prep</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Icon name="clock" className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  15.4 min
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">
                  Target &lt; 18 min
                </div>
              </div>
            </div>
          </div>

          {/* Visual Sales Chart (Tailwind SVG Chart) */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Weekly Revenue & Order Trajectory</h3>
                <p className="text-xs text-zinc-400">Automated ledger synced with online delivery checkout</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-800 text-zinc-300">
                Last 7 Days
              </span>
            </div>

            {/* Bar Chart Representation */}
            <div className="h-48 flex items-end gap-3 pt-6 border-b border-zinc-800">
              {(analytics?.sales_chart || [
                { date: 'Nov 01', revenue: 28400, orders: 152 },
                { date: 'Nov 02', revenue: 31200, orders: 168 },
                { date: 'Nov 03', revenue: 29800, orders: 159 },
                { date: 'Nov 04', revenue: 34500, orders: 182 },
                { date: 'Nov 05', revenue: 42100, orders: 215 },
                { date: 'Nov 06', revenue: 51400, orders: 254 }
              ]).map((bar, i) => {
                const heightPct = Math.min(100, Math.round((bar.revenue / 60000) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="text-[11px] font-bold text-brand-400 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      {formatCurrency(bar.revenue)}
                    </div>
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-brand-600 to-amber-400 rounded-t-xl group-hover:from-brand-500 group-hover:to-amber-300 transition-all shadow-md shadow-brand-500/10"
                    ></div>
                    <span className="text-[11px] font-bold text-zinc-400">{bar.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hourly Rush Heatmap */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white">Daily Hourly Rush Heatmap</h3>
            <p className="text-xs text-zinc-400">Kitchen load distribution showing lunch (12-2 PM) and dinner peaks (7-9 PM)</p>
            
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 pt-2">
              {(analytics?.hourly_rush || []).map((h, i) => {
                const isPeak = h.orders > 100;
                return (
                  <div 
                    key={i} 
                    className={`p-3 rounded-xl border text-center transition ${
                      isPeak 
                        ? 'bg-brand-500/20 border-brand-500 text-brand-400' 
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-zinc-400">{h.hour}</div>
                    <div className="text-base font-black mt-1 text-white">{h.orders}</div>
                    <div className="text-[10px] font-semibold text-zinc-500">{isPeak ? '🔥 Peak' : 'Normal'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE KITCHEN DISPLAY SYSTEM (KDS) */}
      {adminTab === 'kds' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Icon name="chef" className="w-5 h-5 text-brand-500" />
                Live Kitchen Kanban Dispatcher
              </h2>
              <p className="text-xs text-zinc-400">
                Move orders across stages: Received → Confirmed → Kitchen Prep → Quality Check → Ready for Dispatch → Delivered
              </p>
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
            {[
              { id: 'received', title: '1. Received', color: 'border-zinc-700 bg-zinc-900/60' },
              { id: 'confirmed', title: '2. Confirmed', color: 'border-blue-500/40 bg-blue-500/5' },
              { id: 'kitchen_prep', title: '3. Kitchen Prep', color: 'border-amber-500/40 bg-amber-500/5' },
              { id: 'quality_check', title: '4. Quality Check', color: 'border-purple-500/40 bg-purple-500/5' },
              { id: 'ready_dispatch', title: '5. Ready Dispatch', color: 'border-sky-500/40 bg-sky-500/5' },
              { id: 'delivered', title: '6. Delivered', color: 'border-emerald-500/40 bg-emerald-500/5' }
            ].map(col => {
              const colOrders = orders.filter(o => o.status === col.id);
              return (
                <div key={col.id} className={`rounded-3xl border p-3 flex flex-col min-h-[460px] ${col.color}`}>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                    <span className="text-xs font-black uppercase tracking-wider text-zinc-200">{col.title}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-zinc-800 text-white">
                      {colOrders.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto">
                    {colOrders.map(order => (
                      <div 
                        key={order.id} 
                        className="p-3 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-md space-y-2 hover:border-zinc-600 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-brand-400">#{order.order_number}</span>
                          <span className="text-[10px] text-zinc-400 font-semibold">
                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-white truncate">
                          {order.customer_name}
                        </div>

                        {/* Order Items Checklist */}
                        <div className="space-y-1 text-xs text-zinc-300 py-1 border-t border-zinc-800">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-[11px]">
                              <span className="font-semibold">{item.quantity}x {item.food_name}</span>
                            </div>
                          ))}
                        </div>

                        {/* Advance Button */}
                        {col.id !== 'delivered' && col.id !== 'cancelled' && (
                          <button
                            onClick={() => onAdvanceOrder(order.id)}
                            className="w-full py-1.5 mt-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-[11px] font-black tracking-wide uppercase transition shadow"
                          >
                            Advance ➔
                          </button>
                        )}
                        {col.id === 'delivered' && (
                          <div className="text-[11px] font-bold text-emerald-400 text-center py-1">
                            ✓ Order Complete
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: AI DEMAND FORECASTING */}
      {adminTab === 'forecast' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
                    Smart Demand Forecast
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">Live Projection</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">Order Demand Forecast</h2>
              </div>

              {/* Weather simulation toggle */}
              <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-2xl border border-zinc-800">
                <span className="text-xs font-bold text-zinc-400 px-2">Simulate Weather:</span>
                {[
                  { id: 'Clear', label: '☀️ Clear' },
                  { id: 'Cloudy', label: '⛅ Cloudy' },
                  { id: 'Rainy', label: '🌧️ Rainy (+32%)' }
                ].map(w => (
                  <button
                    key={w.id}
                    onClick={() => { setForecastWeather(w.id); onRefreshForecast(w.id); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      forecastWeather === w.id
                        ? 'bg-brand-500 text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Peak Rush Hour Alert Box */}
            {aiForecast?.peak_rush_hour && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Icon name="alert" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-300">
                    High Demand Alert — Peak at {aiForecast.peak_rush_hour.time} ({aiForecast.peak_rush_hour.predicted_orders} orders expected)
                  </h4>
                  <p className="text-xs text-zinc-300 mt-1">
                    {aiForecast.peak_rush_hour.alert}
                  </p>
                </div>
              </div>
            )}

            {/* 24-Hour Forecast Curve */}
            <div>
              <h3 className="text-sm font-bold text-zinc-200 mb-3">Predicted Hourly Order Volume (Next 24 Hours)</h3>
              <div className="h-44 flex items-end gap-2 pt-4 border-b border-zinc-800">
                {(aiForecast?.hourly_forecast || []).map((h, i) => {
                  const maxOrders = 180;
                  const pct = Math.min(100, Math.round((h.predicted_orders / maxOrders) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                      <div className="text-[10px] font-bold text-brand-400 opacity-0 group-hover:opacity-100 transition">
                        {h.predicted_orders}
                      </div>
                      <div 
                        style={{ height: `${pct}%` }} 
                        className="w-full bg-brand-500/80 hover:bg-brand-400 rounded-t-lg transition-all"
                      ></div>
                      <span className="text-[10px] font-bold text-zinc-500">{h.time_label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Batch Prep Table */}
            <div>
              <h3 className="text-sm font-bold text-zinc-200 mb-3">Recommended Kitchen Prep (Zero Wastage Plan)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(aiForecast?.prep_recommendations || []).map((prep, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-xs font-bold text-white">{prep.item}</span>
                    <div className="text-lg font-black text-brand-400">{prep.recommended_qty}</div>
                    <p className="text-[11px] text-zinc-400">{prep.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Outlook */}
            <div>
              <h3 className="text-sm font-bold text-zinc-200 mb-3">7-Day Kitchen Operational Outlook</h3>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                {(aiForecast?.seven_day_outlook || []).map((d, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-1">
                    <span className="text-xs font-bold text-zinc-400">{d.day} ({d.date})</span>
                    <div className="text-base font-black text-white">{d.predicted_orders} orders</div>
                    <div className="text-xs font-semibold text-emerald-400">{formatCurrency(d.estimated_revenue)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MENU CRUD */}
      {adminTab === 'menu' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Food Menu Management</h2>
              <p className="text-xs text-zinc-400">Add new items, update prices, and toggle instant kitchen availability</p>
            </div>
            <button
              onClick={onOpenAddDish}
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <Icon name="plus" className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-bold border-b border-zinc-800">
                  <tr>
                    <th className="py-4 px-6">Dish Name</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Prep Time</th>
                    <th className="py-4 px-4">Calories</th>
                    <th className="py-4 px-4">Rating</th>
                    <th className="py-4 px-4">Kitchen Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {foodItems.map(item => (
                    <tr key={item.id} className="hover:bg-zinc-850/50 transition">
                      <td className="py-3.5 px-6 flex items-center gap-3">
                        <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-[11px] text-zinc-500">{item.is_vegetarian ? 'Veg' : 'Non-Veg'} • Spice {item.spice_level}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-brand-400">{formatCurrency(item.price)}</td>
                      <td className="py-3.5 px-4 text-zinc-300">{item.prep_time_minutes} min</td>
                      <td className="py-3.5 px-4 text-zinc-400">{item.calories || 500} kcal</td>
                      <td className="py-3.5 px-4 font-bold text-amber-400">★ {item.rating}</td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onToggleAvailability(item.id)}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border transition ${
                            item.is_available
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20'
                          }`}
                        >
                          {item.is_available ? 'In Stock (Active)' : 'Sold Out (Disabled)'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SMART INVENTORY MANAGEMENT */}
      {adminTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Smart Inventory & Ingredient Monitoring</h2>
              <p className="text-xs text-zinc-400">Stock drops automatically when online orders are placed</p>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-bold border-b border-zinc-800">
                  <tr>
                    <th className="py-4 px-6">Ingredient</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Current Stock</th>
                    <th className="py-4 px-4">Min Threshold</th>
                    <th className="py-4 px-4">Health Status</th>
                    <th className="py-4 px-4">Unit Cost</th>
                    <th className="py-4 px-4 text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-medium">
                  {inventory.map(item => (
                    <tr key={item.id} className="hover:bg-zinc-850/50 transition">
                      <td className="py-3.5 px-6 font-bold text-white">{item.ingredient_name}</td>
                      <td className="py-3.5 px-4 text-zinc-400">{item.category}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{item.current_stock} {item.unit}</td>
                      <td className="py-3.5 px-4 text-zinc-400">{item.minimum_threshold} {item.unit}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.status === 'optimal'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : (item.status === 'low'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse')
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-zinc-300">{formatCurrency(item.unit_cost)}/{item.unit}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => onOpenRestock(item)}
                          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-brand-500 text-white font-bold text-xs transition"
                        >
                          + Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: CUSTOMER REVIEWS */}
      {adminTab === 'reviews' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-bold text-white">Customer Feedback & Ratings</h2>
            <p className="text-xs text-zinc-400">Verified customer reviews and feedback collected after delivery</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map(rev => {
              const item = foodItems.find(f => f.id === rev.food_id);
              return (
                <div key={rev.id} className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{rev.customer_name}</span>
                    <span className="text-amber-400 font-bold text-sm">{'★'.repeat(rev.rating)}</span>
                  </div>
                  {item && (
                    <div className="text-xs font-semibold text-brand-400">
                      Dish: {item.name}
                    </div>
                  )}
                  <p className="text-xs text-zinc-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                  <div className="text-[10px] text-zinc-500">
                    {new Date(rev.created_at).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODAL: CHECKOUT & ADDRESS
// ==========================================
function CheckoutModal({ cartTotal, onClose, onConfirmOrder }) {
  const [formData, setFormData] = useState({
    fullName: 'Sarah Sharma',
    phone: '+91 98201 45892',
    email: 'sarah.sharma@example.in',
    street: 'Flat 402, Lotus Grandeur, Central Avenue, Powai',
    city: 'Mumbai',
    zip: '400076',
    instructions: 'Ring doorbell or leave at front door security',
    paymentMethod: 'upi'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmOrder(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Complete Your Order</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Secure payment & instant dispatch to kitchen</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
            <Icon name="cross" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div className="space-y-1">
            <label className="text-zinc-400">Full Name</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400">Phone</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Street Address</label>
            <input
              type="text"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400">Postal Code</label>
              <input
                type="text"
                required
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-2">
            <label className="text-zinc-400">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card', label: '💳 Card' },
                { id: 'upi', label: '📱 UPI / Pay' },
                { id: 'cash', label: '💵 Cash on Delivery' }
              ].map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setFormData({ ...formData, paymentMethod: p.id })}
                  className={`py-2 rounded-xl border text-center font-bold transition ${
                    formData.paymentMethod === p.id
                      ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-400">Total Payable:</span>
              <div className="text-xl font-black text-brand-400">{formatCurrency(cartTotal)}</div>
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-xl shadow-brand-500/20 transition transform active:scale-95"
            >
              Pay & Confirm Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// MODAL: PRODUCT DETAIL & INGREDIENTS
// ==========================================
function ProductDetailModal({ product, onClose, onAddToCart, onSelectSimilar }) {
  const [qty, setQty] = useState(1);
  const [instructions, setInstructions] = useState('');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Photo Header */}
        <div className="relative h-64 sm:h-72">
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent"></div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition"
          >
            <Icon name="cross" className="w-5 h-5" />
          </button>
        </div>

        {/* Details Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white">{product.name}</h2>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400">
                <span className="flex items-center gap-1 font-bold text-amber-400">
                  <Icon name="star" className="w-3.5 h-3.5 fill-amber-400" />
                  {product.rating} ({product.reviews_count} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-zinc-300">
                  <Icon name="clock" className="w-3.5 h-3.5 text-brand-400" />
                  {product.prep_time_minutes} min prep
                </span>
                <span>•</span>
                <span>{product.calories} calories</span>
              </div>
            </div>
            <div className="text-2xl font-black text-brand-400">
              {formatCurrency(product.price)}
            </div>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {product.description}
          </p>

          {/* Macronutrient Breakdown */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Macronutrients</span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-zinc-900">
                <div className="font-bold text-white">{product.protein_g || 34}g</div>
                <div className="text-[10px] text-zinc-500 font-semibold">Protein</div>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900">
                <div className="font-bold text-white">{product.carbs_g || 48}g</div>
                <div className="text-[10px] text-zinc-500 font-semibold">Carbs</div>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900">
                <div className="font-bold text-white">{product.fat_g || 24}g</div>
                <div className="text-[10px] text-zinc-500 font-semibold">Fat</div>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900">
                <div className="font-bold text-brand-400">{product.calories || 550}</div>
                <div className="text-[10px] text-zinc-500 font-semibold">Kcal</div>
              </div>
            </div>
          </div>

          {/* Ingredients & Allergens */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Fresh Ingredients</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {(product.ingredients || []).map((ing, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 text-xs font-medium">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {product.allergens && product.allergens.length > 0 && (
              <div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Allergens</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {product.allergens.map((allg, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                      ⚠ Contains {allg}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Special Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400">Special Cooking Instructions for Chef</label>
            <input
              type="text"
              placeholder="e.g. Extra dressing on the side, well done crust..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Add to Cart Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="text-zinc-400 hover:text-white font-bold"
              >
                <Icon name="minus" className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold w-6 text-center">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                <Icon name="plus" className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => onAddToCart(product, qty, { instructions })}
              className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-xl shadow-brand-500/20 transition flex items-center justify-center gap-2"
            >
              <Icon name="cart" className="w-4 h-4" />
              <span>Add to Order • {formatCurrency(product.price * qty)}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// MODAL: LIVE ORDER TRACKING (6-STAGE PIPELINE)
// ==========================================
function LiveOrderTrackingModal({ order, onClose }) {
  const stages = [
    { id: 'received', title: 'Order Received', desc: 'Order verified by cloud kitchen system' },
    { id: 'confirmed', title: 'Order Confirmed', desc: 'Ticket sent to active kitchen station' },
    { id: 'kitchen_prep', title: 'Kitchen Prep', desc: 'Chef cooking on dedicated line' },
    { id: 'quality_check', title: 'Quality Check', desc: 'Temperature & packaging inspection' },
    { id: 'ready_dispatch', title: 'Ready for Dispatch', desc: 'Couriers courier assigned and en-route' },
    { id: 'delivered', title: 'Delivered', desc: 'Delivered safely to doorstep' }
  ];

  const currentIdx = stages.findIndex(s => s.id === order.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header with Live Pulsing Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Live Kitchen Tracker</span>
            </div>
            <h3 className="text-xl font-black text-white mt-0.5">Order #{order.order_number}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
            <Icon name="cross" className="w-5 h-5" />
          </button>
        </div>

        {/* Estimated Countdown Timer */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-500/20 via-amber-500/10 to-zinc-900 border border-brand-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-zinc-400">Estimated Delivery Time</span>
            <div className="text-3xl font-black text-white mt-0.5">
              {order.status === 'delivered' ? 'Delivered' : `${order.estimated_delivery_minutes || 18} Mins`}
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
            <Icon name="truck" className="w-7 h-7" />
          </div>
        </div>

        {/* 6-Stage Timeline */}
        <div className="space-y-4 pt-2">
          {stages.map((stage, idx) => {
            const isCompleted = idx < currentIdx || order.status === 'delivered';
            const isCurrent = idx === currentIdx;
            return (
              <div key={stage.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : (isCurrent
                          ? 'bg-brand-500 text-white ring-4 ring-brand-500/20 animate-pulse'
                          : 'bg-zinc-800 text-zinc-500')
                  }`}>
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  {idx < stages.length - 1 && (
                    <div className={`w-0.5 h-7 ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
                  )}
                </div>

                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-bold ${isCurrent ? 'text-brand-400' : (isCompleted ? 'text-white' : 'text-zinc-500')}`}>
                      {stage.title}
                    </h4>
                    {order.status_timestamps && order.status_timestamps[stage.id] && (
                      <span className="text-[11px] text-zinc-500">
                        {new Date(order.status_timestamps[stage.id]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{stage.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Courier Details */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold">
              AR
            </div>
            <div>
              <div className="text-xs font-bold text-white">Alex Rivers (Electric Scooter)</div>
              <div className="text-[11px] text-emerald-400 font-semibold">★ 4.95 Courier • 2,400+ deliveries</div>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
            Contact
          </span>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// MODAL: ORDER HISTORY & REORDER
// ==========================================
function OrderHistoryModal({ orders, onClose, onTrack, onReorder, onRate }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-xl font-bold text-white">Previous Orders</h3>
            <p className="text-xs text-zinc-400">Order receipts, reorder 1-click, and leave chef reviews</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
            <Icon name="cross" className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {orders.map(order => (
            <div key={order.id} className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-brand-400">#{order.order_number}</span>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString()} • {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    order.status === 'delivered' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-brand-500/10 text-brand-400 border border-brand-500/30 animate-pulse'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-black text-white">{formatCurrency(order.total)}</span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="text-xs text-zinc-300 space-y-1">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.food_name}</span>
                    <span className="text-zinc-500">{formatCurrency(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-zinc-850 flex items-center justify-end gap-2">
                <button
                  onClick={() => onTrack(order)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 transition"
                >
                  Track Status
                </button>
                <button
                  onClick={() => onReorder(order)}
                  className="px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-xs font-bold text-white transition shadow"
                >
                  Reorder
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// ==========================================
// MODAL: REVIEW & RATING
// ==========================================
function ReviewModal({ foodItem, onClose, onSubmitSuccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('Sarah J.');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food_id: foodItem.id || 'food-1',
          rating,
          comment,
          customer_name: name
        })
      }).then(r => r.json());

      if (res.status === 'success') {
        onSubmitSuccess(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-lg font-bold text-white">Rate & Review Dish</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
            <Icon name="cross" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div className="text-center space-y-2">
            <span className="text-zinc-400">Select Star Rating</span>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-2xl transform hover:scale-125 transition"
                >
                  {star <= rating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Your Feedback</label>
            <textarea
              rows="3"
              required
              placeholder="How was the flavor, temperature, and presentation?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition shadow-lg shadow-brand-500/20"
          >
            Submit Review
          </button>
        </form>

      </div>
    </div>
  );
}

// ==========================================
// MODAL: USER AUTHENTICATION & LOGIN
// ==========================================
function AuthModal({ currentUser, onClose, onLoginSuccess, onLogout }) {
  const [tab, setTab] = useState('signin'); // 'signin' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = tab === 'signin' ? '/auth/login' : '/auth/register';
      const payload = tab === 'signin' 
        ? { email, password }
        : { email, password, full_name: fullName, phone };

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.status === 'success' && res.user) {
        if (res.token) {
          try { localStorage.setItem('foodoor_token', res.token); } catch(e) {}
        }
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Authentication failed. Please check credentials.');
      }
    } catch (err) {
      // In-memory instant fallback login
      const fallbackUser = {
        id: `usr-${Date.now()}`,
        email: email || 'customer@foodoor.in',
        full_name: fullName || (email.includes('admin') ? 'Kitchen Executive' : 'Sarah Sharma'),
        role: email.includes('admin') ? 'admin' : 'customer'
      };
      onLoginSuccess(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (role) => {
    if (role === 'admin') {
      onLoginSuccess({
        id: 'usr-admin',
        email: 'admin@foodoor.in',
        full_name: 'Kitchen Head Chef',
        role: 'admin'
      });
    } else {
      onLoginSuccess({
        id: 'usr-1',
        email: 'sarah.sharma@example.in',
        full_name: 'Sarah Sharma',
        phone: '+91 98201 45892',
        role: 'customer'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">
              {currentUser ? 'Your FOODOOR Account' : (tab === 'signin' ? 'Sign In to FOODOOR' : 'Create New Account')}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {currentUser ? 'Manage your credentials & active role' : 'Access your live order tracking & customized menu'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
            <Icon name="cross" className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          /* Active User Profile Screen */
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-brand-500/20">
                {currentUser.full_name ? currentUser.full_name.charAt(0) : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white truncate">{currentUser.full_name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    currentUser.role === 'admin' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{currentUser.email}</p>
                {currentUser.phone && <p className="text-[11px] text-zinc-500 mt-0.5">{currentUser.phone}</p>}
              </div>
            </div>

            {/* Quick Role Switcher */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Fast Role Switcher:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickLogin('customer')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    currentUser.role === 'customer'
                      ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon name="utensils" className="w-3.5 h-3.5" /> Customer View
                </button>
                <button
                  onClick={() => handleQuickLogin('admin')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    currentUser.role === 'admin'
                      ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon name="sliders" className="w-3.5 h-3.5" /> Kitchen Admin
                </button>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-red-500/20 hover:border-red-500/30 border border-zinc-700 text-zinc-300 hover:text-red-400 font-bold text-xs transition"
            >
              Sign Out from FOODOOR
            </button>
          </div>
        ) : (
          /* Sign In / Register Form */
          <div className="space-y-5">
            {/* Tabs */}
            <div className="flex p-1 rounded-2xl bg-zinc-950 border border-zinc-800">
              <button
                type="button"
                onClick={() => { setTab('signin'); setError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  tab === 'signin' ? 'bg-brand-500 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setTab('register'); setError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                  tab === 'register' ? 'bg-brand-500 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold">
              {tab === 'register' && (
                <>
                  <div className="space-y-1">
                    <label className="text-zinc-400">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-400">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98201 45892"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-zinc-400">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-xl shadow-brand-500/25 transition transform active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : (tab === 'signin' ? 'Sign In to Account' : 'Create FOODOOR Account')}
              </button>
            </form>

            {/* Instant Demo Accounts */}
            <div className="pt-3 border-t border-zinc-800/80 space-y-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block text-center">
                One-Click Instant Demo Login:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('customer')}
                  className="py-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Icon name="user" className="w-3.5 h-3.5 text-brand-400" />
                  <span>Customer Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="py-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Icon name="sliders" className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Demo</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// MODAL: CUSTOMER PROFILE & PREFERENCES
// ==========================================
function CustomerProfileModal({ onClose, onSavePreferences }) {
  const [prefs, setPrefs] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    spiceTolerance: 2,
    defaultAddress: '742 Evergreen Terrace, Suite 4B'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-lg font-bold text-white">Customer Profile</h3>
            <p className="text-xs text-zinc-400">Customize your dietary and taste preferences</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
            <Icon name="cross" className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs font-semibold">
          <div className="space-y-2">
            <span className="text-zinc-400 uppercase tracking-wider text-[10px]">Dietary Preferences</span>
            <div className="space-y-2">
              {[
                { key: 'vegetarian', label: 'Vegetarian Only' },
                { key: 'vegan', label: 'Vegan Plant-Based' },
                { key: 'glutenFree', label: 'Gluten-Free Sensitivity' }
              ].map(opt => (
                <label key={opt.key} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs[opt.key]}
                    onChange={(e) => setPrefs({ ...prefs, [opt.key]: e.target.checked })}
                    className="accent-brand-500 w-4 h-4"
                  />
                  <span className="text-zinc-200 font-bold">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Default Delivery Address</label>
            <input
              type="text"
              value={prefs.defaultAddress}
              onChange={(e) => setPrefs({ ...prefs, defaultAddress: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            onClick={() => onSavePreferences(prefs)}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition shadow-lg shadow-brand-500/20"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODAL: ADMIN ADD NEW DISH
// ==========================================
function AddDishModal({ categories, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: categories[0]?.id || 'cat-1',
    price: '',
    prep_time_minutes: '15',
    calories: '600',
    description: '',
    ingredients: 'Ground Angus Beef, Brioche Bun, Cheese',
    is_vegetarian: false,
    is_gluten_free: false,
    spice_level: 1,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).then(r => r.json());

      if (res.status === 'success') {
        onCreated(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-lg font-bold text-white">Add New Cloud Kitchen Dish</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
            <Icon name="cross" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div className="space-y-1">
            <label className="text-zinc-400">Dish Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400">Price (₹)</label>
              <input
                type="number"
                step="1"
                placeholder="e.g. 249"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-400">Prep Time (Mins)</label>
              <input
                type="number"
                value={formData.prep_time_minutes}
                onChange={(e) => setFormData({ ...formData, prep_time_minutes: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400">Calories</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Description</label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
            ></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Ingredients (comma separated)</label>
            <input
              type="text"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_vegetarian}
                onChange={(e) => setFormData({ ...formData, is_vegetarian: e.target.checked })}
                className="accent-brand-500"
              />
              <span className="text-zinc-300">Vegetarian</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_gluten_free}
                onChange={(e) => setFormData({ ...formData, is_gluten_free: e.target.checked })}
                className="accent-brand-500"
              />
              <span className="text-zinc-300">Gluten-Free</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition shadow-lg shadow-brand-500/20"
          >
            Create Dish
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// MODAL: ADMIN RESTOCK INVENTORY
// ==========================================
function RestockModal({ item, onClose, onConfirmRestock }) {
  const [qty, setQty] = useState(item.reorder_quantity || 20);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h3 className="text-base font-bold text-white">Restock Ingredient</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition">
            <Icon name="cross" className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs font-semibold">
          <div>
            <div className="font-bold text-white text-sm">{item.ingredient_name}</div>
            <div className="text-zinc-400 mt-1">Current Stock: {item.current_stock} {item.unit}</div>
            <div className="text-amber-400">Min Threshold: {item.minimum_threshold} {item.unit}</div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Quantity to Add ({item.unit})</label>
            <input
              type="number"
              step="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-bold text-base focus:outline-none focus:border-brand-500"
            />
          </div>

          <button
            onClick={() => onConfirmRestock(qty)}
            className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition shadow-lg shadow-brand-500/20"
          >
            Confirm Restock
          </button>
        </div>
      </div>
    </div>
  );
}

// Mount React Root
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<FoodoorApp />);
}

