const API = "http://localhost:8080/api/v1";

/* IMAGE FALLBACK MAP */ const SWEET_IMAGES =
{ Laddu: "https://substackcdn.com/image/fetch/$s_!4dnA!,w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb15a9fa7-684e-4d78-a4a5-7b683b777b21_1080x1080.png",
  Barfi: "https://media.istockphoto.com/id/1428238507/photo/singhara-barfi-or-singhada-burfi%C2%A0or-halwa-made-using-water-chestnut-flour-fasting-or-upwas.jpg?s=612x612&w=0&k=20&c=6ToyBFbqLs5IsBh5BhrfWN6xbaWvh11x-Vck-HVmqYE=",
  Chocolate: "https://anandhaassweets.com/cdn/shop/files/ChocolateCashewRolls_1024x1024.png?v=1715681065",
  "Gulab Jamun": "https://falasteenifoodie.com/wp-content/uploads/2024/11/DSC02391-1024x1536.jpg",
  Brownie: "https://www.thereciperebel.com/wp-content/uploads/2022/05/brownie-sundae-TRR-1200-25-of-40.jpg",
  "Kaju Katli": "https://www.cookwithkushi.com/wp-content/uploads/2021/05/best_kaju_katli_kaju_barfi_recipe_00.jpg",
  "Mysore Pak": "https://indiasweethouse.in/cdn/shop/files/MaharajaMysorePak.png?v=1718866847",
  Rasmalai: "https://www.palatesdesire.com/wp-content/uploads/2015/07/Rasmalai_recipe@palates_desire.jpg",
};

let cartItems = [];

/* DOM ELEMENTS */
const cartDrawer = document.getElementById("cartDrawer");
const cartItemsDiv = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

/* AUTO LOGIN */
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (token && user) {
  showPanels(user);
  loadSweets();
  if (user.usertype === "admin") loadRevenue();
}

/* ================= AUTH ================= */

async function login() {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  });

  const data = await res.json();
  if (!data.success) return alert(data.message);

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  location.reload();
}

async function register() {
  await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName: r_name.value,
      email: r_email.value,
      password: r_password.value,
      phone: r_phone.value,
      address: [r_address.value],
      answer: r_answer.value,
    }),
  });

  alert("Registered successfully. Please login.");
  showLogin();
}

/* ================= UI ================= */

function showRegister() {
  loginBox.classList.add("hidden");
  registerBox.classList.remove("hidden");
}

function showLogin() {
  registerBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
}

function showPanels(user) {
  loginBox.classList.add("hidden");
  registerBox.classList.add("hidden");
  userPanel.classList.remove("hidden");
  cartBar.classList.remove("hidden");

  roleBadge.classList.remove("hidden");
  roleBadge.innerText =
    user.usertype === "admin" ? "Admin Dashboard" : "User Dashboard";

  if (user.usertype === "admin") {
    adminPanel.classList.remove("hidden");
  }
}

function logout() {
  localStorage.clear();
  location.reload();
}

/* ================= SWEETS ================= */

async function loadSweets() {
  const res = await fetch(`${API}/sweets`);
  const data = await res.json();
  sweets.innerHTML = "";

  data.sweets.forEach((s) => {
    const image =
      s.image?.trim() || SWEET_IMAGES[s.name] || "https://via.placeholder.com/300";

    sweets.innerHTML += `
      <div class="card">
        <img src="${image}" alt="${s.name}" />
        <h3>${s.name}</h3>
        <p><strong>₹${s.price}</strong></p>
        <button class="primary" onclick="addToCart('${s.name}', ${s.price})">
          Add to Cart
        </button>
      </div>
    `;
  });
}

/* ================= CART ================= */

function toggleCart() {
  cartDrawer.classList.toggle("hidden");
}

function addToCart(name, price) {
  const item = cartItems.find(i => i.name === name);

  if (item) {
    item.qty++;
  } else {
    cartItems.push({ name, price, qty: 1 });
  }

  renderCart();

  /* ✅ AUTO POPUP CART */
  cartDrawer.classList.remove("hidden");
}

function renderCart() {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  cartItems.forEach((item, index) => {
    total += item.price * item.qty;

    cartItemsDiv.innerHTML += `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <span>
          <strong>${item.name}</strong> — ₹${item.price} × ${item.qty}
        </span>
        <span>
          <button onclick="changeQty(${index}, -1)">➖</button>
          <button onclick="changeQty(${index}, 1)">➕</button>
          <button onclick="removeItem(${index})">❌</button>
        </span>
      </div>
    `;
  });

  cartTotal.innerText = total;
  cartCount.innerText = cartItems.reduce((s, i) => s + i.qty, 0);
}

function changeQty(index, change) {
  cartItems[index].qty += change;
  if (cartItems[index].qty <= 0) {
    cartItems.splice(index, 1);
  }
  renderCart();
}

function removeItem(index) {
  cartItems.splice(index, 1);
  renderCart();
}

/* ================= CHECKOUT ================= */

async function confirmCheckout() {
  if (!cartItems.length) return alert("Cart is empty");
  if (!confirm("Proceed with payment?")) return;

  const amount = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  await fetch(`${API}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ amount }),
  });

  alert(`Payment successful! ₹${amount}`);
  cartItems = [];
  renderCart();
  cartDrawer.classList.add("hidden");
}

/* ================= ADMIN ================= */

async function loadRevenue() {
  const res = await fetch(`${API}/admin/revenue`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const data = await res.json();
  totalRevenue.innerText = data.totalRevenue;
}

async function addSweet() {
  await fetch(`${API}/sweets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      name: name.value,
      price: price.value,
      quantity: quantity.value,
      image: image.value,
    }),
  });

  loadSweets();
}