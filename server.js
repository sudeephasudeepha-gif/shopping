// ShopEasy backend: plain Node.js, no npm packages needed
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ORDERS_FILE = path.join(__dirname, "orders.json");

// Product data lives on the server, so prices cannot be tampered with from the browser
const PRODUCTS = [
  { id: 1, name: "Wireless Headphones", cat: "Audio", price: 1999, e: "🎧" },
  { id: 2, name: "Smart Watch", cat: "Wearables", price: 3499, e: "⌚" },
  { id: 3, name: "Running Shoes", cat: "Fashion", price: 2499, e: "👟" },
  { id: 4, name: "Backpack", cat: "Bags", price: 1299, e: "🎒" },
  { id: 5, name: "Bluetooth Speaker", cat: "Audio", price: 1599, e: "🔊" },
  { id: 6, name: "Sunglasses", cat: "Fashion", price: 799, e: "🕶️" },
  { id: 7, name: "Mechanical Keyboard", cat: "Computers", price: 2899, e: "⌨️" },
  { id: 8, name: "Water Bottle", cat: "Lifestyle", price: 499, e: "🍶" },
];


const readOrders = () => {
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8")); } catch { return []; }
};

const send = (res, code, obj) => {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(obj));
};

function createOrder(req, res) {
  let raw = "";
  req.on("data", (chunk) => {
    raw += chunk;
    if (raw.length > 1e5) req.destroy();
  });
  req.on("end", () => {
    let body;
    try { body = JSON.parse(raw); } catch { return send(res, 400, { error: "Invalid JSON" }); }

    const c = body.customer || {};
    const items = Array.isArray(body.items) ? body.items : [];
    if (!c.name || !/^\S+@\S+\.\S+$/.test(c.email || "") || !/^\d{10}$/.test(c.phone || "") || !c.address) {
      return send(res, 400, { error: "Invalid customer details" });
    }

    // Recalculate the total on the server from trusted prices
    let total = 0;
    const lines = [];
    for (const it of items) {
      const p = PRODUCTS.find((x) => x.id === it.id);
      const qty = parseInt(it.qty, 10);
      if (!p || !(qty > 0)) return send(res, 400, { error: "Invalid cart item" });
      lines.push({ id: p.id, name: p.name, price: p.price, qty });
      total += p.price * qty;
    }
    if (!lines.length) return send(res, 400, { error: "Cart is empty" });

    const orders = readOrders();
    const order = {
      orderId: "ORD" + (100001 + orders.length),
      date: new Date().toISOString(),
      customer: { name: c.name, email: c.email, phone: c.phone, address: c.address, payment: c.payment || "Cash on Delivery" },
      items: lines,
      total,
    };
    orders.push(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    send(res, 201, order);
  });
}

http.createServer((req, res) => {
  const url = req.url.split("?")[0];

  if (url === "/api/products" && req.method === "GET") return send(res, 200, PRODUCTS);
  if (url === "/api/orders" && req.method === "GET") return send(res, 200, readOrders());
  if (url === "/api/orders" && req.method === "POST") return createOrder(req, res);

  // Static files from /public
  // Serve only index.html (keeps server.js and orders.json private)
  if (url === "/" || url === "/index.html") {
    return fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      if (err) return send(res, 404, { error: "Not found" });
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }
  send(res, 404, { error: "Not found" });
}).listen(PORT, () => console.log("ShopEasy running at http://localhost:" + PORT));
