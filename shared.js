/* ============================================================
   TechStore NP — shared.js (Supabase Version)
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

const SEED_DELIVERY = [
    { key: 'biratnagar', city: 'Biratnagar', province: 'Koshi', charge: 100 },
    { key: 'kathmandu', city: 'Kathmandu', province: 'Bagmati', charge: 150 },
    { key: 'dharan', city: 'Dharan', province: 'Koshi', charge: 150 },
    { key: 'itahari', city: 'Itahari', province: 'Koshi', charge: 150 },
    { key: 'pokhara', city: 'Pokhara', province: 'Gandaki', charge: 150 },
    { key: 'other', city: 'Other Nepal Locations', province: 'Nationwide', charge: 150 }
];

const SEED_PRODUCTS = [
    { title: 'Ultima Navigator Premium Smartwatch | 1.43" TRU Amoled Display | In-Build GPS | Barometer | Altimeter | 3 ATM Water Resistance | 24/7 Health Tracking | Fitbeing App Support', brand: 'Ultima', category: 'smartwatch', price: 7499, oldPrice: 11999, rating: 4.5, reviews: 576, sold: '2.4K', badge: 'delivery',
      image: 'https://img.drz.lazcdn.com/g/kf/S5728ddb0c980420ebf12b8fbaf0a6b0b8.png_400x400q75.png_.webp',
      bullets: ['🧭 In-Built GPS, Barometer & Altimeter for phone-free outdoor tracking, route mapping and elevation data', '🖥️ 1.43" Spherical AMOLED display, 466x466 resolution, sharp and vibrant', '❤️ 24/7 Heart Rate, Sleep, SpO₂, and Blood Pressure monitoring', '🔋 300mAh battery: 5–7 days normal use, 10–15 days standby, full charge in 2.5–3 hrs', '📞 Bluetooth V5.3 calling directly from the watch mic & speaker', '💧 3ATM water resistance for daily activities and light water exposure', '📲 Works with the Fitbeing app, compatible with Android 5.0+ and iOS 9+', '💾 4MB RAM + 128MB inbuilt memory for performance data and up to 50 recent messages'],
      description: 'A premium navigator-style smartwatch with in-built GPS, barometer, and altimeter for outdoor tracking, paired with a vivid Spherical AMOLED display and comprehensive 24/7 health monitoring.' },
    { title: 'Ultima Watch Circle, 1.43" Amoled Display, Up to 8 Days Battery Life, BT Calling Smartwatch, Ultima Fit App Support, IP68 Water Resistance, 100+ Watch Faces, Zinc Alloy Metal Frame', brand: 'Ultima', category: 'smartwatch', price: 4299, oldPrice: 5499, rating: 4.5, reviews: 1126, sold: '4.1K', badge: 'delivery',
      image: 'https://img.drz.lazcdn.com/static/np/p/81e0c27ed7f89fe1ab7c6ef9d12f541e.png_2200x2200q80.png_.webp',
      bullets: ['🖥️ 1.43" TRU AMOLED full-screen display, 466x466 resolution, 800 nits brightness', '🔩 Premium zinc alloy metal frame with silicone strap & stainless steel band', '📞 Bluetooth V5.3 calling — dial, answer, reject, view call records, inbuilt mic & speaker', '🔋 250mAh battery: full day of charge in 10 mins, 5–7 days normal use, 15 days standby', '💧 IP68 waterproof, rated up to 1M for 30 mins (not for swimming)', '❤️ 24/7 heart rate, sleep tracking, SpO₂, stress monitoring, female health tracking', '📲 Connects with the DaFit app, 100+ sport modes, 200+ watch faces, in-built games', '🔔 Smart notifications, quick replies, music & camera control, voice assistant support'],
      description: 'A classic round-face smartwatch with a zinc-alloy metal frame, crisp AMOLED display, and genuinely long battery life, backed by 1 year brand warranty.' }
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
            await db.from('meta').upsert({ id: 'categories', list: SEED_CATEGORIES });
        }

        const { data: delivery } = await db.from('meta').select('list').eq('id', 'delivery').single();
        if (!delivery) {
            await db.from('meta').upsert({ id: 'delivery', list: SEED_DELIVERY });
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
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchAndCallback)
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
        .on('postgres_changes', { event: '*', schema: 'public', table: 'meta', filter: 'id=eq.categories' }, fetchAndCallback)
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
        .on('postgres_changes', { event: '*', schema: 'public', table: 'meta', filter: 'id=eq.delivery' }, fetchAndCallback)
        .subscribe();
    return () => db.removeChannel(channel);
}

function subscribeOrders(callback) {
    const fetchAndCallback = async () => {
        const { data } = await db.from('orders').select('*').order('created_at', { ascending: false });
        if (data) callback(data);
    };
    fetchAndCallback();
    const channel = db.channel('realtime:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchAndCallback)
        .subscribe();
    return () => db.removeChannel(channel);
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
    const { error } = await db.from('meta').upsert({ id: 'categories', list });
    if (error) throw error;
}

async function saveDeliveryDoc(list) {
    const { error } = await db.from('meta').upsert({ id: 'delivery', list });
    if (error) throw error;
}

async function updateOrderStatusDoc(orderId, status, payment_status) {
    const updateData = {};
    if (status) updateData.status = status;
    if (payment_status) updateData.payment_status = payment_status;
    const { error } = await db.from('orders').update(updateData).eq('id', orderId);
    if (error) throw error;
}

function slugify(text) {
    return text.toString().toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || ('cat-' + Date.now());
}
