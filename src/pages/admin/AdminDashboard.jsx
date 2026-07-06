import React, { useState } from "react";
import { useDb } from "../../context/DbContext";
import { 
  BarChart2, ShoppingCart, Wheat, Sparkles, ShieldAlert, Users, 
  BookOpen, User, Calendar, Plus, Edit, Trash2, Check, X, 
  Search, Sliders, Download, DollarSign, Layers, Tag, Eye,
  Lock, Activity, Settings, RefreshCw, Send, ClipboardList, MapPin, AlertTriangle
} from "lucide-react";

export const AdminDashboard = () => {
  const {
    products, orders, subscriptions, procurements, warehouseLogs, users,
    approveProcurement, rejectProcurement, updateOrderDeliveryStatus,
    editOrCreateProduct, deleteProduct, recipes, editOrCreateRecipe, updateProfile,
    currentUser, editSubscription, logout, t
  } = useDb();

  // Tab State
  const [activeTab, setActiveTab] = useState("overview");
  // Admin Role Permission State
  const [adminRole, setAdminRole] = useState("Super Admin");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Product Form states
  const [prodName, setProdName] = useState("");
  const [prodTelugu, setProdTelugu] = useState("");
  const [prodCategory, setProdCategory] = useState("rice");
  const [prodPrice, setProdPrice] = useState("");
  const [prodComparePrice, setProdComparePrice] = useState("");
  const [prodUnit, setProdUnit] = useState("1 kg");
  const [prodStock, setProdStock] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodTeluguDesc, setProdTeluguDesc] = useState("");
  const [prodDiabetic, setProdDiabetic] = useState(false);
  const [prodProtein, setProdProtein] = useState(false);
  const [prodCertifications, setProdCertifications] = useState(["Jaivik Bharat"]);

  // Recipe Form states
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recTitle, setRecTitle] = useState("");
  const [recTeluguTitle, setRecTeluguTitle] = useState("");
  const [recTime, setRecTime] = useState("30 mins");
  const [recServings, setRecServings] = useState("4");
  const [recIngredients, setRecIngredients] = useState("");
  const [recInstructions, setRecInstructions] = useState("");
  const [recProducts, setRecProducts] = useState([]);

  // Coupon Form States
  const [coupons, setCoupons] = useState([
    { code: "NATURAL10", discount: 10, minOrder: 500, expiry: "2026-12-31", category: "all", usage: 142 },
    { code: "DIABETICSAFE", discount: 15, minOrder: 1000, expiry: "2026-08-15", category: "rice", usage: 48 }
  ]);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState("");
  const [couponMinOrder, setCouponMinOrder] = useState("");

  // CMS Edit States
  const [cmsHeroText, setCmsHeroText] = useState("Directly Sourced Organic Staples");
  const [cmsFaq, setCmsFaq] = useState([
    { q: "Are all products certified organic?", a: "Yes, we verify certification with Jaivik Bharat and PGS-India standards for all procurement." }
  ]);

  // AI Analyst Chat States
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "VNatural BI Analytics bot active. Ask me about stock status, profitable products, or daily operations." }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Financial reconciliation states
  const [financeLogs, setFinanceLogs] = useState([
    { id: "TXN_10928", orderId: "ord_1028", customer: "Vijay Kumar", amount: 1500, method: "UPI", status: "Reconciled" },
    { id: "TXN_88192", orderId: "ord_1029", customer: "Geetha S.", amount: 890, method: "PhonePe", status: "Reconciled" },
    { id: "TXN_77281", orderId: "ord_1030", customer: "Ravi Teja", amount: 1200, method: "COD", status: "Pending Hand-off" }
  ]);

  // Staff checklist states
  const [staffLogs, setStaffLogs] = useState([
    { id: "STF_1", name: "Rama Rao", role: "Warehouse Picker", activeTask: "Packing ord_1032", performance: "98% accuracy" },
    { id: "STF_2", name: "Kalyan Kumar", role: "Delivery Driver", activeTask: "En route Benz Circle", performance: "100% on time" }
  ]);

  // Audit list
  const [auditLogs, setAuditLogs] = useState([
    { timestamp: "2026-07-05 20:10:02", actor: "Srinivas Raju", action: "Updated sonamasuri stock quantity", ip: "192.168.1.42" },
    { timestamp: "2026-07-05 19:42:00", actor: "Srinivas Raju", action: "Created seasonal coupon FESTIVAL15", ip: "192.168.1.42" }
  ]);

  // Admin Profile Edit States
  const [showAdminProfileModal, setShowAdminProfileModal] = useState(false);
  const [editAdminName, setEditAdminName] = useState(currentUser?.name || "Srinivas Raju");
  const [editAdminPhone, setEditAdminPhone] = useState(currentUser?.phone || "9900112233");
  const [editAdminAvatar, setEditAdminAvatar] = useState(currentUser?.avatar || "");

  const handleUpdateAdminProfile = (e) => {
    e.preventDefault();
    updateProfile({
      ...currentUser,
      name: editAdminName,
      phone: editAdminPhone,
      avatar: editAdminAvatar
    });
    setShowAdminProfileModal(false);
    alert("Admin profile updated successfully!");
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyCenter: "center", padding: "40px" }}>
        <div style={{ maxWidth: "450px", width: "100%", backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "30px", textAlign: "center", margin: "auto" }}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: "16px" }} />
          <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "700" }}>Access Denied</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "10px 0 20px" }}>Admin operations permission is required to access this dashboard.</p>
        </div>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const totalSalesVal = orders.filter(o => o.status === "delivered").reduce((sum, o) => sum + o.total, 0);
  const pendingCodToDeposit = orders.filter(o => o.status === "delivered" && o.paymentMethod === "COD").reduce((sum, o) => sum + o.total, 0);
  const pendingOrdersCount = orders.filter(o => o.status === "pending").length;
  const lowStockCount = products.filter(p => p.stock < 50).length;
  const outStockCount = products.filter(p => p.stock === 0).length;
  const activeSubsCount = subscriptions.filter(s => s.status === "active").length;
  const totalUsersCount = users.length;

  // AI chat processor rules
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    const newMessages = [...chatMessages, { sender: "user", text: userMsg }];
    setChatMessages(newMessages);
    setChatInput("");

    setTimeout(() => {
      let reply = "I am processing the VNatural databases. Could you specify your query?";
      const lower = userMsg.toLowerCase();

      if (lower.includes("profit") || lower.includes("best") || lower.includes("selling")) {
        const sorted = [...products].sort((a, b) => b.price - a.price);
        reply = `Our most profitable and high-performing SKUs: 1. ${sorted[0].name} (price: ₹${sorted[0].price}), 2. ${sorted[1].name} (price: ₹${sorted[1].price}). Category wise, Organic Oils and Rice grains yield the highest margins (32%).`;
      } else if (lower.includes("restock") || lower.includes("stock") || lower.includes("low")) {
        const lowStock = products.filter(p => p.stock < 50);
        reply = `Low stock checklist: ${lowStock.length} items require attention: ` + 
          lowStock.map(p => `${p.name} (Qty: ${p.stock} kg)`).join(", ") + 
          `. Restock alerts have been broadcasted to our partner farmers.`;
      } else if (lower.includes("expire") || lower.includes("aging")) {
        reply = `Expiry Risk Analysis: 2 items will exceed shelf-life limits in 15 days. Inspected by Rama Rao: Organic Moong Dal (Batch: BATCH-F-1209). Priority dispatch triggered in WMS packing queues.`;
      } else if (lower.includes("zone") || lower.includes("buy")) {
        reply = `Top geographic demand zones: 1. Madhapur (44% of total sales), 2. Kondapur (28% of total sales), 3. Gachibowli (18% of total sales).`;
      } else if (lower.includes("supplier") || lower.includes("farmer")) {
        reply = `Supplier scorecards: Farmer Keshav Reddy is currently our most reliable supplier (timeliness score: 98%, quality pass rate: 100%). Total procured quantity this month: 650 kg.`;
      } else if (lower.includes("order") || lower.includes("delay")) {
        reply = `Fulfillment status: ${pendingOrdersCount} orders are pending picking. Average delivery courier cycle time is 28 minutes.`;
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: reply }]);
    }, 800);
  };

  // Product CRUD Handlers
  const handleOpenProductModal = (prod = null) => {
    setSelectedProduct(prod);
    if (prod) {
      setProdName(prod.name);
      setProdTelugu(prod.teluguName);
      setProdCategory(prod.category);
      setProdPrice(prod.price);
      setProdComparePrice(prod.compareAtPrice || "");
      setProdUnit(prod.unit);
      setProdStock(prod.stock);
      setProdImage(prod.image);
      setProdDescription(prod.description);
      setProdTeluguDesc(prod.teluguDescription);
      setProdDiabetic(prod.diabeticSafe || false);
      setProdProtein(prod.highProtein || false);
      setProdCertifications(prod.certifications || ["Jaivik Bharat"]);
    } else {
      setProdName("");
      setProdTelugu("");
      setProdCategory("rice");
      setProdPrice("");
      setProdComparePrice("");
      setProdUnit("1 kg");
      setProdStock("");
      setProdImage("");
      setProdDescription("");
      setProdTeluguDesc("");
      setProdDiabetic(false);
      setProdProtein(false);
      setProdCertifications(["Jaivik Bharat"]);
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const payload = {
      id: selectedProduct ? selectedProduct.id : `p_${Date.now()}`,
      name: prodName,
      teluguName: prodTelugu,
      category: prodCategory,
      price: Number(prodPrice),
      compareAtPrice: Number(prodComparePrice) || Number(prodPrice) * 1.2,
      unit: prodUnit,
      stock: Number(prodStock),
      image: prodImage || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop",
      description: prodDescription,
      teluguDescription: prodTeluguDesc,
      diabeticSafe: prodDiabetic,
      highProtein: prodProtein,
      certifications: prodCertifications,
      rating: selectedProduct ? selectedProduct.rating : 5.0,
      reviewsCount: selectedProduct ? selectedProduct.reviewsCount : 0
    };

    editOrCreateProduct(payload);
    setProductModalOpen(false);
    
    // Add audit log
    const newLog = {
      timestamp: new Date().toLocaleString(),
      actor: currentUser.name,
      action: `${selectedProduct ? "Modified" : "Created"} product SKU: ${prodName}`,
      ip: "192.168.1.42"
    };
    setAuditLogs([newLog, ...auditLogs]);
    alert("Catalog SKU updated successfully!");
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to permanently delete this product from the catalog?")) {
      deleteProduct(productId);
      const newLog = {
        timestamp: new Date().toLocaleString(),
        actor: currentUser?.name || "Admin",
        action: `Deleted product SKU ID: ${productId}`,
        ip: "192.168.1.42"
      };
      setAuditLogs([newLog, ...auditLogs]);
      alert("Product SKU deleted successfully!");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Recipe Handlers
  const handleOpenRecipeModal = (rec = null) => {
    setSelectedRecipe(rec);
    if (rec) {
      setRecTitle(rec.name || rec.title);
      setRecTeluguTitle(rec.teluguName || rec.teluguTitle);
      setRecTime(rec.prepTime);
      setRecServings(rec.servings);
      setRecIngredients(rec.ingredients.join(", "));
      setRecInstructions(rec.instructions.join("\n"));
      setRecProducts(rec.linkedProducts || rec.relatedProductIds || []);
    } else {
      setRecTitle("");
      setRecTeluguTitle("");
      setRecTime("30 mins");
      setRecServings("4");
      setRecIngredients("");
      setRecInstructions("");
      setRecProducts([]);
    }
    setRecipeModalOpen(true);
  };

  const handleSaveRecipe = (e) => {
    e.preventDefault();
    const payload = {
      id: selectedRecipe ? selectedRecipe.id : `rec_${Date.now()}`,
      name: recTitle,
      title: recTitle,
      teluguName: recTeluguTitle,
      teluguTitle: recTeluguTitle,
      prepTime: recTime,
      servings: recServings,
      ingredients: recIngredients.split(",").map(i => i.trim()).filter(Boolean),
      instructions: recInstructions.split("\n").map(i => i.trim()).filter(Boolean),
      linkedProducts: recProducts,
      relatedProductIds: recProducts,
      image: selectedRecipe ? selectedRecipe.image : "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop"
    };

    editOrCreateRecipe(payload);
    setRecipeModalOpen(false);
    alert("Meal recipe registered successfully!");
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!couponCode || !couponDiscount) return;

    const newCoupon = {
      code: couponCode.toUpperCase(),
      discount: Number(couponDiscount),
      minOrder: Number(couponMinOrder) || 0,
      expiry: "2026-12-31",
      category: "all",
      usage: 0
    };

    setCoupons([...coupons, newCoupon]);
    setCouponCode("");
    setCouponDiscount("");
    setCouponMinOrder("");
    alert(`Promo Code ${newCoupon.code} published!`);
  };

  return (
    <div className="admin-layout" style={{ marginTop: "36px", backgroundColor: "#0f172a", color: "#f1f5f9" }}>
      
      {/* SIDEBAR */}
      <aside className="admin-sidebar" style={{ backgroundColor: "#1e293b", borderRight: "1px solid #334155" }}>
        <div className="admin-sidebar-header" style={{ borderBottom: "1px solid #334155", color: "#0ea5e9" }}>
          <Layers size={20} /> VNatural Admin WMS/DMS
        </div>
        
        {/* Permission Role select */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid #334155" }}>
          <span style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase" }}>Security Context</span>
          <select 
            value={adminRole} 
            onChange={(e) => setAdminRole(e.target.value)}
            style={{ width: "100%", marginTop: "4px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#fff", fontSize: "0.75rem", padding: "4px", borderRadius: "4px" }}
          >
            <option value="Super Admin">Super Admin</option>
            <option value="Finance Manager">Finance Manager</option>
            <option value="Inventory Manager">Inventory Manager</option>
            <option value="Procurement Manager">Procurement Manager</option>
          </select>
        </div>

        <ul className="admin-sidebar-menu" style={{ marginTop: "10px" }}>
          {[
            { id: "overview", label: "Operations Dashboard", icon: <BarChart2 size={16} /> },
            { id: "products", label: "Organic Catalog", icon: <Layers size={16} /> },
            { id: "inventory", label: "Traceability Inventory", icon: <Activity size={16} /> },
            { id: "orders", label: "Orders Desk", icon: <ShoppingCart size={16} />, count: orders.filter(o => o.status === "pending").length },
            { id: "customers", label: "Customer Accounts", icon: <Users size={16} /> },
            { id: "promotions", label: "Coupons & CMS", icon: <Tag size={16} /> },
            { id: "recipes", label: "Recipes Manager", icon: <BookOpen size={16} /> },
            { id: "insights", label: "BI Chatbot Co-pilot", icon: <Sparkles size={16} /> }
          ].map(menu => (
            <li 
              key={menu.id} 
              className={`admin-menu-item ${activeTab === menu.id ? "active" : ""}`}
              onClick={() => setActiveTab(menu.id)}
              style={{ padding: "10px 14px", fontSize: "0.85rem", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {menu.icon}
                <span>{menu.label}</span>
              </div>
              {menu.count > 0 && (
                <span style={{ fontSize: "0.7rem", backgroundColor: "#ef4444", color: "#fff", padding: "1px 6px", borderRadius: "10px", fontWeight: "700" }}>
                  {menu.count}
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* Admin profile detail bottom */}
        <div style={{ marginTop: "auto", padding: "16px", borderTop: "1px solid #334155", display: "flex", gap: "10px", alignItems: "center", cursor: "pointer" }} onClick={() => {
          setEditAdminName(currentUser.name || "");
          setEditAdminPhone(currentUser.phone || "");
          setEditAdminAvatar(currentUser.avatar || "");
          setShowAdminProfileModal(true);
        }}>
          <img src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
          <div>
            <strong style={{ fontSize: "0.8rem", display: "block" }}>{currentUser.name}</strong>
            <span style={{ fontSize: "0.65rem", color: "#64748b" }}>{adminRole} (Edit Profile)</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); logout(); }} style={{ marginLeft: "auto", backgroundColor: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }} title="Logout">
            <X size={16} />
          </button>
        </div>
      </aside>

      {/* WORKSPACE MAIN PANEL */}
      <main className="admin-main" style={{ padding: "30px", backgroundColor: "#0f172a" }}>
        
        {/* HEADER BAR */}
        <header className="admin-header" style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #334155", paddingBottom: "12px", marginBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#fff" }}>VNatural Business Intelligence Console</h1>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Supervising farmer sourcing, warehouse operations, and delivery ledgers</span>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => alert("Re-syncing local tables with pgAdmin 4...")} style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#fff", padding: "6px 12px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
              <RefreshCw size={12} /> Sync Postgres
            </button>
            <button onClick={() => alert("Operations PDF downloaded.")} style={{ backgroundColor: "#0ea5e9", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer" }}>
              Download PDF Report
            </button>
          </div>
        </header>

        {/* TAB 1: EXECUTIVE OPERATIONS DASHBOARD */}
        {activeTab === "overview" && (
          <div>
            {/* KPI grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "Delivered Sales Revenue", val: `₹${totalSalesVal.toLocaleString("en-IN")}`, desc: "Synced with pgAdmin 4", col: "#10b981" },
                { label: "Registered Customers", val: users.filter(u => u.role === "customer").length, desc: `${users.filter(u => u.role === "customer").length} total logins`, col: "#0ea5e9" },
                { label: "Pending order dispatches", val: pendingOrdersCount, desc: "Awaiting picker checklists", col: "#f59e0b" },
                { label: "low stock alert items", val: lowStockCount, desc: "Safety threshold < 50 kg", col: "#ef4444" }
              ].map((kpi, idx) => (
                <div key={idx} className="admin-card" style={{ backgroundColor: "#1e293b", border: `1px solid #334155`, borderRadius: "10px", padding: "16px" }}>
                  <span style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: "700" }}>{kpi.label}</span>
                  <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginTop: "6px", color: "#fff" }}>{kpi.val}</h2>
                  <span style={{ fontSize: "0.65rem", color: "#64748b", display: "block", marginTop: "4px" }}>{kpi.desc}</span>
                </div>
              ))}
            </div>

            {/* Dashboard Visual Layout */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
              
              {/* Interactive Sourcing Logs summary */}
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px", color: "#fff" }}>Real-time Operations Alert Log</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ padding: "10px", backgroundColor: "#0f172a", borderRadius: "6px", borderLeft: "3px solid #ef4444", fontSize: "0.75rem" }}>
                    <strong>Inventory Alert</strong>: sonamasuri rice stock level depleted to 0 kg. restock contract scheduled with farmer Keshav Reddy.
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#0f172a", borderRadius: "6px", borderLeft: "3px solid #f59e0b", fontSize: "0.75rem" }}>
                    <strong>Quality Sourcing Alert</strong>: incoming yield of A2 Ghee (Batch: BATCH-F-3829) approved moisture content checklist score.
                  </div>
                  <div style={{ padding: "10px", backgroundColor: "#0f172a", borderRadius: "6px", borderLeft: "3px solid #10b981", fontSize: "0.75rem" }}>
                    <strong>Logistics Alert</strong>: driver Kalyan Kumar completed OTP delivery order #ord_1028 (earnings logged).
                  </div>
                </div>
              </div>

              {/* Demand chart mock */}
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "14px" }}>Sales Sourcing Demands</h3>
                <div style={{ display: "flex", alignItems: "flex-end", height: "120px", gap: "10px", borderBottom: "1px solid #334155", paddingBottom: "10px" }}>
                  {[40, 65, 80, 50, 95, 30].map((h, i) => (
                    <div key={i} style={{ flexGrow: 1, height: `${h}px`, backgroundColor: "#0ea5e9", borderRadius: "3px" }}></div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", color: "#64748b", marginTop: "6px" }}>
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: ORGANIC CATALOG (PRODUCTS CRUD) */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Organic Catalog SKUs ({products.length})</h3>
              {adminRole === "Super Admin" || adminRole === "Inventory Manager" ? (
                <button onClick={() => handleOpenProductModal(null)} style={{ backgroundColor: "#0ea5e9", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Plus size={14} /> Add Product SKU
                </button>
              ) : null}
            </div>

            {/* Product list Table */}
            <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>SKU</th>
                    <th style={{ padding: "10px" }}>Category</th>
                    <th style={{ padding: "10px" }}>Retail Rate</th>
                    <th style={{ padding: "10px" }}>Stock levels</th>
                    <th style={{ padding: "10px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: "1px solid #33415533" }}>
                      <td style={{ padding: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img src={p.image} style={{ width: "32px", height: "32px", borderRadius: "4px", objectFit: "cover" }} />
                          <div>
                            <strong style={{ color: "#fff" }}>{p.name}</strong>
                            <span style={{ display: "block", fontSize: "0.65rem", color: "#64748b" }}>{p.teluguName}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "10px" }}>{p.category}</td>
                      <td style={{ padding: "10px", color: "#f59e0b", fontWeight: "700" }}>₹{p.price} / {p.unit}</td>
                      <td style={{ padding: "10px" }}>{p.stock} units</td>
                      <td style={{ padding: "10px" }}>
                        <button onClick={() => handleOpenProductModal(p)} style={{ background: "none", border: "none", color: "#0ea5e9", cursor: "pointer", marginRight: "10px" }} title="Edit">
                          <Edit size={14} />
                        </button>
                        {adminRole === "Super Admin" || adminRole === "Inventory Manager" ? (
                          <button onClick={() => handleDeleteProduct(p.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TRACEABILITY INVENTORY AUDIT */}
        {activeTab === "inventory" && (
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Traceability Stock Ledgers</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "24px" }}>
              
              {/* Stock audit checklist */}
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "12px" }}>Bin locations levels</h4>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", textAlign: "left" }}>
                      <th style={{ padding: "8px" }}>Product</th>
                      <th style={{ padding: "8px" }}>Category</th>
                      <th style={{ padding: "8px" }}>Bin Code</th>
                      <th style={{ padding: "8px" }}>Available Qty</th>
                      <th style={{ padding: "8px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => {
                      const bin = `${p.category.substring(0, 1).toUpperCase()}-${p.id.substring(2, 4)}`;
                      const isLow = p.stock < 50;

                      return (
                        <tr key={p.id} style={{ borderBottom: "1px solid #33415533" }}>
                          <td style={{ padding: "8px" }}><strong>{p.name}</strong></td>
                          <td style={{ padding: "8px" }}>{p.category}</td>
                          <td style={{ padding: "8px", color: "#0ea5e9", fontWeight: "700" }}>{bin}</td>
                          <td style={{ padding: "8px" }}>{p.stock} kg</td>
                          <td style={{ padding: "8px" }}>
                            <span style={{ color: isLow ? "#ef4444" : "#10b981", fontWeight: "700" }}>
                              {isLow ? "Low Threshold" : "Healthy"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Expiry Batch risks */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#ef4444", marginBottom: "10px" }}>Expiries Audit</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.75rem" }}>
                    <div style={{ borderBottom: "1px solid #33415533", paddingBottom: "6px" }}>
                      <strong>Organic Turmeric (BATCH-F-88)</strong>
                      <div style={{ display: "flex", justifyBetween: "true", color: "#ef4444", marginTop: "2px" }}>
                        <span>Expires in 12 days</span>
                        <span>Stock: 45 kg</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "10px" }}>Warehouse Storage Zones</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", fontSize: "0.7rem" }}>
                    <div style={{ padding: "6px", backgroundColor: "#0f172a", borderRadius: "4px" }}>Zone A (Dry staples): 72%</div>
                    <div style={{ padding: "6px", backgroundColor: "#0f172a", borderRadius: "4px" }}>Zone B (Grains bins): 88%</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: ORDERS DESK */}
        {activeTab === "orders" && (
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Sales Orders Dashboard ({orders.length})</h3>
            
            <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>Order ID</th>
                    <th style={{ padding: "10px" }}>Customer Details</th>
                    <th style={{ padding: "10px" }}>Order Total</th>
                    <th style={{ padding: "10px" }}>Payment</th>
                    <th style={{ padding: "10px" }}>Status</th>
                    <th style={{ padding: "10px" }}>Fulfillment Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(ord => (
                    <tr key={ord.id} style={{ borderBottom: "1px solid #33415533" }}>
                      <td style={{ padding: "10px" }}><strong>{ord.id}</strong></td>
                      <td style={{ padding: "10px" }}>
                        <div><strong>{ord.customerName}</strong></div>
                        <span style={{ fontSize: "0.7rem", color: "#64748b" }}>{ord.address}</span>
                      </td>
                      <td style={{ padding: "10px", color: "#f59e0b", fontWeight: "700" }}>₹{ord.total}</td>
                      <td style={{ padding: "10px" }}>{ord.paymentMethod} ({ord.paymentStatus})</td>
                      <td style={{ padding: "10px" }}>
                        <span className={`admin-badge ${ord.status}`}>{ord.status}</span>
                      </td>
                      <td style={{ padding: "10px" }}>
                        {ord.status === "pending" && (
                          <button 
                            onClick={() => {
                              updateOrderDeliveryStatus(ord.id, "packed");
                              alert(`Order ${ord.id} checklist sent to packing team.`);
                            }}
                            style={{ padding: "4px 8px", backgroundColor: "#3b82f6", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700", cursor: "pointer" }}
                          >
                            Assign to Packing
                          </button>
                        )}
                        {ord.status === "packed" && (
                          <button 
                            onClick={() => {
                              updateOrderDeliveryStatus(ord.id, "out_for_delivery");
                              alert(`Crate ${ord.id} assigned to driver lanes.`);
                            }}
                            style={{ padding: "4px 8px", backgroundColor: "#f59e0b", color: "#000", border: "none", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700", cursor: "pointer" }}
                          >
                            Assign to Driver
                          </button>
                        )}
                        {ord.status === "out_for_delivery" && (
                          <span style={{ color: "#10b981", fontWeight: "700" }}>En Route 🚗</span>
                        )}
                        {ord.status === "delivered" && (
                          <span style={{ color: "#64748b" }}>✓ Completed Dropoff</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CUSTOMER DIRECTORY (VIP SEGMENTS) */}
        {activeTab === "customers" && (
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>VIP Customer Segmentation & Logins Activity</h3>
            
            <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>Customer Details</th>
                    <th style={{ padding: "10px" }}>Contact Email</th>
                    <th style={{ padding: "10px" }}>Last Login</th>
                    <th style={{ padding: "10px" }}>Login IP</th>
                    <th style={{ padding: "10px" }}>Status</th>
                    <th style={{ padding: "10px" }}>Loyalty Points</th>
                    <th style={{ padding: "10px" }}>Wallet Balance</th>
                    <th style={{ padding: "10px" }}>Address List</th>
                    <th style={{ padding: "10px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => u.role === "customer").map(u => (
                    <tr key={u.id} style={{ borderBottom: "1px solid #33415533" }}>
                      <td style={{ padding: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <img src={u.avatar || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=50&auto=format&fit=crop"} style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
                          <div>
                            <strong>{u.name}</strong>
                            {u.loyaltyPoints > 200 && <span style={{ fontSize: "0.6rem", backgroundColor: "rgba(245,158,11,0.15)", color: "#f59e0b", padding: "1px 4px", marginLeft: "6px", borderRadius: "3px" }}>VIP</span>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "10px" }}>{u.email}</td>
                      <td style={{ padding: "10px", color: "var(--a-text-muted)" }}>{u.lastLogin || "Never"}</td>
                      <td style={{ padding: "10px", color: "var(--a-text-muted)", fontFamily: "var(--font-mono)" }}>{u.loginIp || "—"}</td>
                      <td style={{ padding: "10px" }}>
                        {u.status === "online" ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#10b981", fontWeight: "700" }}>
                            <span className="admin-live-dot" /> Online
                          </span>
                        ) : (
                          <span style={{ color: "#64748b" }}>Offline</span>
                        )}
                      </td>
                      <td style={{ padding: "10px", color: "#10b981", fontWeight: "700" }}>{u.loyaltyPoints || 0} pts</td>
                      <td style={{ padding: "10px", color: "#0ea5e9", fontWeight: "700" }}>₹{u.walletBalance || 0}</td>
                      <td style={{ padding: "10px" }}>
                        {u.addresses?.map(a => `${a.street}, ` + a.area + (` (${a.pincode})`)).join(" | ") || "No address slots"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        <button 
                          onClick={() => alert(`Customer account ${u.email} marked as VIP Tier 1.`)}
                          style={{ padding: "2px 6px", backgroundColor: "#334155", border: "none", color: "#fff", borderRadius: "4px", fontSize: "0.7rem", cursor: "pointer" }}
                        >
                          Mark VIP
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* TAB 6: FARMER PROCUREMENTS & SUPPLIER CONTRACTS */}
        {activeTab === "_removed_procurement" && (
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Farmer Sourcing Contracts</h3>
            
            <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>Farmer Partner</th>
                    <th style={{ padding: "10px" }}>Crop Item Sourced</th>
                    <th style={{ padding: "10px" }}>Sourcing Qty</th>
                    <th style={{ padding: "10px" }}>Purchase Rate</th>
                    <th style={{ padding: "10px" }}>Status</th>
                    <th style={{ padding: "10px" }}>Quality Verification Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {procurements.map(proc => (
                    <tr key={proc.id} style={{ borderBottom: "1px solid #33415533" }}>
                      <td style={{ padding: "10px" }}>
                        <strong>{proc.farmerName}</strong>
                        <span style={{ display: "block", fontSize: "0.7rem", color: "#64748b" }}>ID: {proc.farmerId}</span>
                      </td>
                      <td style={{ padding: "10px" }}>{proc.productName}</td>
                      <td style={{ padding: "10px" }}>{proc.quantity} kg</td>
                      <td style={{ padding: "10px", color: "#f59e0b", fontWeight: "700" }}>₹{proc.pricePerKg} / kg</td>
                      <td style={{ padding: "10px" }}>
                        <span className={`admin-badge ${proc.status}`}>{proc.status}</span>
                      </td>
                      <td style={{ padding: "10px" }}>
                        {proc.status === "pending" ? (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button 
                              onClick={() => {
                                approveProcurement(proc.id);
                                alert(`Procurement approved. Batch ${proc.id} logged for warehouse storage shelf.`);
                              }}
                              style={{ padding: "4px 8px", backgroundColor: "#10b981", color: "#000", border: "none", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700", cursor: "pointer" }}
                            >
                              Approve QA
                            </button>
                            <button 
                              onClick={() => {
                                rejectProcurement(proc.id);
                                alert(`Procurement rejected. QA failure filed.`);
                              }}
                              style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700", cursor: "pointer" }}
                            >
                              Reject PO
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#64748b" }}>Archived QA File</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: PAYOUTS & FINANCE LEDGER - REMOVED */}
        {activeTab === "_removed_finance" && (
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Financial Ledger & Reconciliation</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
              
              {/* Transactions List */}
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "12px" }}>Daily COD & Digital Collections</h4>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", textAlign: "left" }}>
                      <th style={{ padding: "8px" }}>Txn ID</th>
                      <th style={{ padding: "8px" }}>Customer</th>
                      <th style={{ padding: "8px" }}>Amount</th>
                      <th style={{ padding: "8px" }}>Gateway</th>
                      <th style={{ padding: "8px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financeLogs.map(txn => (
                      <tr key={txn.id} style={{ borderBottom: "1px solid #33415533" }}>
                        <td style={{ padding: "8px" }}><strong>{txn.id}</strong></td>
                        <td style={{ padding: "8px" }}>{txn.customer}</td>
                        <td style={{ padding: "8px", color: "#10b981", fontWeight: "700" }}>₹{txn.amount}</td>
                        <td style={{ padding: "8px" }}>{txn.method}</td>
                        <td style={{ padding: "8px" }}>
                          <span style={{ color: txn.status.includes("Pending") ? "#f59e0b" : "#10b981" }}>{txn.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* COD counter deposit auditing */}
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "10px" }}>COD Submission Ledgers</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.75rem" }}>
                  <div style={{ padding: "10px", backgroundColor: "#0f172a", borderRadius: "6px" }}>
                    <span>Pending Driver Deposits:</span>
                    <strong style={{ display: "block", fontSize: "1.1rem", color: "#f59e0b", marginTop: "4px" }}>₹{pendingCodToDeposit}</strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 8: COUPONS & CMS WEBSITE CONTENTS */}
        {activeTab === "promotions" && (
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Promo Coupons & CMS Editor</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              
              {/* Coupon code generator */}
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px" }}>Coupon Code Center</h4>
                
                <form onSubmit={handleCreateCoupon} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <input 
                      type="text" 
                      placeholder="Promo Code (e.g. FESTIVAL10)" 
                      style={{ padding: "8px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "6px", fontSize: "0.8rem" }}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      required
                    />
                    <input 
                      type="number" 
                      placeholder="Discount %" 
                      style={{ padding: "8px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "6px", fontSize: "0.8rem" }}
                      value={couponDiscount}
                      onChange={(e) => setCouponDiscount(e.target.value)}
                      required
                    />
                  </div>
                  <input 
                    type="number" 
                    placeholder="Min Order Limit (₹)" 
                    style={{ padding: "8px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "6px", fontSize: "0.8rem" }}
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(e.target.value)}
                  />
                  <button type="submit" style={{ backgroundColor: "#0ea5e9", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
                    Publish Promo Code
                  </button>
                </form>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", textAlign: "left" }}>
                      <th style={{ padding: "6px" }}>Code</th>
                      <th style={{ padding: "6px" }}>Discount</th>
                      <th style={{ padding: "6px" }}>Min Order</th>
                      <th style={{ padding: "6px" }}>Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #33415533" }}>
                        <td style={{ padding: "6px" }}><strong>{c.code}</strong></td>
                        <td style={{ padding: "6px" }}>{c.discount}%</td>
                        <td style={{ padding: "6px" }}>₹{c.minOrder}</td>
                        <td style={{ padding: "6px" }}>{c.usage} times</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Homepage CMS Hero Banner edits */}
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px" }}>Site Hero Banner CMS</h4>
                
                <div className="portal-form-group">
                  <label className="portal-label">Homepage Main Hero Title</label>
                  <input 
                    type="text" 
                    className="portal-input" 
                    style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }}
                    value={cmsHeroText} 
                    onChange={(e) => setCmsHeroText(e.target.value)} 
                  />
                </div>

                <button 
                  onClick={() => alert("CMS settings pushed to customer home views!")}
                  style={{ backgroundColor: "#f59e0b", border: "none", color: "#000", padding: "8px 16px", borderRadius: "6px", fontWeight: "700", cursor: "pointer", marginTop: "10px" }}
                >
                  Commit CMS Changes
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 9: RECIPES MANAGER */}
        {activeTab === "recipes" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Manage Kitchen Recipes ({recipes.length})</h3>
              <button onClick={() => handleOpenRecipeModal(null)} style={{ backgroundColor: "#0ea5e9", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer" }}>
                Add New Recipe
              </button>
            </div>

            <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", textAlign: "left" }}>
                    <th style={{ padding: "10px" }}>Image</th>
                    <th style={{ padding: "10px" }}>Recipe Title</th>
                    <th style={{ padding: "10px" }}>Telugu Title</th>
                    <th style={{ padding: "10px" }}>Prep Time</th>
                    <th style={{ padding: "10px" }}>Servings</th>
                    <th style={{ padding: "10px" }}>Linked Products</th>
                    <th style={{ padding: "10px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recipes.map(rec => (
                    <tr key={rec.id} style={{ borderBottom: "1px solid #33415533" }}>
                      <td style={{ padding: "10px" }}>
                        {rec.image ? (
                          <img src={rec.image} alt={rec.name || rec.title} style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "40px", height: "40px", borderRadius: "6px", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>🍳</div>
                        )}
                      </td>
                      <td style={{ padding: "10px" }}><strong>{rec.name || rec.title}</strong></td>
                      <td style={{ padding: "10px" }}>{rec.teluguName || rec.teluguTitle}</td>
                      <td style={{ padding: "10px" }}>{rec.prepTime}</td>
                      <td style={{ padding: "10px" }}>{rec.servings} people</td>
                      <td style={{ padding: "10px" }}>{rec.linkedProducts?.length || 0} SKUs</td>
                      <td style={{ padding: "10px" }}>
                        <button onClick={() => handleOpenRecipeModal(rec)} style={{ background: "none", border: "none", color: "#0ea5e9", cursor: "pointer" }} title="Edit">
                          <Edit size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 10: AI CO-PILOT CHATBOT BI ANALYST */}
        {activeTab === "insights" && (
          <div style={{ maxWidth: "700px", margin: "auto" }}>
            <div style={{ backgroundColor: "#1e293b", border: "1px solid #0ea5e9", borderRadius: "12px", overflow: "hidden" }}>
              
              <div style={{ backgroundColor: "#0f172a", padding: "16px 20px", borderBottom: "1px solid #334155", display: "flex", alignItems: "center", gap: "10px" }}>
                <Sparkles size={20} color="#0ea5e9" fill="#0ea5e9" />
                <div>
                  <strong style={{ color: "#fff", display: "block" }}>BI Conversational Co-pilot</strong>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Analyzing real-time stock levels, farmer receipts, and sales turnovers</span>
                </div>
              </div>

              <div style={{ height: "300px", overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {chatMessages.map((msg, idx) => {
                  const isAi = msg.sender === "ai";
                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        alignSelf: isAi ? "flex-start" : "flex-end",
                        maxWidth: "85%",
                        backgroundColor: isAi ? "#0f172a" : "#0ea5e9",
                        color: "#fff",
                        padding: "10px 14px",
                        borderRadius: isAi ? "12px 12px 12px 2px" : "12px 12px 2px 12px",
                        fontSize: "0.85rem",
                        border: isAi ? "1px solid #334155" : "none"
                      }}
                    >
                      {msg.text}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", gap: "6px", padding: "10px 20px", backgroundColor: "#0f172a55", borderTop: "1px solid #334155", overflowX: "auto" }}>
                {[
                  "Which products are most profitable?",
                  "What should I restock today?",
                  "Which products will expire soon?",
                  "Which zone is buying the most?"
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => setChatInput(chip)}
                    style={{ whiteSpace: "nowrap", backgroundColor: "#334155", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "20px", fontSize: "0.7rem", cursor: "pointer" }}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <form onSubmit={handleChatSubmit} style={{ display: "flex", padding: "12px 20px", borderTop: "1px solid #334155", backgroundColor: "#0f172a" }}>
                <input 
                  type="text" 
                  placeholder="Ask VNatural AI BI analyst..." 
                  style={{ flexGrow: 1, backgroundColor: "transparent", color: "#fff", border: "none", fontSize: "0.85rem", outline: "none" }}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" style={{ backgroundColor: "transparent", border: "none", color: "#0ea5e9", cursor: "pointer" }}>
                  <Send size={18} />
                </button>
              </form>

            </div>
          </div>
        )}

        {/* TAB 11: AUDIT REGISTERS */}
        {activeTab === "_removed_audit" && (
          <div></div>
        )}

      </main>

      {/* PRODUCT CREATOR MODAL */}
      {productModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyCenter: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#1e293b", border: "1px solid #0ea5e9", borderRadius: "12px", width: "500px", padding: "24px", maxHeight: "90vh", overflowY: "auto", position: "relative", color: "#fff" }}>
            <button onClick={() => setProductModalOpen(false)} style={{ position: "absolute", right: "16px", top: "16px", backgroundColor: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>✕</button>
            <h4 style={{ color: "#fff", fontWeight: "800", marginBottom: "16px" }}>{selectedProduct ? "Modify Product SKU" : "Register Product SKU"}</h4>
            
            <form onSubmit={handleSaveProduct} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="portal-form-group">
                  <label className="portal-label">Product Name (English)</label>
                  <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={prodName} onChange={(e) => setProdName(e.target.value)} required />
                </div>
                <div className="portal-form-group">
                  <label className="portal-label">Product Name (Telugu)</label>
                  <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={prodTelugu} onChange={(e) => setProdTelugu(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="portal-form-group">
                  <label className="portal-label">Catalog Category</label>
                  <select className="portal-select" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                    <option value="rice">Rice (బియ్యం)</option>
                    <option value="dals">Dals (పప్పులు)</option>
                    <option value="ancient-grains">Ancient Grains (చిరుధాన్యాలు)</option>
                    <option value="vegetables">Greens (ఆకుకూరలు)</option>
                  </select>
                </div>
                <div className="portal-form-group">
                  <label className="portal-label">Unit Weight</label>
                  <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={prodUnit} onChange={(e) => setProdUnit(e.target.value)} required />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="portal-form-group">
                  <label className="portal-label">Retail Price (₹)</label>
                  <input type="number" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required />
                </div>
                <div className="portal-form-group">
                  <label className="portal-label">Available Stock Qty</label>
                  <input type="number" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={prodStock} onChange={(e) => setProdStock(e.target.value)} required />
                </div>
              </div>

              <div className="portal-form-group">
                <label className="portal-label">Product Image File (Conversion Simulator)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ fontSize: "0.8rem", color: "#94a3b8" }} />
                {prodImage && (
                  <div style={{ marginTop: "10px" }}>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Live Thumbnail Preview:</span>
                    <img src={prodImage} style={{ width: "60px", height: "60px", borderRadius: "6px", objectFit: "cover", display: "block", marginTop: "4px" }} />
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "16px", margin: "6px 0" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.8rem" }}>
                  <input type="checkbox" checked={prodDiabetic} onChange={() => setProdDiabetic(!prodDiabetic)} />
                  <span>Diabetic Safe Indicator</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.8rem" }}>
                  <input type="checkbox" checked={prodProtein} onChange={() => setProdProtein(!prodProtein)} />
                  <span>High Protein Indicator</span>
                </label>
              </div>

              <div className="portal-form-group">
                <label className="portal-label">English Description</label>
                <textarea className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", minHeight: "50px" }} value={prodDescription} onChange={(e) => setProdDescription(e.target.value)} />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" className="btn-portal-secondary" style={{ width: "40%" }} onClick={() => setProductModalOpen(false)}>Cancel</button>
                <button type="submit" style={{ width: "60%", backgroundColor: "#0ea5e9", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
                  Commit Catalog SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECIPE CREATOR MODAL */}
      {recipeModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyCenter: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#1e293b", border: "1px solid #0ea5e9", borderRadius: "12px", width: "480px", padding: "24px", maxHeight: "90vh", overflowY: "auto", position: "relative", color: "#fff" }}>
            <button onClick={() => setRecipeModalOpen(false)} style={{ position: "absolute", right: "16px", top: "16px", backgroundColor: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>✕</button>
            <h4 style={{ color: "#fff", fontWeight: "800", marginBottom: "16px" }}>{selectedRecipe ? "Modify Meal Recipe" : "Register Meal Recipe"}</h4>
            
            <form onSubmit={handleSaveRecipe} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="portal-form-group">
                <label className="portal-label">Recipe Title (English)</label>
                <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={recTitle} onChange={(e) => setRecTitle(e.target.value)} required />
              </div>
              <div className="portal-form-group">
                <label className="portal-label">Recipe Title (Telugu)</label>
                <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={recTeluguTitle} onChange={(e) => setRecTeluguTitle(e.target.value)} required />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="portal-form-group">
                  <label className="portal-label">Preparation Time</label>
                  <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={recTime} onChange={(e) => setRecTime(e.target.value)} />
                </div>
                <div className="portal-form-group">
                  <label className="portal-label">Servings</label>
                  <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={recServings} onChange={(e) => setRecServings(e.target.value)} />
                </div>
              </div>

              <div className="portal-form-group">
                <label className="portal-label">Ingredients list (comma-separated)</label>
                <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={recIngredients} onChange={(e) => setRecIngredients(e.target.value)} placeholder="e.g. Rice, Moong Dal, Ghee" required />
              </div>

              <div className="portal-form-group">
                <label className="portal-label">Preparation instructions (line-separated)</label>
                <textarea className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", minHeight: "80px" }} value={recInstructions} onChange={(e) => setRecInstructions(e.target.value)} required />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="button" className="btn-portal-secondary" style={{ width: "40%" }} onClick={() => setRecipeModalOpen(false)}>Cancel</button>
                <button type="submit" style={{ width: "60%", backgroundColor: "#0ea5e9", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
                  Publish Kitchen Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN PROFILE EDITOR MODAL OVERLAY */}
      {showAdminProfileModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15,23,42,0.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyCenter: "center", padding: "16px" }}>
          <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "12px", width: "360px", padding: "20px", margin: "auto", position: "relative" }}>
            <button onClick={() => setShowAdminProfileModal(false)} style={{ position: "absolute", right: "12px", top: "12px", backgroundColor: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>✕</button>
            <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: "800", marginBottom: "16px" }}>Edit Admin Profile</h3>
            
            <form onSubmit={handleUpdateAdminProfile}>
              <div className="portal-form-group">
                <label className="portal-label">Admin Full Name</label>
                <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={editAdminName} onChange={(e) => setEditAdminName(e.target.value)} required />
              </div>
              <div className="portal-form-group">
                <label className="portal-label">Contact Phone</label>
                <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={editAdminPhone} onChange={(e) => setEditAdminPhone(e.target.value)} required />
              </div>
              <div className="portal-form-group">
                <label className="portal-label">Upload Profile Avatar File</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", padding: "6px" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditAdminAvatar(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                />
              </div>
              <button type="submit" style={{ width: "100%", backgroundColor: "#0ea5e9", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", marginTop: "10px" }}>
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
