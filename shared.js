/* ============================================================
   TechStore NP — shared.js (Supabase Version)
   Loaded by BOTH index.html and dashboard.html
   ============================================================ */

const SUPABASE_URL = "https://ezpskmkjkwrvqvhwljgs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Wdmy1zuWKkXE3GpFdo1CNA_vEDRSgUH";

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ---------- Seed Data ---------- */
const SEED_CATEGORIES = [
    { key: 'smartwatch', label: 'Smartwatches' },
    { key: 'earbuds', label: 'Earbuds' },
    { key: 'power-banks', label: 'Power Banks' }
];

const SEED_PAYMENT_QR = {
    providerName: 'eSewa',
    accountId: '9800000000',
    qrImage: ''
};

/* Canonical status lists — used by both admin dashboard and store front */
const PAYMENT_STATUSES = [
    { key: 'Pending', label: 'Pending', color: 'gray' },
    { key: 'Payment Processing', label: 'Payment Processing', color: 'amber' },
    { key: 'Verified', label: 'Payment Received', color: 'green' },
    { key: 'Failed', label: 'Failed / Rejected', color: 'red' }
];

const ORDER_STATUSES = [
    { key: 'Order Placed', label: 'Order Placed', color: 'blue' },
    { key: 'Processing', label: 'Processing Your Order', color: 'amber' },
    { key: 'Packed', label: 'Payment Received – Order Packed', color: 'amber' },
    { key: 'Shipped', label: 'Shipped', color: 'indigo' },
    { key: 'Near You', label: 'Near Your Location', color: 'indigo' },
    { key: 'Out for Delivery', label: 'Out for Delivery – Attempting Today', color: 'purple' },
    { key: 'Delivered', label: 'Delivered', color: 'green' }
];

const SEED_DELIVERY = [
    { key: 'biratnagar', city: 'Biratnagar', province: 'Koshi', charge: 100 },
    { key: 'kathmandu', city: 'Kathmandu', province: 'Bagmati', charge: 150 },
    { key: 'dharan', city: 'Dharan', province: 'Koshi', charge: 150 },
    { key: 'itahari', city: 'Itahari', province: 'Koshi', charge: 150 },
    { key: 'pokhara', city: 'Pokhara', province: 'Gandaki', charge: 150 },
    { key: 'other', city: 'Other Nepal Locations', province: 'Nationwide', charge: 150 }
];

const SEED_PRODUCTS = [
    { title: 'Ultima Navigator Premium Smartwatch | 1.43" TRU Amoled Spherical Display | In-Build GPS | Barometer | Altimeter | 3 ATM Water Resistance | 24/7 Health Tracking | Fitbeing App Support', brand: 'Ultima', category: 'smartwatch', price: 7499, oldPrice: 11999, rating: 4.5, reviews: 576, sold: '2.4K', badge: 'delivery',
      image: 'https://img.drz.lazcdn.com/g/kf/S5728ddb0c980420ebf12b8fbaf0a6b0b8.png_400x400q75.png_.webp',
      bullets: ['🧭 In-Built GPS, Barometer & Altimeter for phone-free outdoor tracking, route mapping and elevation data', '🖥️ 1.43" Spherical AMOLED display, 466x466 resolution, sharp and vibrant', '❤️ 24/7 Heart Rate, Sleep, SpO₂, and Blood Pressure monitoring', '🔋 300mAh battery: 5–7 days normal use, 10–15 days standby, full charge in 2.5–3 hrs', '📞 Bluetooth V5.3 calling directly from the watch mic & speaker', '💧 3ATM water resistance for daily activities and light water exposure', '📲 Works with the Fitbeing app, compatible with Android 5.0+ and iOS 9+', '💾 4MB RAM + 128MB inbuilt memory for performance data and up to 50 recent messages'],
      description: 'A premium navigator-style smartwatch with in-built GPS, barometer, and altimeter for outdoor tracking, paired with a vivid Spherical AMOLED display and comprehensive 24/7 health monitoring.' },
    { title: 'Ultima Watch Circle, 1.43" Amoled Display, Up to 8 Days Battery Life, BT Calling Smartwatch, Ultima Fit App Support, IP68 Water Resistance, 100+ Watch Faces, Zinc Alloy Metal Frame', brand: 'Ultima', category: 'smartwatch', price: 4299, oldPrice: 5499, rating: 4.5, reviews: 1126, sold: '4.1K', badge: 'delivery',
      image: 'https://img.drz.lazcdn.com/static/np/p/81e0c27ed7f89fe1ab7c6ef9d12f541e.png_2200x2200q80.png_.webp',
      bullets: ['🖥️ 1.43" TRU AMOLED full-screen display, 466x466 resolution, 800 nits brightness', '🔩 Premium zinc alloy metal frame with silicone strap & stainless steel band', '📞 Bluetooth V5.3 calling — dial, answer, reject, view call records, inbuilt mic & speaker', '🔋 250mAh battery: full day of charge in 10 mins, 5–7 days normal use, 15 days standby', '💧 IP68 waterproof, rated up to 1M for 30 mins (not for swimming)', '❤️ 24/7 heart rate, sleep tracking, SpO₂, stress monitoring, female health tracking', '📲 Connects with the DaFit app, 100+ sport modes, 200+ watch faces, in-built games', '🔔 Smart notifications, quick replies, music & camera control, voice assistant support'],
      description: 'A classic round-face smartwatch with a zinc-alloy metal frame, crisp AMOLED display, and genuinely long battery life, backed by 1 year brand warranty.' },
    { title: 'Ultima Watch Flex, 2.01-inch HD Display, Ultima Fit App, Advanced Health', brand: 'Ultima', category: 'smartwatch', price: 2699, oldPrice: 4029, rating: 4.5, reviews: 166, sold: '835', badge: 'delivery',
      image: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=800&q=80',
      bullets: ['📱 2.01" HD rectangular display', '🏃 Ultima Fit App with advanced health tracking', '⏱️ 100+ sport modes', '🔋 Quick charge, days-long battery'],
      description: 'A slim, rectangular smart fitness watch with a crisp HD display and deep integration with the Ultima Fit App for tracking workouts and health.' },
    { title: 'Ultima Magnum E400 Luxury Smartwatch with 1.43" AMOLED', brand: 'Ultima', category: 'smartwatch', price: 4399, oldPrice: 4582, rating: 4.0, reviews: 374, sold: '996', badge: 'delivery',
      image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      bullets: ['👑 Luxury stainless-steel style case', '🖥️ 1.43" AMOLED display with custom watch faces', '📞 Bluetooth calling & notifications', '❤️ Health & fitness tracking suite'],
      description: 'A premium, dressier smartwatch that pairs a luxury case design with the full suite of AMOLED display and health-tracking features.' },
    { title: 'Green Airbeat-520 Dual Mic ENC Earbuds | Modern Sleek Design', brand: 'Green', category: 'earbuds', price: 1299, oldPrice: 2598, rating: 4.5, reviews: 3790, sold: '16.2K', badge: 'gems', badgeText: 'Gems save Rs.13',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      bullets: ['🎙️ Dual mic ENC for clear calls', '🎧 Sleek, low-profile modern design', '🔋 Compact charging case', '👆 Touch controls for music & calls'],
      description: 'A modern, sleek pair of everyday earbuds with dual-mic environmental noise cancellation for cleaner calls on the go.' },
    { title: 'Ultima Boom 141 ANC Earbuds (30dB) | Ultima Link App Support', brand: 'Ultima', category: 'earbuds', price: 2299, oldPrice: 3483, rating: 4.5, reviews: 5146, sold: '22.1K', badge: 'delivery',
      image: 'https://images.unsplash.com/photo-1590658006821-e196d0f5b9ea?auto=format&fit=crop&w=800&q=80',
      bullets: ['🔇 Up to 30dB Active Noise Cancellation', '📲 Ultima Link app with custom EQ', '🎙️ Quad mic clear-call technology', '🔋 Long playtime with fast-charge case'],
      description: 'Serious ANC earbuds with app-controlled sound tuning, built for commuters who want to block the world out.' },
    { title: 'Ultima Atom 192 Pro | App Support | 120H Playtime | Quad Mic', brand: 'Ultima', category: 'earbuds', price: 2099, oldPrice: 2999, rating: 4.5, reviews: 3919, sold: '15.4K', badge: 'delivery',
      image: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?auto=format&fit=crop&w=800&q=80',
      bullets: ['🔋 Up to 120 hours total playtime', '🎙️ Quad mic array for crisp calls', '📲 Ultima app support & EQ presets', '💧 Sweat and splash resistant'],
      description: 'Built for all-day (and all-week) use, with a huge combined playtime, quad-mic call quality, and full app support.' },
    { title: 'Ultima Atom Buds 2 Earbuds | Powered by Ultima Supreme Sound', brand: 'Ultima', category: 'earbuds', price: 2499, oldPrice: 3520, rating: 4.0, reviews: 398, sold: '2.3K', badge: 'delivery',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
      bullets: ['🔊 Ultima Supreme Sound tuning', '🎧 Ergonomic secure-fit design', '🔋 Fast charging, compact case', '👆 Intuitive touch controls'],
      description: 'The second-generation Atom Buds bring richer, fuller sound with Ultima Supreme Sound tuning in a comfortable everyday fit.' },
    { title: 'Ultima Boost 20K Mini Powerbank | 22.5W | 20000 mAh | Fast Charging', brand: 'Ultima', category: 'power-banks', price: 3199, oldPrice: 7998, rating: 4.5, reviews: 253, sold: '1.5K', badge: 'delivery',
      image: 'https://images.unsplash.com/photo-1591290619762-c8e35090c92d?auto=format&fit=crop&w=800&q=80',
      bullets: ['🔋 20,000mAh capacity in a mini form factor', '⚡ 22.5W fast charging output', '🎨 Available in multiple colors', '✈️ Airline carry-on safe'],
      description: 'A compact, colorful 20,000mAh power bank that still packs 22.5W fast charging into a genuinely pocketable size.' },
    { title: 'Ultima Boost 20K Pro 20000mAh Powerbank with 22.5W Display', brand: 'Ultima', category: 'power-banks', price: 2599, oldPrice: 3822, rating: 4.5, reviews: 613, sold: '3.4K', badge: 'delivery',
      image: 'https://images.unsplash.com/photo-1609592807982-14b301c238b9?auto=format&fit=crop&w=800&q=80',
      bullets: ['🔋 20,000mAh capacity, 22.5W fast charging', '📊 Digital percentage display', '🔌 Dual USB-A + USB-C output', '⚡ Charges two devices at once'],
      description: 'The Pro version adds a digital battery-percentage display so you always know exactly how much charge is left.' },
    { title: 'Green Turbo-20 | 20000mAh Fast Powerbank | 22.5W | PD Fast Charging', brand: 'Green', category: 'power-banks', price: 2399, oldPrice: 3998, rating: 4.5, reviews: 558, sold: '2.7K', badge: 'gems', badgeText: 'Gems save Rs.24',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      bullets: ['🔋 20,000mAh capacity', '⚡ 22.5W PD fast charging', '🔌 Multiple built-in charging cables', '📊 LED battery indicator'],
      description: 'A no-fuss 20,000mAh power bank with PD fast charging and built-in cables so you never forget one at home.' },
    { title: 'Mypower Fast Charging Powerbank | 20000mAh | 22.5W PD', brand: 'Mypower', category: 'power-banks', price: 3325, oldPrice: 3500, rating: 4.0, reviews: 620, sold: '2.5K', badge: 'gems', badgeText: 'Gems save Rs.33',
      image: 'https://images.unsplash.com/photo-1620641622206-2a5c1f3e8d6e?auto=format&fit=crop&w=800&q=80',
      bullets: ['🔋 20,000mAh capacity', '⚡ 22.5W PD fast charging output', '📊 Digital battery display', '🎨 Sleek matte finish'],
      description: 'A reliable high-capacity power bank with fast PD charging and a clean, minimal design.' }
];

/* ---------- One-time Seeding ---------- */
async function ensureSeeded() {
    try {
        const { data: products } = await db.from('products').select('id').limit(1);
        if (!products || products.length === 0) {
            await db.from('products').insert(SEED_PRODUCTS);
        }

        const { data: categories } = await db.from('meta').select('list').eq('id', 'categories').single();
        if (!categories) {
            await db.from('meta').upsert({ id: 'categories', list: SEED_CATEGORIES }, { onConflict: 'id' });
        }

        const { data: delivery } = await db.from('meta').select('list').eq('id', 'delivery').single();
        if (!delivery) {
            await db.from('meta').upsert({ id: 'delivery', list: SEED_DELIVERY }, { onConflict: 'id' });
        }

        const { data: paymentQr } = await db.from('meta').select('list').eq('id', 'payment_qr').single();
        if (!paymentQr) {
            await db.from('meta').upsert({ id: 'payment_qr', list: SEED_PAYMENT_QR }, { onConflict: 'id' });
        }
    } catch (e) {
        console.error('Seeding error:', e);
    }
}

/* ---------- Realtime Subscriptions & Fetching ---------- */
function subscribeProducts(callback) {
    const fetchAndCallback = async () => {
        const { data, error } = await db.from('products').select('*');
        if (!error && data) callback(data);
    };

    fetchAndCallback();

    const channel = db.channel('realtime:products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
            fetchAndCallback();
        })
        .subscribe();

    return () => db.removeChannel(channel);
}

function subscribeCategories(callback) {
    const fetchAndCallback = async () => {
        const { data } = await db.from('meta').select('list').eq('id', 'categories').single();
        if (data) callback(data.list || []);
    };

    fetchAndCallback();

    const channel = db.channel('realtime:categories')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'meta', filter: 'id=eq.categories' }, () => {
            fetchAndCallback();
        })
        .subscribe();

    return () => db.removeChannel(channel);
}

function subscribeDelivery(callback) {
    const fetchAndCallback = async () => {
        const { data } = await db.from('meta').select('list').eq('id', 'delivery').single();
        if (data) callback(data.list || []);
    };

    fetchAndCallback();

    const channel = db.channel('realtime:delivery')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'meta', filter: 'id=eq.delivery' }, () => {
            fetchAndCallback();
        })
        .subscribe();

    return () => db.removeChannel(channel);
}

function subscribePaymentQRConfig(callback) {
    const fetchAndCallback = async () => {
        const { data, error } = await db.from('meta').select('list').eq('id', 'payment_qr').single();
        if (!error && data) callback(data.list || SEED_PAYMENT_QR);
        else callback(SEED_PAYMENT_QR);
    };

    fetchAndCallback();

    const channel = db.channel('realtime:payment_qr')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'meta', filter: 'id=eq.payment_qr' }, () => {
            fetchAndCallback();
        })
        .subscribe();

    return () => db.removeChannel(channel);
}

async function savePaymentQRConfig(config) {
    const { error } = await db.from('meta').upsert({ id: 'payment_qr', list: config }, { onConflict: 'id' });
    if (error) throw error;
}

// Backward-compatible aliases (older cached pages may still call these names)
const subscribeEsewaConfig = subscribePaymentQRConfig;
const saveEsewaConfig = savePaymentQRConfig;

/* ---------- Orders & User Auth Helpers ---------- */
async function registerUser(name, email, phone, password) {
    const { data: existing } = await db.from('users_app').select('id').eq('email', email).single();
    if (existing) throw new Error('Email is already registered.');
    const { data, error } = await db.from('users_app').insert([{ name, email, phone, password }]).select().single();
    if (error) throw error;
    return data;
}

async function loginUser(email, password) {
    const { data, error } = await db.from('users_app').select('*').eq('email', email).eq('password', password).single();
    if (error || !data) throw new Error('Invalid email or password.');
    return data;
}

async function createOrder(orderData) {
    const { data, error } = await db.from('orders').insert([orderData]).select().single();
    if (error) throw error;
    return data;
}

function subscribeUserOrders(userId, callback) {
    const fetchAndCallback = async () => {
        const { data, error } = await db.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        if (!error && data) callback(data);
    };

    fetchAndCallback();

    const channel = db.channel(`realtime:orders:${userId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
            fetchAndCallback();
        })
        .subscribe();

    return () => db.removeChannel(channel);
}

function subscribeAllOrders(callback) {
    const fetchAndCallback = async () => {
        const { data, error } = await db.from('orders').select('*').order('created_at', { ascending: false });
        if (!error && data) callback(data);
    };

    fetchAndCallback();

    const channel = db.channel('realtime:all_orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
            fetchAndCallback();
        })
        .subscribe();

    return () => db.removeChannel(channel);
}

async function updateOrderDetails(orderId, updates) {
    const { error } = await db.from('orders').update(updates).eq('id', orderId);
    if (error) throw error;
}

/* ---------- Database Writes ---------- */
async function saveProductDoc(id, data) {
    if (id) {
        const { error } = await db.from('products').update(data).eq('id', id);
        if (error) throw error;
        return id;
    } else {
        const { data: inserted, error } = await db.from('products').insert([data]).select().single();
        if (error) throw error;
        return inserted.id;
    }
}

async function deleteProductDoc(id) {
    const { error } = await db.from('products').delete().eq('id', id);
    if (error) throw error;
}

async function saveCategoriesDoc(list) {
    const { error } = await db.from('meta').upsert({ id: 'categories', list }, { onConflict: 'id' });
    if (error) throw error;
}

async function saveDeliveryDoc(list) {
    const { error } = await db.from('meta').upsert({ id: 'delivery', list }, { onConflict: 'id' });
    if (error) throw error;
}

/* ---------- Utils ---------- */
function slugify(text) {
    return text.toString().toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || ('cat-' + Date.now());
}
