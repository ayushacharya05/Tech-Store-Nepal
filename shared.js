/* shared.js - Shared configuration for both Index and Dashboard */
const SUPABASE_URL = "https://ezpskmkjkwrvqvhwljgs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Wdmy1zuWKkXE3GpFdo1CNA_vEDRSgUH";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Shared function to listen for real-time updates
function subscribeProducts(callback) {
    supabase.from('products').select('*').then(({ data }) => callback(data || []));
    return supabase.channel('public:products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, async () => {
            const { data } = await supabase.from('products').select('*');
            callback(data || []);
        })
        .subscribe();
}

// Database helper functions for the dashboard
async function saveProductData(product) {
    await supabase.from('products').upsert([product]);
}

async function deleteProductData(id) {
    await supabase.from('products').delete().eq('id', id);
}
