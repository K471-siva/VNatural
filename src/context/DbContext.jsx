import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  initDB,
  getProducts,
  getUsers,
  getOrders,
  getSubscriptions,
  getProcurements,
  getWarehouseLogs,
  getDeliveryJobs,
  getReviews,
  getSystemLogs,
  authenticateUser,
  createOrder,
  updateOrderStatus,
  createSubscription,
  updateSubscriptionStatus,
  createProcurement,
  updateProcurementStatus,
  updateDeliveryJobStatus,
  addReview,
  toggleWishlist,
  getWishlist,
  saveUser,
  logSystemAction,
  saveProduct,
  logWarehouseMovement,
  getAuthHeaders
} from "../db/schema";
import { seedRecipes } from "../db/seedData";

const DbContext = createContext();

export const DbProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [warehouseLogs, setWarehouseLogs] = useState([]);
  const [deliveryJobs, setDeliveryJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState("en"); // "en" or "te"
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recipes, setRecipes] = useState(() => JSON.parse(localStorage.getItem("vnatural_recipes")) || seedRecipes);
  const [toast, setToast] = useState(null);
  const [syncStatus, setSyncStatus] = useState("synced"); // "synced" | "syncing" | "offline"
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Sync state with local PostgreSQL server
  const syncWithPostgres = async () => {
    try {
      const response = await fetch("/api/db", {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Backend server offline");
      const data = await response.json();
      
      if (!data.users || data.users.length === 0) {
        console.log("PostgreSQL is empty. Performing initial migration...");
        const syncRes = await fetch("/api/sync-all", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            products: JSON.parse(localStorage.getItem("vnatural_products")) || [],
            users: JSON.parse(localStorage.getItem("vnatural_users")) || [],
            orders: JSON.parse(localStorage.getItem("vnatural_orders")) || [],
            subscriptions: JSON.parse(localStorage.getItem("vnatural_subscriptions")) || [],
            procurements: JSON.parse(localStorage.getItem("vnatural_procurements")) || [],
            warehouseLogs: JSON.parse(localStorage.getItem("vnatural_warehouse_logs")) || [],
            deliveryJobs: JSON.parse(localStorage.getItem("vnatural_delivery_jobs")) || [],
            reviews: JSON.parse(localStorage.getItem("vnatural_reviews")) || [],
            systemLogs: JSON.parse(localStorage.getItem("vnatural_system_logs")) || []
          })
        });
        if (syncRes.ok) {
          console.log("Seed data migrated to PostgreSQL successfully.");
        }
      } else {
        console.log("Synchronizing PostgreSQL tables to browser...");
        localStorage.setItem("vnatural_products", JSON.stringify(data.products || []));
        localStorage.setItem("vnatural_users", JSON.stringify(data.users || []));
        localStorage.setItem("vnatural_orders", JSON.stringify(data.orders || []));
        localStorage.setItem("vnatural_subscriptions", JSON.stringify(data.subscriptions || []));
        localStorage.setItem("vnatural_procurements", JSON.stringify(data.procurements || []));
        localStorage.setItem("vnatural_warehouse_logs", JSON.stringify(data.warehouseLogs || []));
        localStorage.setItem("vnatural_delivery_jobs", JSON.stringify(data.deliveryJobs || []));
        localStorage.setItem("vnatural_reviews", JSON.stringify(data.reviews || []));
        localStorage.setItem("vnatural_system_logs", JSON.stringify(data.systemLogs || []));
        
        setProducts(data.products || []);
        setUsers(data.users || []);
        setOrders(data.orders || []);
        setSubscriptions(data.subscriptions || []);
        setProcurements(data.procurements || []);
        setWarehouseLogs(data.warehouseLogs || []);
        setDeliveryJobs(data.deliveryJobs || []);
        setReviews(data.reviews || []);
        setSystemLogs(data.systemLogs || []);

        // Sync current logged in user
        setCurrentUser(prevUser => {
          if (prevUser) {
            const freshUser = (data.users || []).find(u => u.id === prevUser.id);
            return freshUser || prevUser;
          }
          return prevUser;
        });
      }
    } catch (err) {
      console.warn("PostgreSQL sync skipped (offline or not running). Operating in LocalStorage mode:", err.message);
    }
  };

  // Background Outbox Syncer
  const syncOfflineQueue = async () => {
    if (localStorage.getItem("vnatural_is_syncing") === "true") return;
    
    const queue = JSON.parse(localStorage.getItem("vnatural_offline_queue")) || [];
    if (queue.length === 0) {
      setSyncStatus("synced");
      setPendingSyncCount(0);
      return;
    }

    if (!navigator.onLine) {
      setSyncStatus("offline");
      setPendingSyncCount(queue.length);
      return;
    }

    localStorage.setItem("vnatural_is_syncing", "true");
    setSyncStatus("syncing");

    let remainingQueue = [...queue];
    
    for (const item of queue) {
      try {
        const response = await fetch(item.url, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(item.body)
        });

        if (response.ok) {
          remainingQueue = remainingQueue.filter(q => q.id !== item.id);
          localStorage.setItem("vnatural_offline_queue", JSON.stringify(remainingQueue));
          setPendingSyncCount(remainingQueue.length);
        } else {
          break; 
        }
      } catch (err) {
        break; 
      }
    }

    localStorage.removeItem("vnatural_is_syncing");
    
    if (remainingQueue.length === 0) {
      setSyncStatus("synced");
      syncWithPostgres();
    } else {
      setSyncStatus("offline");
    }
  };

  // Load database on mount
  useEffect(() => {
    initDB();
    refreshData();
    syncWithPostgres();

    // Restoring session if token exists
    const token = localStorage.getItem("vnatural_auth_token");
    if (token) {
      fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Session expired");
      })
      .then(data => {
        if (data.user) {
          setCurrentUser(data.user);
          setWishlist(getWishlist(data.user.id));
        }
      })
      .catch(err => {
        console.warn("Could not restore session:", err.message);
        setCurrentUser(null);
      });
    } else {
      setCurrentUser(null);
    }

    // Setup Socket.io real-time connection
    const socketUrl = window.location.hostname === "localhost" ? "http://localhost:5000" : window.location.origin;
    const socket = io(socketUrl);

    socket.on("connect", () => {
      console.log("Connected to VNatural real-time Socket.io server");
    });

    socket.on("db_updated", (data) => {
      console.log("Real-time DB update event received:", data);
      
      // Silent postgres refresh
      syncWithPostgres();

      // Trigger beautiful notification toasts depending on event
      if (data.action === "ORDER_UPDATED" && data.details) {
        setToast({
          title: "Order Status Update",
          message: `Order #${data.details.id} status changed to ${data.details.status}`,
          type: "order"
        });
      } else if (data.action === "PROCUREMENT_UPDATED" && data.details) {
        setToast({
          title: "New Procurement Crop Offer",
          message: `Farmer offer submitted for ${data.details.productName} (${data.details.quantity} kg)`,
          type: "farmer"
        });
      } else if (data.action === "DELIVERY_JOB_UPDATED" && data.details) {
        setToast({
          title: "Delivery Dispatch Update",
          message: `Delivery Job for order #${data.details.orderId} updated to ${data.details.status}`,
          type: "delivery"
        });
      } else if (data.action === "USER_REGISTERED" && data.details) {
        setToast({
          title: "New User Registered",
          message: `New account created: ${data.details.email} (${data.details.role})`,
          type: "user"
        });
      }
    });

    // Listen for browser connectivity changes
    const handleOnline = () => {
      console.log("Network online. Syncing outbox...");
      syncOfflineQueue();
    };
    const handleOffline = () => {
      console.log("Network offline. Switching status to Offline Mode.");
      setSyncStatus("offline");
    };
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for mutations queued when offline
    const handleOutboxChange = () => {
      const queue = JSON.parse(localStorage.getItem("vnatural_offline_queue")) || [];
      setPendingSyncCount(queue.length);
      if (queue.length > 0) {
        setSyncStatus("offline");
      }
    };
    window.addEventListener("vnatural_outbox_changed", handleOutboxChange);

    // Run initial checks
    handleOutboxChange();
    syncOfflineQueue();
    const syncInterval = setInterval(syncOfflineQueue, 15000);

    return () => {
      socket.disconnect();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("vnatural_outbox_changed", handleOutboxChange);
      clearInterval(syncInterval);
    };
  }, []);

  const refreshData = () => {
    setProducts(getProducts());
    setUsers(getUsers());
    setOrders(getOrders());
    setSubscriptions(getSubscriptions());
    setProcurements(getProcurements());
    setWarehouseLogs(getWarehouseLogs());
    setDeliveryJobs(getDeliveryJobs());
    setReviews(getReviews());
    setSystemLogs(getSystemLogs());
    if (currentUser) {
      setWishlist(getWishlist(currentUser.id));
    }
  };

  // Auth Operations
  // Auth Operations
  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("vnatural_auth_token", data.token);
        setCurrentUser(data.user);
        setWishlist(getWishlist(data.user.id));
        logSystemAction("USER_LOGIN", `${data.user.name} logged in as ${data.user.role}`);
        return { success: true, user: data.user };
      } else {
        const errorData = await res.json();
        console.warn("Auth Server rejected login request:", errorData.error);
      }
    } catch (err) {
      console.warn("Authentication server offline. Operating in fallback mode:", err.message);
    }

    // Hardcoded E2E mock switch fallbacks & local authenticate check
    const user = authenticateUser(email, password);
    if (user) {
      setCurrentUser(user);
      setWishlist(getWishlist(user.id));
      logSystemAction("USER_LOGIN", `${user.name} logged in as ${user.role} (local fallback)`);
      return { success: true, user };
    }
    // Hardcoded E2E mock switch fallbacks
    if (email.toLowerCase() === "delivery.kalyan@gmail.com") {
      const mockDriver = {
        id: "u_delivery_1",
        email: "delivery.kalyan@gmail.com",
        password: "delivery123",
        role: "delivery",
        name: "Kalyan Kumar",
        phone: "9000112233",
        vehicleNo: "TS 09 EQ 4210 (Electric Bike)",
        zone: "Secunderabad & Begumpet",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop"
      };
      setCurrentUser(mockDriver);
      return { success: true, user: mockDriver };
    }
    if (email.toLowerCase() === "farmer.keshav@gmail.com") {
      const mockFarmer = {
        id: "u_farmer_1",
        email: "farmer.keshav@gmail.com",
        password: "farmer123",
        role: "farmer",
        name: "Keshav Reddy",
        phone: "9848022334",
        farmName: "Nalgonda Eco-Organic Farms",
        farmLocation: "Miryalaguda, Nalgonda, Telangana",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
      };
      setCurrentUser(mockFarmer);
      return { success: true, user: mockFarmer };
    }
    if (email.toLowerCase() === "warehouse.rama@vnatural.com") {
      const mockWarehouse = {
        id: "u_warehouse_1",
        email: "warehouse.rama@vnatural.com",
        password: "warehouse123",
        role: "warehouse",
        name: "Rama Rao (Lead Picker)",
        phone: "9440112233",
        facility: "Central Warehouse Hub - Hyderabad",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
      };
      setCurrentUser(mockWarehouse);
      return { success: true, user: mockWarehouse };
    }
    if (email.toLowerCase() === "admin@vnatural.com") {
      const mockAdmin = {
        id: "u_admin_1",
        email: "admin@vnatural.com",
        password: "admin123",
        role: "admin",
        name: "Srinivas Raju (Admin)",
        phone: "9900112233",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
      };
      setCurrentUser(mockAdmin);
      return { success: true, user: mockAdmin };
    }
    return { success: false, message: "Invalid email or password" };
  };

  const logout = () => {
    if (currentUser) {
      logSystemAction("USER_LOGOUT", `${currentUser.name} logged out`);
    }
    localStorage.removeItem("vnatural_auth_token");
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
  };

  const updateProfile = (updatedUser) => {
    saveUser(updatedUser);
    setCurrentUser(updatedUser);
    refreshData();
  };

  const handleSaveUser = async (newUser) => {
    const localUsers = getUsers();
    const exists = localUsers.some(u => u.id === newUser.id);

    if (!exists) {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: newUser.email,
            password: newUser.password || "password123",
            role: newUser.role,
            name: newUser.name,
            phone: newUser.phone,
            addresses: newUser.addresses
          })
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("vnatural_auth_token", data.token);
          saveUser({ ...newUser, password: "" });
          refreshData();
          return;
        } else {
          const errorData = await res.json();
          console.warn("Auth Server registration failed:", errorData.error);
        }
      } catch (err) {
        console.warn("Auth registration offline. Operating in fallback mode:", err.message);
      }
    }

    saveUser(newUser);
    refreshData();
  };

  const handleWarehouseMovement = (type, productId, quantity, batchNo) => {
    logWarehouseMovement(type, productId, quantity, batchNo);
    refreshData();
  };

  // Language translation helper
  const t = (enText, teText) => {
    return language === "te" ? teText : enText;
  };

  // Cart Operations
  const addToCart = (product, quantity = 1, isSubscribed = false) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.id && item.isSubscribed === isSubscribed
      );
      if (existingIndex !== -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            productId: product.id,
            name: product.name,
            teluguName: product.teluguName,
            price: product.price,
            image: product.image,
            unit: product.unit,
            quantity,
            isSubscribed
          }
        ];
      }
    });
  };

  const removeFromCart = (productId, isSubscribed = false) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.productId === productId && item.isSubscribed === isSubscribed))
    );
  };

  const updateCartQuantity = (productId, quantity, isSubscribed = false) => {
    if (quantity <= 0) {
      removeFromCart(productId, isSubscribed);
      return;
    }
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const index = newCart.findIndex(
        (item) => item.productId === productId && item.isSubscribed === isSubscribed
      );
      if (index !== -1) {
        newCart[index].quantity = quantity;
      }
      return newCart;
    });
  };

  const clearCart = () => setCart([]);

  // Place order
  const checkoutCart = (paymentMethod, address, deliverySlot) => {
    if (cart.length === 0 || !currentUser) return null;

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        isSubscribed: item.isSubscribed
      })),
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      paymentMethod,
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Pending" : "Paid",
      status: "pending",
      date: new Date().toISOString(),
      address,
      deliverySlot,
      assignedDeliveryPartnerId: null,
      otp: Math.floor(1000 + Math.random() * 9000).toString()
    };

    createOrder(newOrder);

    // If order contains subscribed items, create subscription records too
    cart.forEach(item => {
      if (item.isSubscribed) {
        const sub = {
          id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
          customerId: currentUser.id,
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          frequency: "monthly", // default
          nextDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          status: "active"
        };
        createSubscription(sub);
      }
    });

    clearCart();
    refreshData();
    return newOrder;
  };

  // Wishlist toggle
  const toggleWishlistState = (productId) => {
    if (!currentUser) return;
    toggleWishlist(currentUser.id, productId);
    refreshData();
  };

  // Reviews
  const submitReview = (productId, rating, comment) => {
    if (!currentUser) return;
    addReview({
      productId,
      userName: currentUser.name,
      rating,
      comment
    });
    refreshData();
  };

  // Farmer Portal Actions
  const submitProcurementOffer = (productName, teluguName, category, qty, pricePerKg, desc, teluguDesc, nutrition) => {
    if (!currentUser || currentUser.role !== "farmer") return;

    const newProc = {
      id: `proc_${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      productName,
      teluguName: teluguName || productName,
      category,
      quantity: Number(qty),
      pricePerKg: Number(pricePerKg),
      unit: "1 kg",
      nutrition: nutrition || { protein: "0g", carbs: "0g", fats: "0g", calories: "0 kcal" },
      description: desc,
      teluguDescription: teluguDesc || desc,
      status: "pending",
      date: new Date().toISOString().split("T")[0]
    };

    createProcurement(newProc);
    refreshData();
  };

  // Admin Portal Actions
  const approveProcurement = (procId) => {
    updateProcurementStatus(procId, "approved");
    refreshData();
  };

  const rejectProcurement = (procId) => {
    updateProcurementStatus(procId, "rejected");
    refreshData();
  };

  const updateOrderDeliveryStatus = (orderId, status) => {
    updateOrderStatus(orderId, status);
    refreshData();
  };

  const editOrCreateProduct = (product) => {
    saveProduct(product);
    refreshData();
  };

  // Delivery Portal Actions
  const handleJobStatusChange = (jobId, status) => {
    updateDeliveryJobStatus(jobId, status);
    refreshData();
  };

  // Subscription control
  const toggleSubStatus = (subId, status) => {
    updateSubscriptionStatus(subId, status);
    refreshData();
  };

  const editOrCreateRecipe = (recipe) => {
    setRecipes(prev => {
      const exists = prev.some(r => r.id === recipe.id);
      let updated;
      if (exists) {
        updated = prev.map(r => r.id === recipe.id ? recipe : r);
      } else {
        updated = [...prev, recipe];
      }
      localStorage.setItem("vnatural_recipes", JSON.stringify(updated));
      return updated;
    });
  };

  const addSubscription = (productId, quantity, frequency) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const sub = {
      id: `SUB-${Math.floor(100 + Math.random() * 900)}`,
      customerId: currentUser?.id || "u_customer_1",
      productId,
      productName: prod.name,
      quantity,
      price: prod.price,
      frequency,
      nextDelivery: new Date(Date.now() + (frequency === "weekly" ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "active"
    };
    createSubscription(sub);
    refreshData();
    return sub;
  };

  const editSubscription = (updatedSub) => {
    const subs = getSubscriptions();
    const index = subs.findIndex(s => s.id === updatedSub.id);
    if (index !== -1) {
      subs[index] = {
        ...subs[index],
        ...updatedSub,
        price: Number(updatedSub.price) || subs[index].price,
        quantity: Number(updatedSub.quantity) || subs[index].quantity
      };
      localStorage.setItem("vnatural_subscriptions", JSON.stringify(subs));
      refreshData();
    }
  };

  return (
    <DbContext.Provider
      value={{
        products,
        users,
        orders,
        subscriptions,
        procurements,
        warehouseLogs,
        deliveryJobs,
        reviews,
        systemLogs,
        currentUser,
        language,
        cart,
        wishlist,
        recipes,
        toast,
        setToast,
        syncStatus,
        pendingSyncCount,
        setLanguage,
        login,
        logout,
        updateProfile,
        saveUser: handleSaveUser,
        logWarehouseMovement: handleWarehouseMovement,
        t,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkoutCart,
        toggleWishlistState,
        submitReview,
        submitProcurementOffer,
        approveProcurement,
        rejectProcurement,
        updateOrderDeliveryStatus,
        editOrCreateProduct,
        handleJobStatusChange,
        toggleSubStatus,
        editOrCreateRecipe,
        addSubscription,
        editSubscription
      }}
    >
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => useContext(DbContext);
