import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import postRoutes from "./routes/postRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

connectDB();

// --- ROOT ROUTE ---
app.get("/", (req, res) => res.send("Server running successfully 🚀"));

// --- USER ROUTES ---
app.post("/api/users", async (req, res) => {
  try {
    const u = await User.create(req.body);
    res.status(201).json(u);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- PRODUCT ROUTES ---
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, stock, description, category } = req.body;
    const p = await Product.create({ name, price, stock, description, category });
    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Product not found" });
    res.json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- ORDER ROUTES ---
app.post("/api/orders", async (req, res) => {
  try {
    const { user, products } = req.body;
    if (!user || !Array.isArray(products) || products.length === 0)
      return res.status(400).json({ error: "Invalid payload" });

    const productIds = products.map((p) => p.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } });
    const prodMap = {};
    dbProducts.forEach((dp) => {
      prodMap[dp._id.toString()] = dp;
    });

    let totalPrice = 0;
    for (const item of products) {
      const dbp = prodMap[item.product];
      if (!dbp) return res.status(400).json({ error: `Product ${item.product} not found` });
      if (dbp.stock < item.quantity)
        return res.status(400).json({ error: `Insufficient stock for ${dbp.name}` });
      totalPrice += dbp.price * item.quantity;
    }

    for (const item of products) {
      await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
    }

    const order = await Order.create({ user, products, totalPrice, status: "pending" });
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("products.product", "name price");
    res.status(201).json(populatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product", "name price description");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- POST ROUTES ---
app.use("/api/posts", postRoutes);

// --- FILE UPLOAD ROUTES ---
app.use("/api/files", fileRoutes);

// --- STATIC FILES (SERVE UPLOADED IMAGES) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
