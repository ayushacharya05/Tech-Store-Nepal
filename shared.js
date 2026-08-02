// --- SUPABASE INITIALIZATION ---
const SUPABASE_URL = 'https://ezpskmkjkwrvqvhwljgs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Wdmy1zuWKkXE3GpFdo1CNA_vEDRSgUH';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- LOCAL STORAGE USER SESSION ---
function getStoredUser() {
  return JSON.parse(localStorage.getItem('techstore_user')) || null;
}

function setStoredUser(userObj) {
  localStorage.setItem('techstore_user', JSON.stringify(userObj));
}

function logoutUser() {
  localStorage.removeItem('techstore_user');
}

// --- PRODUCTS API ---
async function saveProductDoc(id, productData) {
  const payload = {
    title: productData.title,
    brand: productData.brand,
    category: productData.category,
    price: productData.price,
    old_price: productData.oldPrice || null,
    image: productData.image,
    description: productData.description,
    bullets: productData.bullets,
    rating: productData.rating,
    reviews: productData.reviews,
    sold: productData.sold,
    badge: productData.badge,
    badge_text: productData.badgeText
  };

  if (id) {
    const { error } = await supabase.from('products').update(payload).eq('id', id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('products').insert([payload]);
    if (error) throw error;
  }
}

async function deleteProductDoc(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

function subscribeProducts(callback) {
  supabase.from('products').select('*').then(({ data }) => callback(data || []));

  const channel = supabase
    .channel('public:products')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
      supabase.from('products').select('*').then(({ data }) => callback(data || []));
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}

// --- CATEGORIES API ---
async function saveCategoriesDoc(categoriesList) {
  const { error } = await supabase.from('store_config').upsert({ id: 'categories', data: categoriesList });
  if (error) throw error;
}

function subscribeCategories(callback) {
  supabase.from('store_config').select('data').eq('id', 'categories').single().then(({ data }) => {
    callback(data ? data.data : []);
  });

  const channel = supabase
    .channel('public:categories')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'store_config', filter: 'id=eq.categories' }, (payload) => {
      callback(payload.new ? payload.new.data : []);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}

// --- DELIVERY RATES API ---
async function saveDeliveryDoc(deliveryRatesList) {
  const { error } = await supabase.from('store_config').upsert({ id: 'delivery_rates', data: deliveryRatesList });
  if (error) throw error;
}

function subscribeDelivery(callback) {
  supabase.from('store_config').select('data').eq('id', 'delivery_rates').single().then(({ data }) => {
    callback(data ? data.data : []);
  });

  const channel = supabase
    .channel('public:delivery')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'store_config', filter: 'id=eq.delivery_rates' }, (payload) => {
      callback(payload.new ? payload.new.data : []);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}

// --- ORDERS API ---
async function createOrderDoc(orderData) {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      customer_name: orderData.name,
      customer_phone: orderData.phone,
      customer_address: orderData.address,
      city: orderData.city,
      items: orderData.items,
      total_amount: orderData.total,
      payment_method: orderData.paymentMethod,
      payment_status: orderData.paymentMethod === 'esewa' ? 'on_hold' : 'pending',
      order_status: 'Order Placed',
      transaction_ref: orderData.transactionRef || ''
    }])
    .select();

  if (error) throw error;
  return data[0];
}

async function fetchUserOrders(phone) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_phone', phone)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

async function updateOrderStatusDoc(orderId, orderStatus, paymentStatus) {
  const { data, error } = await supabase
    .from('orders')
    .update({ 
      order_status: orderStatus,
      payment_status: paymentStatus
    })
    .eq('id', orderId);

  if (error) throw error;
  return data;
}

function subscribeOrders(callback) {
  supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data }) => callback(data || []));

  const channel = supabase
    .channel('public:orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
      supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data }) => callback(data || []));
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}
