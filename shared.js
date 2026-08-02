// ==========================================
// SUPABASE INITIALIZATION
// ==========================================
const SUPABASE_URL = 'https://ezpskmkjkwrvqvhwljgs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Wdmy1zuWKkXE3GpFdo1CNA_vEDRSgUH';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// State Variables
let cart = JSON.parse(localStorage.getItem('techstore_cart')) || [];
let isSignUpMode = false;

// ==========================================
// AUTHENTICATION LOGIC (Email & Password)
// ==========================================

function openAuthModal() {
  document.getElementById('authModal').classList.remove('hidden');
}

function closeAuthModal() {
  document.getElementById('authModal').classList.add('hidden');
}

function toggleAuthMode(e) {
  if (e) e.preventDefault();
  isSignUpMode = !isSignUpMode;

  const title = document.getElementById('authTitle');
  const submitBtn = document.getElementById('authSubmitBtn');
  const toggleText = document.getElementById('authToggleText');
  const toggleLink = document.getElementById('authToggleLink');

  if (isSignUpMode) {
    title.innerText = "Create Account";
    submitBtn.innerText = "Sign Up";
    toggleText.innerText = "Already have an account?";
    toggleLink.innerText = "Sign In";
  } else {
    title.innerText = "Sign In";
    submitBtn.innerText = "Sign In";
    toggleText.innerText = "Don't have an account?";
    toggleLink.innerText = "Sign Up";
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();

  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    if (isSignUpMode) {
      const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      alert("Registration successful! You can now log in.");
      toggleAuthMode();
    } else {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      alert("Logged in successfully!");
      closeAuthModal();
      checkUserSession();
    }
  } catch (err) {
    console.error("Auth error:", err);
    alert(err.message || "Authentication failed.");
  }
}

async function checkUserSession() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  const userBtn = document.getElementById('userAuthBtn');

  if (userBtn) {
    if (session) {
      userBtn.innerText = session.user.email.split('@')[0];
      userBtn.onclick = () => {
        if (confirm("Do you want to log out?")) {
          supabaseClient.auth.signOut().then(() => location.reload());
        }
      };
    } else {
      userBtn.innerText = "Account";
      userBtn.onclick = openAuthModal;
    }
  }
}

// ==========================================
// CART FUNCTIONS
// ==========================================

function updateCartUI() {
  const cartCountEl = document.getElementById('cartCount');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartCountEl) cartCountEl.innerText = totalItems;
  if (cartTotalEl) cartTotalEl.innerText = `Rs. ${totalPrice.toLocaleString()}`;

  if (cartItemsEl) {
    if (cart.length === 0) {
      cartItemsEl.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    } else {
      cartItemsEl.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
          <img src="${item.image || 'https://via.placeholder.com/60'}" alt="${item.title}" />
          <div class="cart-item-details">
            <h4>${item.title}</h4>
            <p>Rs. ${item.price.toLocaleString()} x ${item.quantity}</p>
          </div>
          <button onclick="removeFromCart(${index})" class="remove-btn">&times;</button>
        </div>
      `).join('');
    }
  }

  localStorage.setItem('techstore_cart', JSON.stringify(cart));
}

function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
  openCartDrawer();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) drawer.classList.add('open');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  if (drawer) drawer.classList.remove('open');
}

// ==========================================
// REALTIME SUBSCRIPTIONS
// ==========================================

function setupRealtimeSubscriptions(onProductChange, onOrderChange) {
  supabaseClient
    .channel('public-schema-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
      if (onProductChange) onProductChange(payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
      if (onOrderChange) onOrderChange(payload);
    })
    .subscribe();
}

document.addEventListener('DOMContentLoaded', () => {
  checkUserSession();
  updateCartUI();
});
