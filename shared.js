/* shared.js - Supabase Initialization & Data Bridge */

const SUPABASE_URL = "https://ezpskmkjkwrvqvhwljgs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Wdmy1zuWKkXE3GpFdo1CNA_vEDRSgUH";

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Default Seed Data
const DEFAULT_PRODUCTS = [
    {
        id: "p1",
        title: "Ultima Wave 300 Bluetooth Neckband with Fast Charge",
        category: "earbuds",
        brand: "Ultima",
        price: 1899,
        oldPrice: 2499,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
        badge: "delivery",
        badgeText: "Fast Delivery",
        rating: 4.5,
        sold: "1.2k",
        reviews: 142,
        description: "Experience high-fidelity wireless sound with ultra-low latency mode for gaming and fast charging capability.",
        bullets: ["Up to 30 Hours Playtime", "Environmental Noise Cancellation (ENC)", "IPX5 Sweat & Water Resistance", "10-min charge gives 10 hours playtime"]
    },
    {
        id: "p2",
        title: "Oraimo Watch ER 1.43'' AMOLED Display Smartwatch",
        category: "smartwatches",
        brand: "Oraimo",
        price: 4599,
        oldPrice: 5999,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60",
        badge: "gems",
        badgeText: "Best Seller",
        rating: 4.8,
        sold: "850",
        reviews: 98,
        description: "Premium smartwatch featuring a vibrant AMOLED display, Bluetooth calling, and comprehensive health tracking.",
        bullets: ["1.43-inch HD AMOLED Display", "Bluetooth Calling & Message Sync", "100+ Sports Modes", "SpO2 & Heart Rate Monitoring"]
    },
    {
        id: "p3",
        title: "Anker PowerBank 20000mAh 22.5W Fast Charging",
        category: "powerbanks",
        brand: "Anker",
        price: 3299,
        oldPrice: 3999,
        image: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=500&auto=format&fit=crop&q=60",
        badge: "delivery",
        badgeText: "Fast Delivery",
        rating: 4.7,
        sold: "2.1k",
        reviews: 310,
        description: "High-capacity power bank equipped with 22.5W fast output to keep all your devices charged on the go.",
        bullets: ["20,000mAh High Capacity", "22.5W Power Delivery", "Triple Output Ports", "Advanced Temperature Control"]
    }
];

const DEFAULT_CATEGORIES = [
    { key: "smartwatches", label: "Smart Watches" },
    { key: "earbuds", label: "Earbuds & Audio" },
    { key: "powerbanks", label: "Power Banks" }
];

const DEFAULT_DELIVERY = [
    { key: "biratnagar", city: "Biratnagar", charge: 100 },
    { key: "outside", city: "Other Cities (Nepal)", charge: 150 }
];

/* ===================================================
   DATABASE SEEDING (Auto-runs if tables are empty)
=================================================== */
async function ensureSeeded() {
    try {
        const { data: prods } = await supabase.from('products').select('id').limit(1);
        if (!prods || prods.length === 0) {
            await supabase.from('products').insert(DEFAULT_PRODUCTS);
        }

        const { data: cats } = await supabase.from('categories').select('key').limit(1);
        if (!cats || cats.length === 0) {
            await supabase.from('categories').insert(DEFAULT_CATEGORIES);
        }

        const { data: deliv } = await supabase.from('delivery_rates').select('key').limit(1);
        if (!deliv || deliv.length === 0) {
            await supabase.from('delivery_rates').insert(DEFAULT_DELIVERY);
        }
    } catch (err) {
        console.warn("Seeding check skipped or table pending setup:", err);
    }
}

/* ===================================================
   REAL-TIME SUBSCRIPTIONS & FETCHERS
=================================================== */
function subscribeProducts(callback) {
    // Initial Fetch
    supabase.from('products').select('*').then(({ data, error }) => {
        if (!error && data) callback(data);
    });

    // Real-time listener
    return supabase.channel('public:products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
            const { data } = await supabase.from('products').select('*');
            if (data) callback(data);
        })
        .subscribe();
}

function subscribeCategories(callback) {
    supabase.from('categories').select('*').then(({ data, error }) => {
        if (!error && data) callback(data);
    });

    return supabase.channel('public:categories')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, async () => {
            const { data } = await supabase.from('categories').select('*');
            if (data) callback(data);
        })
        .subscribe();
}

function subscribeDelivery(callback) {
    supabase.from('delivery_rates').select('*').then(({ data, error }) => {
        if (!error && data) callback(data);
    });

    return supabase.channel('public:delivery_rates')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_rates' }, async () => {
            const { data } = await supabase.from('delivery_rates').select('*');
            if (data) callback(data);
        })
        .subscribe();
}

/* ===================================================
   DATABASE MUTATIONS (ADMIN)
=================================================== */
async function saveProductData(product) {
    const { error } = await supabase.from('products').upsert([product]);
    if (error) console.error("Error saving product:", error);
}

async function deleteProductData(id) {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.error("Error deleting product:", error);
}

async function saveCategoryData(category) {
    const { error } = await supabase.from('categories').upsert([category]);
    if (error) console.error("Error saving category:", error);
}

async function deleteCategoryData(key) {
    const { error } = await supabase.from('categories').delete().eq('key', key);
    if (error) console.error("Error deleting category:", error);
}

async function saveDeliveryData(delivery) {
    const { error } = await supabase.from('delivery_rates').upsert([delivery]);
    if (error) console.error("Error saving delivery location:", error);
}

async function deleteDeliveryData(key) {
    const { error } = await supabase.from('delivery_rates').delete().eq('key', key);
    if (error) console.error("Error deleting delivery location:", error);
}
