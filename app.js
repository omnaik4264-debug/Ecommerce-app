// Replace this URL with your deployed Backend Render/Vercel URL for live demo
const API_URL = 'http://localhost:5000/api'; 
let cart = [];
let currentRole = 'user';

function switchRole() {
  currentRole = document.getElementById('roleSelect').value;
  document.getElementById('adminPanel').style.display = currentRole === 'admin' ? 'block' : 'none';
}

async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const result = await res.json();
    const list = document.getElementById('productList');
    list.innerHTML = '';
    
    result.data.forEach(p => {
      list.innerHTML += `
        <div class="product-item">
          <div><strong>${p.name}</strong> - $${p.price} (${p.category})</div>
          <button onclick="addToCart('${p.name}', ${p.price})">Add to Cart</button>
        </div>
      `;
    });
  } catch (error) {
    document.getElementById('productList').innerText = "Backend offline. Start server or update API_URL.";
  }
}

function addToCart(name, price) {
  cart.push({ name, price });
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById('cartList');
  let total = 0;
  cartList.innerHTML = '';
  cart.forEach((item) => {
    total += item.price;
    cartList.innerHTML += `<div>${item.name} - $${item.price}</div>`;
  });
  document.getElementById('cartTotal').innerText = total;
}

async function checkout() {
  if (cart.length === 0) return alert("Cart is empty!");
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart, totalAmount: total, user: currentRole })
  });
  
  if (res.ok) {
    alert("Order placed successfully!");
    cart = [];
    renderCart();
    loadOrders();
  }
}

async function loadOrders() {
  try {
    const res = await fetch(`${API_URL}/orders`);
    const result = await res.json();
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = '';
    result.data.forEach(o => {
      orderList.innerHTML += `<div><strong>Order #${o.id}</strong> - Status: ${o.status} ($${o.totalAmount})</div>`;
    });
  } catch (e) { console.log(e); }
}

async function addProduct() {
  const name = document.getElementById('pName').value;
  const price = document.getElementById('pPrice').value;
  const category = document.getElementById('pCat').value;

  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, category, role: currentRole })
  });

  if (res.ok) {
    alert("Product added!");
    loadProducts();
  } else {
    alert("Failed to add product. Make sure you are Admin.");
  }
}

loadProducts();
loadOrders();