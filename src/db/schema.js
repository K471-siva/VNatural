import { seedProducts, seedUsers, seedOrders, seedSubscriptions, seedProcurements } from "./seedData";

const KEYS = {
  PRODUCTS: "vnatural_products",
  USERS: "vnatural_users",
  ORDERS: "vnatural_orders",
  SUBSCRIPTIONS: "vnatural_subscriptions",
  PROCUREMENTS: "vnatural_procurements",
  WAREHOUSE_LOGS: "vnatural_warehouse_logs",
  DELIVERY_JOBS: "vnatural_delivery_jobs",
  REVIEWS: "vnatural_reviews",
  WISHLISTS: "vnatural_wishlists",
  SYSTEM_LOGS: "vnatural_system_logs"
};

export const initDB = () => {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(seedProducts));
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(seedUsers));
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(seedOrders));
  }
  if (!localStorage.getItem(KEYS.SUBSCRIPTIONS)) {
    localStorage.setItem(KEYS.SUBSCRIPTIONS, JSON.stringify(seedSubscriptions));
  }
  if (!localStorage.getItem(KEYS.PROCUREMENTS)) {
    localStorage.setItem(KEYS.PROCUREMENTS, JSON.stringify(seedProcurements));
  }
  if (!localStorage.getItem(KEYS.WAREHOUSE_LOGS)) {
    // Generate initial logs from orders and procurements
    const initialLogs = [
      { id: "log_1", type: "inflow", productId: "p1", quantity: 200, batchNo: "BATCH-R-01", date: "2026-06-15T09:00:00Z" },
      { id: "log_2", type: "inflow", productId: "p2", quantity: 100, batchNo: "BATCH-G-01", date: "2026-06-15T09:30:00Z" },
      { id: "log_3", type: "inflow", productId: "p3", quantity: 150, batchNo: "BATCH-D-01", date: "2026-06-15T10:00:00Z" },
      { id: "log_4", type: "outflow", productId: "p1", quantity: 2, batchNo: "BATCH-R-01", date: "2026-07-01T11:00:00Z" },
      { id: "log_5", type: "outflow", productId: "p2", quantity: 1, batchNo: "BATCH-G-01", date: "2026-07-01T11:00:00Z" }
    ];
    localStorage.setItem(KEYS.WAREHOUSE_LOGS, JSON.stringify(initialLogs));
  }
  if (!localStorage.getItem(KEYS.DELIVERY_JOBS)) {
    // Delivery partner jobs matching the orders
    const initialJobs = [
      {
        id: "job_1",
        orderId: "ORD-9481",
        deliveryPartnerId: "u_delivery_1",
        status: "completed",
        earning: 65,
        otp: "5921",
        assignedAt: "2026-07-01T10:35:00Z",
        completedAt: "2026-07-01T11:20:00Z"
      },
      {
        id: "job_2",
        orderId: "ORD-1092",
        deliveryPartnerId: "u_delivery_1",
        status: "assigned",
        earning: 45,
        otp: "3490",
        assignedAt: "2026-07-05T08:30:00Z",
        completedAt: null
      }
    ];
    localStorage.setItem(KEYS.DELIVERY_JOBS, JSON.stringify(initialJobs));
  }
  if (!localStorage.getItem(KEYS.REVIEWS)) {
    const initialReviews = [
      { id: "r_1", productId: "p1", userName: "Vijay Kumar", rating: 5, comment: "Excellent unpolished Sonamasuri rice. Cooks beautifully!", date: "2026-07-02" },
      { id: "r_2", productId: "p2", userName: "Vijay Kumar", rating: 5, comment: "Smells divine! Real A2 bilona ghee, highly recommend.", date: "2026-07-02" }
    ];
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(initialReviews));
  }
  if (!localStorage.getItem(KEYS.WISHLISTS)) {
    localStorage.setItem(KEYS.WISHLISTS, JSON.stringify({ "u_customer_1": ["p2", "p7"] }));
  }
  if (!localStorage.getItem(KEYS.SYSTEM_LOGS)) {
    const initialSystemLogs = [
      { id: "slog_1", action: "SYSTEM_START", details: "VNatural platform localized DB initialized", date: "2026-07-05T10:00:00Z" }
    ];
    localStorage.setItem(KEYS.SYSTEM_LOGS, JSON.stringify(initialSystemLogs));
  }
};

// Generic read/write helpers
const read = (key) => JSON.parse(localStorage.getItem(key)) || [];
const write = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const getAuthHeaders = () => {
  const token = localStorage.getItem("vnatural_auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

export const safeFetchSync = (url, payload, method = "POST") => {
  fetch(url, {
    method: method,
    headers: getAuthHeaders(),
    body: payload ? JSON.stringify(payload) : null
  })
  .catch((err) => {
    console.warn(`Postgres sync failed for ${url}. Queueing request in offline outbox. Error:`, err.message);
    const queue = JSON.parse(localStorage.getItem("vnatural_offline_queue")) || [];
    queue.push({
      id: "mutation_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
      url,
      method,
      body: payload,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("vnatural_offline_queue", JSON.stringify(queue));
    window.dispatchEvent(new CustomEvent("vnatural_outbox_changed"));
  });
};

// Product Actions
export const getProducts = () => read(KEYS.PRODUCTS);
export const saveProduct = (product) => {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
  } else {
    products.push(product);
  }
  write(KEYS.PRODUCTS, products);
  logSystemAction("PRODUCT_SAVE", `Product ${product.name} (ID: ${product.id}) saved.`);
  
  // PostgreSQL sync
  safeFetchSync("/api/products", product);
};
export const deleteProduct = (id) => {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  write(KEYS.PRODUCTS, filtered);
  logSystemAction("PRODUCT_DELETE", `Product with ID ${id} deleted.`);
  
  // PostgreSQL sync delete
  safeFetchSync(`/api/products/${id}`, null, "DELETE");
};

// User Actions
export const getUsers = () => read(KEYS.USERS);
export const saveUser = (user) => {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }
  write(KEYS.USERS, users);

  // PostgreSQL sync
  safeFetchSync("/api/users", user);
};
export const authenticateUser = (email, password) => {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password) || null;
};

// Order Actions
export const getOrders = () => read(KEYS.ORDERS);
export const createOrder = (order) => {
  const orders = getOrders();
  orders.push(order);
  write(KEYS.ORDERS, orders);

  // Update product stock immediately
  const products = getProducts();
  order.items.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
      saveProduct(product); // will trigger product sync
      logWarehouseMovement("outflow", item.productId, item.quantity, "BATCH-R-AUTO");
    }
  });
  write(KEYS.PRODUCTS, products);

  // If active delivery driver exists, auto-assign or make it available
  const drivers = getUsers().filter((u) => u.role === "delivery");
  if (drivers.length > 0) {
    createDeliveryJob(order.id, drivers[0].id, order.total);
  }

  logSystemAction("ORDER_CREATED", `Order ${order.id} placed for ₹${order.total}`);

  // PostgreSQL sync
  safeFetchSync("/api/orders", order);

  return order;
};

export const updateOrderStatus = (orderId, status) => {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index !== -1) {
    orders[index].status = status;
    if (status === "delivered") {
      orders[index].paymentStatus = "Paid";
    }
    write(KEYS.ORDERS, orders);

    // Sync delivery job if status changes
    const jobs = getDeliveryJobs();
    const jobIndex = jobs.findIndex((j) => j.orderId === orderId);
    if (jobIndex !== -1) {
      if (status === "packed") jobs[jobIndex].status = "assigned";
      if (status === "out_for_delivery") jobs[jobIndex].status = "picked_up";
      if (status === "delivered") {
        jobs[jobIndex].status = "completed";
        jobs[jobIndex].completedAt = new Date().toISOString();
      }
      write(KEYS.DELIVERY_JOBS, jobs);

      // Sync delivery job status
      safeFetchSync("/api/delivery-jobs", jobs[jobIndex]);
    }

    logSystemAction("ORDER_STATUS_UPDATE", `Order ${orderId} status changed to ${status}`);

    // PostgreSQL sync
    safeFetchSync("/api/orders", orders[index]);
  }
};

// Subscription Actions
export const getSubscriptions = () => read(KEYS.SUBSCRIPTIONS);
export const createSubscription = (sub) => {
  const subs = getSubscriptions();
  subs.push(sub);
  write(KEYS.SUBSCRIPTIONS, subs);
  logSystemAction("SUBSCRIPTION_CREATED", `Subscription ${sub.id} created for ${sub.productName}`);

  // PostgreSQL sync
  safeFetchSync("/api/subscriptions", sub);
};
export const updateSubscriptionStatus = (subId, status) => {
  const subs = getSubscriptions();
  const index = subs.findIndex((s) => s.id === subId);
  if (index !== -1) {
    subs[index].status = status;
    write(KEYS.SUBSCRIPTIONS, subs);
    logSystemAction("SUBSCRIPTION_STATUS", `Subscription ${subId} marked ${status}`);

    // PostgreSQL sync
    safeFetchSync("/api/subscriptions", subs[index]);
  }
};

// Procurement (Farmer Submissions) Actions
export const getProcurements = () => read(KEYS.PROCUREMENTS);
export const createProcurement = (proc) => {
  const procs = getProcurements();
  procs.push(proc);
  write(KEYS.PROCUREMENTS, procs);
  logSystemAction("PROCUREMENT_SUBMITTED", `Farmer ${proc.farmerName} submitted availability for ${proc.productName}`);

  // PostgreSQL sync
  safeFetchSync("/api/procurements", proc);
};
export const updateProcurementStatus = (procId, status) => {
  const procs = getProcurements();
  const index = procs.findIndex((p) => p.id === procId);
  if (index !== -1) {
    procs[index].status = status;
    write(KEYS.PROCUREMENTS, procs);

    // If approved, create/update product in database
    if (status === "approved") {
      const proc = procs[index];
      const products = getProducts();
      const existingProduct = products.find(
        (p) => p.name.toLowerCase() === proc.productName.toLowerCase() || p.teluguName === proc.teluguName
      );

      if (existingProduct) {
        existingProduct.stock += Number(proc.quantity);
        existingProduct.harvestDate = proc.date;
        saveProduct(existingProduct); // will trigger product sync
      } else {
        // Create new product
        const newProduct = {
          id: `p_${Date.now()}`,
          name: proc.productName,
          teluguName: proc.teluguName || proc.productName,
          category: proc.category || "rice",
          price: Math.round(proc.pricePerKg * 1.3), // 30% margin markup
          compareAtPrice: Math.round(proc.pricePerKg * 1.5),
          unit: proc.unit || "1 kg",
          stock: Number(proc.quantity),
          rating: 5.0,
          reviewsCount: 0,
          image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop", // placeholder organic
          isSubscriptionEligible: true,
          certifications: ["Jaivik Bharat"],
          origin: proc.farmerName + "'s Farm",
          farmerName: proc.farmerName,
          farmerId: proc.farmerId,
          harvestDate: proc.date,
          shelfLifeDays: 90,
          diabeticSafe: false,
          highProtein: false,
          nutrition: proc.nutrition || { protein: "0g", carbs: "0g", fats: "0g", calories: "0 kcal" },
          description: proc.description || "Farm-fresh organic product procured directly from our partner farmer.",
          teluguDescription: proc.teluguDescription || "మా భాగస్వామ్య రైతు నుండి నేరుగా సేకరించిన తాజా సేంద్రీయ ఉత్పత్తి."
        };
        saveProduct(newProduct); // will trigger product sync
      }

      // Log inflow in warehouse
      logWarehouseMovement("inflow", existingProduct ? existingProduct.id : `p_${Date.now()}`, proc.quantity, `BATCH-F-${procId.substring(5)}`);
    }

    logSystemAction("PROCUREMENT_STATUS", `Procurement ${procId} marked ${status}`);

    // PostgreSQL sync
    safeFetchSync("/api/procurements", procs[index]);
  }
};

// Warehouse Log Actions
export const getWarehouseLogs = () => read(KEYS.WAREHOUSE_LOGS);
export const logWarehouseMovement = (type, productId, quantity, batchNo) => {
  const logs = getWarehouseLogs();
  logs.push({
    id: `log_${Date.now()}`,
    type, // "inflow" or "outflow"
    productId,
    quantity,
    batchNo,
    date: new Date().toISOString()
  });
  write(KEYS.WAREHOUSE_LOGS, logs);
};

// Delivery Jobs Actions
export const getDeliveryJobs = () => read(KEYS.DELIVERY_JOBS);
export const createDeliveryJob = (orderId, driverId, orderTotal) => {
  const jobs = getDeliveryJobs();
  const job = {
    id: `job_${Date.now()}`,
    orderId,
    deliveryPartnerId: driverId,
    status: "assigned",
    earning: Math.round(orderTotal * 0.08 + 30), // 8% of total + ₹30 flat fee
    otp: Math.floor(1000 + Math.random() * 9000).toString(),
    assignedAt: new Date().toISOString(),
    completedAt: null
  };
  jobs.push(job);
  write(KEYS.DELIVERY_JOBS, jobs);

  // PostgreSQL sync
  safeFetchSync("/api/delivery-jobs", job);
};
export const updateDeliveryJobStatus = (jobId, status) => {
  const jobs = getDeliveryJobs();
  const index = jobs.findIndex((j) => j.id === jobId);
  if (index !== -1) {
    jobs[index].status = status;
    const orderId = jobs[index].orderId;

    if (status === "completed") {
      jobs[index].completedAt = new Date().toISOString();
      // Also update order status
      updateOrderStatus(orderId, "delivered");
    } else if (status === "picked_up") {
      updateOrderStatus(orderId, "out_for_delivery");
    }

    write(KEYS.DELIVERY_JOBS, jobs);
    logSystemAction("DELIVERY_JOB_STATUS", `Delivery job ${jobId} status changed to ${status}`);

    // PostgreSQL sync
    safeFetchSync("/api/delivery-jobs", jobs[index]);
  }
};

// Reviews
export const getReviews = () => read(KEYS.REVIEWS);
export const addReview = (review) => {
  const reviews = getReviews();
  const newReview = {
    id: `r_${Date.now()}`,
    ...review,
    date: new Date().toISOString().split("T")[0]
  };
  reviews.push(newReview);
  write(KEYS.REVIEWS, reviews);

  // Update product average rating
  const products = getProducts();
  const product = products.find((p) => p.id === review.productId);
  if (product) {
    const productReviews = reviews.filter((r) => r.productId === review.productId);
    const sum = productReviews.reduce((acc, curr) => acc + curr.rating, 0);
    product.rating = Number((sum / productReviews.length).toFixed(1));
    product.reviewsCount = productReviews.length;
    saveProduct(product); // will trigger product sync
  }

  // PostgreSQL sync
  safeFetchSync("/api/reviews", newReview);
};

// Wishlists
export const getWishlist = (userId) => {
  const lists = JSON.parse(localStorage.getItem(KEYS.WISHLISTS)) || {};
  return lists[userId] || [];
};
export const toggleWishlist = (userId, productId) => {
  const lists = JSON.parse(localStorage.getItem(KEYS.WISHLISTS)) || {};
  if (!lists[userId]) lists[userId] = [];
  const index = lists[userId].indexOf(productId);
  if (index !== -1) {
    lists[userId].splice(index, 1);
  } else {
    lists[userId].push(productId);
  }
  localStorage.setItem(KEYS.WISHLISTS, JSON.stringify(lists));
};

// System Auditing
export const getSystemLogs = () => read(KEYS.SYSTEM_LOGS);
export const logSystemAction = (action, details) => {
  const logs = getSystemLogs();
  logs.push({
    id: `slog_${Date.now()}`,
    action,
    details,
    date: new Date().toISOString()
  });
  // Keep last 100 logs
  if (logs.length > 100) logs.shift();
  write(KEYS.SYSTEM_LOGS, logs);
};
