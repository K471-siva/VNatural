import express from "express";
import cors from "cors";
import pg from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import http from "http";
import { Server } from "socket.io";

const { Pool } = pg;
const JWT_SECRET = "vnatural_super_secure_secret_token_key_9391711298";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Create HTTP server wrapping Express app
const server = http.createServer(app);

// Initialize Socket.io Server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Real-time connections handling
io.on("connection", (socket) => {
  console.log(`Socket client connected: ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Helper to broadcast database updates
const broadcastDbUpdate = (action, details = {}) => {
  io.emit("db_updated", { action, details });
};

// Virtual Notification Service Dispatchers (Mock Nodemailer and Twilio)
const sendVirtualEmail = async (to, subject, htmlBody) => {
  console.log(`[Virtual Nodemailer] Sending invoice to: ${to}`);
  console.log(`[Virtual Nodemailer] Subject: ${subject}`);
  
  // Log to database as system audit log
  const logId = "slog_" + Math.random().toString(36).substr(2, 9);
  try {
    await pool.query(`
      INSERT INTO vnatural_system_logs (id, action, details, date)
      VALUES ($1, $2, $3, $4)
    `, [
      logId, 
      "NOTIF_EMAIL_DISPATCH", 
      `Virtual Invoice Email dispatched to ${to} (Subject: ${subject}). Preview:\n${htmlBody.substring(0, 300).replace(/<[^>]*>/g, '')}...`, 
      new Date().toISOString()
    ]);
  } catch (err) {
    console.error("Failed to write system log for email dispatch:", err.message);
  }

  // Broadcast via Socket.io
  broadcastDbUpdate("NOTIFICATION_SENT", { type: "email", to, subject });
};

const sendVirtualSMS = async (to, body) => {
  console.log(`[Virtual Twilio] Dispatching SMS carrier payload to: ${to}`);
  console.log(`[Virtual Twilio] Message: ${body}`);

  // Log to database as system audit log
  const logId = "slog_" + Math.random().toString(36).substr(2, 9);
  try {
    await pool.query(`
      INSERT INTO vnatural_system_logs (id, action, details, date)
      VALUES ($1, $2, $3, $4)
    `, [
      logId, 
      "NOTIF_SMS_DISPATCH", 
      `Virtual Twilio SMS dispatched to ${to}: ${body}`, 
      new Date().toISOString()
    ]);
  } catch (err) {
    console.error("Failed to write system log for SMS dispatch:", err.message);
  }

  // Broadcast via Socket.io
  broadcastDbUpdate("NOTIFICATION_SENT", { type: "sms", to, body });
};

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: "postgres",
  password: "9391711298",
  port: 5432
};

// Middleware to verify JWT tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) return res.status(401).json({ error: "Access token is missing" });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token is invalid or expired" });
    req.user = user;
    next();
  });
}

let pool = null;

// Initialize PostgreSQL database and tables
async function initPostgres() {
  if (process.env.DATABASE_URL) {
    console.log("Connecting directly to managed PostgreSQL using DATABASE_URL...");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
  } else {
    console.log("Connecting to PostgreSQL to check database status...");
    
    // Connect to default 'postgres' database first to check/create 'VNatural'
    const tempPool = new Pool({ ...dbConfig, database: "postgres" });
    try {
      const res = await tempPool.query("SELECT 1 FROM pg_database WHERE datname = 'VNatural'");
      if (res.rowCount === 0) {
        console.log("Database 'VNatural' not found. Creating database...");
        await tempPool.query('CREATE DATABASE "VNatural"');
        console.log("Database 'VNatural' created successfully!");
      } else {
        console.log("Database 'VNatural' already exists.");
      }
    } catch (err) {
      console.error("Error checking/creating database:", err.message);
    } finally {
      await tempPool.end();
    }

    // Connect to the actual 'VNatural' database
    pool = new Pool({ ...dbConfig, database: "VNatural" });
  }

  // Create tables if they do not exist
  try {
    console.log("Initializing database tables...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vnatural_users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        avatar TEXT,
        farm_name VARCHAR(100),
        farm_location TEXT,
        location TEXT,
        certifications JSONB,
        addresses JSONB,
        loyalty_points INT DEFAULT 0,
        diet_preferences JSONB,
        wallet_balance NUMERIC(10,2) DEFAULT 0.00,
        shift VARCHAR(50),
        facility VARCHAR(100),
        vehicle_no VARCHAR(50),
        zone VARCHAR(100),
        withdrawn_amount NUMERIC(10,2) DEFAULT 0.00,
        payouts JSONB
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vnatural_products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        telugu_name VARCHAR(150),
        category VARCHAR(50),
        price NUMERIC(10,2) NOT NULL,
        compare_at_price NUMERIC(10,2),
        unit VARCHAR(20),
        stock INT DEFAULT 0,
        rating NUMERIC(3,2) DEFAULT 5.00,
        reviews_count INT DEFAULT 0,
        image TEXT,
        is_subscription_eligible BOOLEAN DEFAULT TRUE,
        certifications JSONB,
        origin VARCHAR(150),
        farmer_name VARCHAR(100),
        farmer_id VARCHAR(50),
        harvest_date VARCHAR(20),
        shelf_life_days INT,
        diabetic_safe BOOLEAN DEFAULT FALSE,
        high_protein BOOLEAN DEFAULT FALSE,
        nutrition JSONB,
        description TEXT,
        telugu_description TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vnatural_orders (
        id VARCHAR(50) PRIMARY KEY,
        customer_id VARCHAR(50),
        customer_name VARCHAR(100),
        customer_phone VARCHAR(20),
        items JSONB NOT NULL,
        total NUMERIC(10,2) NOT NULL,
        payment_method VARCHAR(50),
        payment_status VARCHAR(20),
        status VARCHAR(20),
        date VARCHAR(50),
        address TEXT,
        delivery_slot VARCHAR(50),
        assigned_delivery_partner_id VARCHAR(50),
        otp VARCHAR(10)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vnatural_subscriptions (
        id VARCHAR(50) PRIMARY KEY,
        customer_id VARCHAR(50),
        product_id VARCHAR(50),
        product_name VARCHAR(150),
        quantity INT NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        frequency VARCHAR(20),
        next_delivery VARCHAR(20),
        status VARCHAR(20)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vnatural_procurements (
        id VARCHAR(50) PRIMARY KEY,
        farmer_id VARCHAR(50),
        farmer_name VARCHAR(100),
        product_name VARCHAR(150),
        category VARCHAR(50),
        quantity INT NOT NULL,
        price_per_kg NUMERIC(10,2) NOT NULL,
        unit VARCHAR(20),
        nutrition JSONB,
        description TEXT,
        telugu_name VARCHAR(150),
        telugu_description TEXT,
        status VARCHAR(20),
        date VARCHAR(20)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vnatural_warehouse_logs (
        id VARCHAR(50) PRIMARY KEY,
        type VARCHAR(20),
        product_id VARCHAR(50),
        quantity INT NOT NULL,
        batch_no VARCHAR(50),
        date VARCHAR(50)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vnatural_delivery_jobs (
        id VARCHAR(50) PRIMARY KEY,
        order_id VARCHAR(50),
        delivery_partner_id VARCHAR(50),
        status VARCHAR(20),
        earning NUMERIC(10,2) NOT NULL,
        otp VARCHAR(10),
        assigned_at VARCHAR(50),
        completed_at VARCHAR(50)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vnatural_reviews (
        id VARCHAR(50) PRIMARY KEY,
        product_id VARCHAR(50),
        user_name VARCHAR(100),
        rating INT NOT NULL,
        comment TEXT,
        date VARCHAR(20)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vnatural_system_logs (
        id VARCHAR(50) PRIMARY KEY,
        action VARCHAR(50) NOT NULL,
        details TEXT,
        date VARCHAR(50)
      );
    `);

    console.log("PostgreSQL tables checked and verified.");
  } catch (err) {
    console.error("Error creating database tables:", err.message);
  }
}

// REST Endpoints to synchronize database
app.get("/api/db", async (req, res) => {
  try {
    const productsRes = await pool.query("SELECT * FROM vnatural_products");
    const usersRes = await pool.query("SELECT * FROM vnatural_users");
    const ordersRes = await pool.query("SELECT * FROM vnatural_orders");
    const subsRes = await pool.query("SELECT * FROM vnatural_subscriptions");
    const procsRes = await pool.query("SELECT * FROM vnatural_procurements");
    const whLogsRes = await pool.query("SELECT * FROM vnatural_warehouse_logs");
    const jobsRes = await pool.query("SELECT * FROM vnatural_delivery_jobs");
    const reviewsRes = await pool.query("SELECT * FROM vnatural_reviews");
    const sysLogsRes = await pool.query("SELECT * FROM vnatural_system_logs ORDER BY date DESC LIMIT 100");

    // Format DB objects back to frontend structure camelCase
    const users = usersRes.rows.map(u => ({
      id: u.id,
      email: u.email,
      password: "",
      role: u.role,
      name: u.name,
      phone: u.phone,
      avatar: u.avatar,
      farmName: u.farm_name,
      farmLocation: u.farm_location,
      location: u.location,
      certifications: u.certifications,
      addresses: u.addresses,
      loyaltyPoints: u.loyalty_points,
      dietPreferences: u.diet_preferences,
      walletBalance: Number(u.wallet_balance),
      shift: u.shift,
      facility: u.facility,
      vehicleNo: u.vehicle_no,
      zone: u.zone,
      withdrawnAmount: Number(u.withdrawn_amount),
      payouts: u.payouts
    }));

    const products = productsRes.rows.map(p => ({
      id: p.id,
      name: p.name,
      teluguName: p.telugu_name,
      category: p.category,
      price: Number(p.price),
      compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : null,
      unit: p.unit,
      stock: p.stock,
      rating: Number(p.rating),
      reviewsCount: p.reviews_count,
      image: p.image,
      isSubscriptionEligible: p.is_subscription_eligible,
      certifications: p.certifications,
      origin: p.origin,
      farmerName: p.farmer_name,
      farmerId: p.farmer_id,
      harvestDate: p.harvest_date,
      shelfLifeDays: p.shelf_life_days,
      diabeticSafe: p.diabetic_safe,
      highProtein: p.high_protein,
      nutrition: p.nutrition,
      description: p.description,
      teluguDescription: p.telugu_description
    }));

    const orders = ordersRes.rows.map(o => ({
      id: o.id,
      customerId: o.customer_id,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      items: o.items,
      total: Number(o.total),
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      status: o.status,
      date: o.date,
      address: o.address,
      deliverySlot: o.delivery_slot,
      assignedDeliveryPartnerId: o.assigned_delivery_partner_id,
      otp: o.otp
    }));

    const subscriptions = subsRes.rows.map(s => ({
      id: s.id,
      customerId: s.customer_id,
      productId: s.product_id,
      productName: s.product_name,
      quantity: s.quantity,
      price: Number(s.price),
      frequency: s.frequency,
      nextDelivery: s.next_delivery,
      status: s.status
    }));

    const procurements = procsRes.rows.map(pr => ({
      id: pr.id,
      farmerId: pr.farmer_id,
      farmerName: pr.farmer_name,
      productName: pr.product_name,
      category: pr.category,
      quantity: pr.quantity,
      pricePerKg: Number(pr.price_per_kg),
      unit: pr.unit,
      nutrition: pr.nutrition,
      description: pr.description,
      teluguName: pr.telugu_name,
      teluguDescription: pr.telugu_description,
      status: pr.status,
      date: pr.date
    }));

    const warehouseLogs = whLogsRes.rows.map(w => ({
      id: w.id,
      type: w.type,
      productId: w.product_id,
      quantity: w.quantity,
      batchNo: w.batch_no,
      date: w.date
    }));

    const deliveryJobs = jobsRes.rows.map(j => ({
      id: j.id,
      orderId: j.order_id,
      deliveryPartnerId: j.delivery_partner_id,
      status: j.status,
      earning: Number(j.earning),
      otp: j.otp,
      assignedAt: j.assigned_at,
      completedAt: j.completed_at
    }));

    const reviews = reviewsRes.rows.map(r => ({
      id: r.id,
      productId: r.product_id,
      userName: r.user_name,
      rating: r.rating,
      comment: r.comment,
      date: r.date
    }));

    const systemLogs = sysLogsRes.rows.map(sl => ({
      id: sl.id,
      action: sl.action,
      details: sl.details,
      date: sl.date
    }));

    res.json({
      products,
      users,
      orders,
      subscriptions,
      procurements,
      warehouseLogs,
      deliveryJobs,
      reviews,
      systemLogs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Import seed lists if empty
app.post("/api/sync-all", async (req, res) => {
  const { products, users, orders, subscriptions, procurements, warehouseLogs, deliveryJobs, reviews, systemLogs } = req.body;
  try {
    const usersCount = await pool.query("SELECT COUNT(*) FROM vnatural_users");
    if (Number(usersCount.rows[0].count) === 0) {
      console.log("PostgreSQL database is empty. Uploading seed data...");

      // Sync Users
      for (const u of users) {
        const hashedPassword = (u.password && (u.password.startsWith("$2a$") || u.password.startsWith("$2b$")))
          ? u.password 
          : bcrypt.hashSync(u.password || "password123", 10);

        await pool.query(`
          INSERT INTO vnatural_users (id, email, password, role, name, phone, avatar, farm_name, farm_location, location, certifications, addresses, loyalty_points, diet_preferences, wallet_balance, shift, facility, vehicle_no, zone, withdrawn_amount, payouts)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
          ON CONFLICT (id) DO NOTHING
        `, [
          u.id, u.email, hashedPassword, u.role, u.name, u.phone || null, u.avatar || null, u.farmName || null, u.farmLocation || null, u.location || null,
          JSON.stringify(u.certifications || []), JSON.stringify(u.addresses || []), u.loyaltyPoints || 0, JSON.stringify(u.dietPreferences || {}),
          u.walletBalance || 0, u.shift || null, u.facility || null, u.vehicleNo || null, u.zone || null, u.withdrawnAmount || 0, JSON.stringify(u.payouts || [])
        ]);
      }

      // Sync Products
      for (const p of products) {
        await pool.query(`
          INSERT INTO vnatural_products (id, name, telugu_name, category, price, compare_at_price, unit, stock, rating, reviews_count, image, is_subscription_eligible, certifications, origin, farmer_name, farmer_id, harvest_date, shelf_life_days, diabetic_safe, high_protein, nutrition, description, telugu_description)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
          ON CONFLICT (id) DO NOTHING
        `, [
          p.id, p.name, p.teluguName || null, p.category || null, p.price, p.compareAtPrice || null, p.unit || null, p.stock || 0, p.rating || 5, p.reviewsCount || 0,
          p.image || null, p.isSubscriptionEligible !== false, JSON.stringify(p.certifications || []), p.origin || null, p.farmerName || null, p.farmerId || null,
          p.harvestDate || null, p.shelfLifeDays || 365, p.diabeticSafe || false, p.highProtein || false, JSON.stringify(p.nutrition || {}), p.description || null, p.teluguDescription || null
        ]);
      }

      // Sync Orders
      for (const o of orders) {
        await pool.query(`
          INSERT INTO vnatural_orders (id, customer_id, customer_name, customer_phone, items, total, payment_method, payment_status, status, date, address, delivery_slot, assigned_delivery_partner_id, otp)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO NOTHING
        `, [
          o.id, o.customerId, o.customerName, o.customerPhone, JSON.stringify(o.items), o.total, o.paymentMethod, o.paymentStatus, o.status, o.date, o.address, o.deliverySlot, o.assignedDeliveryPartnerId || null, o.otp
        ]);
      }

      // Sync Subscriptions
      for (const s of subscriptions) {
        await pool.query(`
          INSERT INTO vnatural_subscriptions (id, customer_id, product_id, product_name, quantity, price, frequency, next_delivery, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO NOTHING
        `, [
          s.id, s.customerId, s.productId, s.productName, s.quantity, s.price, s.frequency, s.nextDelivery, s.status
        ]);
      }

      // Sync Procurements
      for (const pr of procurements) {
        await pool.query(`
          INSERT INTO vnatural_procurements (id, farmer_id, farmer_name, product_name, category, quantity, price_per_kg, unit, nutrition, description, telugu_name, telugu_description, status, date)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO NOTHING
        `, [
          pr.id, pr.farmerId, pr.farmerName, pr.productName, pr.category, pr.quantity, pr.pricePerKg, pr.unit, JSON.stringify(pr.nutrition || {}), pr.description, pr.teluguName, pr.teluguDescription, pr.status, pr.date
        ]);
      }

      // Sync WH logs
      for (const w of warehouseLogs) {
        await pool.query(`
          INSERT INTO vnatural_warehouse_logs (id, type, product_id, quantity, batch_no, date)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING
        `, [
          w.id, w.type, w.productId, w.quantity, w.batchNo, w.date
        ]);
      }

      // Sync jobs
      for (const j of deliveryJobs) {
        await pool.query(`
          INSERT INTO vnatural_delivery_jobs (id, order_id, delivery_partner_id, status, earning, otp, assigned_at, completed_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `, [
          j.id, j.orderId, j.deliveryPartnerId, j.status, j.earning, j.otp, j.assignedAt, j.completedAt || null
        ]);
      }

      // Sync reviews
      for (const r of reviews) {
        await pool.query(`
          INSERT INTO vnatural_reviews (id, product_id, user_name, rating, comment, date)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO NOTHING
        `, [
          r.id, r.productId, r.userName, r.rating, r.comment, r.date
        ]);
      }

      // Sync System logs
      for (const sl of systemLogs) {
        await pool.query(`
          INSERT INTO vnatural_system_logs (id, action, details, date)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (id) DO NOTHING
        `, [
          sl.id, sl.action, sl.details, sl.date
        ]);
      }

      console.log("All seed lists successfully migrated to PostgreSQL.");
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Sync error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Sync user registration or edit
app.post("/api/users", async (req, res) => {
  const u = req.body;
  try {
    const hashedPassword = (u.password && (u.password.startsWith("$2a$") || u.password.startsWith("$2b$")))
      ? u.password 
      : bcrypt.hashSync(u.password || "password123", 10);

    await pool.query(`
      INSERT INTO vnatural_users (id, email, password, role, name, phone, avatar, farm_name, farm_location, location, certifications, addresses, loyalty_points, diet_preferences, wallet_balance, shift, facility, vehicle_no, zone, withdrawn_amount, payouts)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (id) DO UPDATE SET 
        email = EXCLUDED.email,
        password = EXCLUDED.password,
        role = EXCLUDED.role,
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        avatar = EXCLUDED.avatar,
        farm_name = EXCLUDED.farm_name,
        farm_location = EXCLUDED.farm_location,
        location = EXCLUDED.location,
        certifications = EXCLUDED.certifications,
        addresses = EXCLUDED.addresses,
        loyalty_points = EXCLUDED.loyalty_points,
        diet_preferences = EXCLUDED.diet_preferences,
        wallet_balance = EXCLUDED.wallet_balance,
        shift = EXCLUDED.shift,
        facility = EXCLUDED.facility,
        vehicle_no = EXCLUDED.vehicle_no,
        zone = EXCLUDED.zone,
        withdrawn_amount = EXCLUDED.withdrawn_amount,
        payouts = EXCLUDED.payouts
    `, [
      u.id, u.email, hashedPassword, u.role, u.name, u.phone || null, u.avatar || null, u.farmName || null, u.farmLocation || null, u.location || null,
      JSON.stringify(u.certifications || []), JSON.stringify(u.addresses || []), u.loyaltyPoints || 0, JSON.stringify(u.dietPreferences || {}),
      u.walletBalance || 0, u.shift || null, u.facility || null, u.vehicleNo || null, u.zone || null, u.withdrawnAmount || 0, JSON.stringify(u.payouts || [])
    ]);
    broadcastDbUpdate("USER_UPDATED", u);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync products
app.post("/api/products", async (req, res) => {
  const p = req.body;
  try {
    await pool.query(`
      INSERT INTO vnatural_products (id, name, telugu_name, category, price, compare_at_price, unit, stock, rating, reviews_count, image, is_subscription_eligible, certifications, origin, farmer_name, farmer_id, harvest_date, shelf_life_days, diabetic_safe, high_protein, nutrition, description, telugu_description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      ON CONFLICT (id) DO UPDATE SET 
        name = EXCLUDED.name,
        telugu_name = EXCLUDED.telugu_name,
        category = EXCLUDED.category,
        price = EXCLUDED.price,
        compare_at_price = EXCLUDED.compare_at_price,
        unit = EXCLUDED.unit,
        stock = EXCLUDED.stock,
        rating = EXCLUDED.rating,
        reviews_count = EXCLUDED.reviews_count,
        image = EXCLUDED.image,
        is_subscription_eligible = EXCLUDED.is_subscription_eligible,
        certifications = EXCLUDED.certifications,
        origin = EXCLUDED.origin,
        farmer_name = EXCLUDED.farmer_name,
        farmer_id = EXCLUDED.farmer_id,
        harvest_date = EXCLUDED.harvest_date,
        shelf_life_days = EXCLUDED.shelf_life_days,
        diabetic_safe = EXCLUDED.diabetic_safe,
        high_protein = EXCLUDED.high_protein,
        nutrition = EXCLUDED.nutrition,
        description = EXCLUDED.description,
        telugu_description = EXCLUDED.telugu_description
    `, [
      p.id, p.name, p.teluguName || null, p.category || null, p.price, p.compareAtPrice || null, p.unit || null, p.stock || 0, p.rating || 5, p.reviewsCount || 0,
      p.image || null, p.isSubscriptionEligible !== false, JSON.stringify(p.certifications || []), p.origin || null, p.farmerName || null, p.farmerId || null,
      p.harvestDate || null, p.shelfLifeDays || 365, p.diabeticSafe || false, p.highProtein || false, JSON.stringify(p.nutrition || {}), p.description || null, p.teluguDescription || null
    ]);
    broadcastDbUpdate("PRODUCT_UPDATED", p);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync orders
app.post("/api/orders", async (req, res) => {
  const o = req.body;
  try {
    // Check previous status for notification routing
    const prevOrderRes = await pool.query("SELECT status FROM vnatural_orders WHERE id = $1", [o.id]);
    const isNew = prevOrderRes.rowCount === 0;
    const prevStatus = isNew ? null : prevOrderRes.rows[0].status;

    await pool.query(`
      INSERT INTO vnatural_orders (id, customer_id, customer_name, customer_phone, items, total, payment_method, payment_status, status, date, address, delivery_slot, assigned_delivery_partner_id, otp)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO UPDATE SET
        payment_status = EXCLUDED.payment_status,
        status = EXCLUDED.status,
        assigned_delivery_partner_id = EXCLUDED.assigned_delivery_partner_id
    `, [
      o.id, o.customerId, o.customerName, o.customerPhone, JSON.stringify(o.items), o.total, o.paymentMethod, o.paymentStatus, o.status, o.date, o.address, o.deliverySlot, o.assignedDeliveryPartnerId || null, o.otp
    ]);
    broadcastDbUpdate("ORDER_UPDATED", o);

    // Send Real-Time Notifications (Mock Nodemailer and Twilio Carrier logs)
    if (isNew) {
      // 1. Send SMS OTP via simulated Twilio
      sendVirtualSMS(o.customerPhone, `Your VNatural order verification OTP code is ${o.otp}. Share this with the delivery executive on dropoff.`);
      
      // 2. Send email invoice breakdown via Nodemailer
      const itemsList = (o.items || []).map(item => `• ${item.name} x ${item.quantity} - ₹${item.price * item.quantity}`).join("\n");
      const invoiceHtml = `
        <h3>VNatural Invoice for Order #${o.id}</h3>
        <p>Thank you for buying organic with VNatural!</p>
        <p><strong>Customer Name:</strong> ${o.customerName}</p>
        <p><strong>Phone:</strong> ${o.customerPhone}</p>
        <p><strong>Delivery Address:</strong> ${o.address}</p>
        <p><strong>Items purchased:</strong></p>
        <pre>${itemsList}</pre>
        <p><strong>Total Amount:</strong> ₹${o.total}</p>
        <p><strong>Payment Method:</strong> ${o.paymentMethod} (${o.paymentStatus})</p>
        <p>We are packing your fresh harvest at the warehouse now.</p>
      `;
      sendVirtualEmail(o.customerId || "customer@gmail.com", `Your VNatural Invoice for Order #${o.id}`, invoiceHtml);
    } else if (prevStatus !== o.status) {
      // Status transition alerts
      if (o.status === "out_for_delivery") {
        sendVirtualSMS(o.customerPhone, `Your VNatural order #${o.id} is out for delivery! The delivery executive will arrive in your slot ${o.deliverySlot || "shortly"}. Keep OTP code ${o.otp} ready.`);
      } else if (o.status === "delivered") {
        sendVirtualSMS(o.customerPhone, `Your VNatural order #${o.id} has been successfully delivered. Thank you for choosing organic!`);
      }
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync subscriptions
app.post("/api/subscriptions", async (req, res) => {
  const s = req.body;
  try {
    await pool.query(`
      INSERT INTO vnatural_subscriptions (id, customer_id, product_id, product_name, quantity, price, frequency, next_delivery, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        quantity = EXCLUDED.quantity,
        price = EXCLUDED.price,
        frequency = EXCLUDED.frequency,
        next_delivery = EXCLUDED.next_delivery,
        status = EXCLUDED.status
    `, [
      s.id, s.customerId, s.productId, s.productName, s.quantity, s.price, s.frequency, s.nextDelivery, s.status
    ]);
    broadcastDbUpdate("SUBSCRIPTION_UPDATED", s);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync procurements
app.post("/api/procurements", async (req, res) => {
  const pr = req.body;
  try {
    await pool.query(`
      INSERT INTO vnatural_procurements (id, farmer_id, farmer_name, product_name, category, quantity, price_per_kg, unit, nutrition, description, telugu_name, telugu_description, status, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status
    `, [
      pr.id, pr.farmerId, pr.farmerName, pr.productName, pr.category, pr.quantity, pr.pricePerKg, pr.unit, JSON.stringify(pr.nutrition || {}), pr.description, pr.teluguName, pr.teluguDescription, pr.status, pr.date
    ]);
    broadcastDbUpdate("PROCUREMENT_UPDATED", pr);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync WH logs
app.post("/api/warehouse-logs", async (req, res) => {
  const w = req.body;
  try {
    await pool.query(`
      INSERT INTO vnatural_warehouse_logs (id, type, product_id, quantity, batch_no, date)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO NOTHING
    `, [
      w.id, w.type, w.productId, w.quantity, w.batchNo, w.date
    ]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync delivery jobs
app.post("/api/delivery-jobs", async (req, res) => {
  const j = req.body;
  try {
    await pool.query(`
      INSERT INTO vnatural_delivery_jobs (id, order_id, delivery_partner_id, status, earning, otp, assigned_at, completed_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET 
        status = EXCLUDED.status,
        completed_at = EXCLUDED.completed_at
    `, [
      j.id, j.orderId, j.deliveryPartnerId, j.status, j.earning, j.otp, j.assignedAt, j.completedAt || null
    ]);
    broadcastDbUpdate("DELIVERY_JOB_UPDATED", j);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync reviews
app.post("/api/reviews", async (req, res) => {
  const r = req.body;
  try {
    await pool.query(`
      INSERT INTO vnatural_reviews (id, product_id, user_name, rating, comment, date)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO NOTHING
    `, [
      r.id, r.productId, r.userName, r.rating, r.comment, r.date
    ]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sync system logs
app.post("/api/system-logs", async (req, res) => {
  const sl = req.body;
  try {
    await pool.query(`
      INSERT INTO vnatural_system_logs (id, action, details, date)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO NOTHING
    `, [
      sl.id, sl.action, sl.details, sl.date
    ]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
// Register secure endpoint
app.post("/api/auth/register", async (req, res) => {
  const { email, password, role, name, phone, addresses } = req.body;
  try {
    const existCheck = await pool.query("SELECT 1 FROM vnatural_users WHERE email = $1", [email]);
    if (existCheck.rowCount > 0) {
      return res.status(400).json({ error: "A user account with this email already exists." });
    }
    
    const id = "usr_" + Math.random().toString(36).substr(2, 9);
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    await pool.query(`
      INSERT INTO vnatural_users (id, email, password, role, name, phone, addresses)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      id, email, hashedPassword, role || "customer", name, phone || null, 
      JSON.stringify(addresses || [])
    ]);

    const token = jwt.sign({ id, role: role || "customer" }, JWT_SECRET, { expiresIn: "7d" });
    
    res.json({
      success: true,
      token,
      user: { id, email, role: role || "customer", name, phone, addresses: addresses || [] }
    });
    broadcastDbUpdate("USER_REGISTERED", { email, role: role || "customer" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login secure endpoint
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await pool.query("SELECT * FROM vnatural_users WHERE email = $1", [email]);
    if (userRes.rowCount === 0) {
      return res.status(401).json({ error: "Invalid email address or credentials." });
    }
    
    const u = userRes.rows[0];
    const isMatch = bcrypt.compareSync(password, u.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password or credentials." });
    }

    const token = jwt.sign({ id: u.id, role: u.role }, JWT_SECRET, { expiresIn: "7d" });
    
    res.json({
      success: true,
      token,
      user: {
        id: u.id,
        email: u.email,
        role: u.role,
        name: u.name,
        phone: u.phone,
        avatar: u.avatar,
        farmName: u.farm_name,
        farmLocation: u.farm_location,
        location: u.location,
        certifications: u.certifications,
        addresses: u.addresses,
        loyaltyPoints: u.loyalty_points,
        dietPreferences: u.diet_preferences,
        walletBalance: Number(u.wallet_balance),
        shift: u.shift,
        facility: u.facility,
        vehicleNo: u.vehicle_no,
        zone: u.zone,
        withdrawnAmount: Number(u.withdrawn_amount),
        payouts: u.payouts
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Token validator endpoint
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query("SELECT * FROM vnatural_users WHERE id = $1", [req.user.id]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({ error: "User profile not found." });
    }
    const u = userRes.rows[0];
    res.json({
      success: true,
      user: {
        id: u.id,
        email: u.email,
        role: u.role,
        name: u.name,
        phone: u.phone,
        avatar: u.avatar,
        farmName: u.farm_name,
        farmLocation: u.farm_location,
        location: u.location,
        certifications: u.certifications,
        addresses: u.addresses,
        loyaltyPoints: u.loyalty_points,
        dietPreferences: u.diet_preferences,
        walletBalance: Number(u.wallet_balance),
        shift: u.shift,
        facility: u.facility,
        vehicleNo: u.vehicle_no,
        zone: u.zone,
        withdrawnAmount: Number(u.withdrawn_amount),
        payouts: u.payouts
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
server.listen(PORT, async () => {
  await initPostgres();
  console.log(`VNatural Node.js backend listening on http://localhost:${PORT}`);
});
