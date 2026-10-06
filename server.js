const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory Mock Database
let products = [
  { id: 1, name: "Laptop", price: 999, category: "Electronics" },
  { id: 2, name: "Headphones", price: 199, category: "Electronics" },
  { id: 3, name: "Sneakers", price: 85, category: "Footwear" }
];

let orders = [];

// API Health Check
app.get('/', (req, res) => {
  res.send("E-Commerce Backend API is Running!");
});

// Get Products
app.get('/api/products', (req, res) => {
  res.json({ success: true, data: products });
});

// Add Product (Admin Feature)
app.post('/api/products', (req, res) => {
  const { name, price, category, role } = req.body;
  if (role !== 'admin') {
    return res.status(403).json({ success: false, message: "Unauthorized access" });
  }
  const newProduct = { id: products.length + 1, name, price: Number(price), category };
  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// Place Order
app.post('/api/orders', (req, res) => {
  const { items, totalAmount, user } = req.body;
  const newOrder = { id: orders.length + 1, items, totalAmount, user, status: "Placed" };
  orders.push(newOrder);
  res.status(201).json({ success: true, data: newOrder });
});

// Get Orders
app.get('/api/orders', (req, res) => {
  res.json({ success: true, data: orders });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));