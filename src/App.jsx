import React, { useState, useEffect } from "react";
import { DbProvider, useDb } from "./context/DbContext";
import { PortalSwitcher } from "./components/common/PortalSwitcher";
import { Stars } from "./components/common/Stars";
import { AiAssistantWidget } from "./components/customer/AiAssistantWidget";

// Pages
import { Home } from "./pages/customer/Home";
import { Catalog } from "./pages/customer/Catalog";
import { ProductDetail } from "./pages/customer/ProductDetail";
import { Cart } from "./pages/customer/Cart";
import { Checkout } from "./pages/customer/Checkout";
import { Profile } from "./pages/customer/Profile";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminRegisterPage } from "./pages/admin/AdminRegisterPage";
import { FarmerPortal } from "./pages/farmer/FarmerPortal";
import { WarehousePortal } from "./pages/warehouse/WarehousePortal";
import { DeliveryPortal } from "./pages/delivery/DeliveryPortal";
import { LoginPortal } from "./pages/common/LoginPortal";
import { Recipes } from "./pages/customer/Recipes";
import { AiNutritionist } from "./pages/customer/AiNutritionist";

// Styles
import "./styles/common.css";
import "./styles/customer.css";
import "./styles/admin.css";
import "./styles/portals.css";

// Lucide Icons
import { Leaf, ShoppingCart, User, Globe, LogOut, Sparkles, Sun, Moon } from "lucide-react";

function MainAppContent() {
  const [activePortal, setActivePortal] = useState("customer");
  const [customerPage, setCustomerPage] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("vn_theme") || "dark");

  const { language, setLanguage, cart, currentUser, logout, t, toast, setToast } = useDb();

  // Apply theme to document and persist
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("vn_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  // Auto-dismiss real-time toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  // Handle Admin Portal URL redirection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("portal") === "admin" || window.location.hash === "#/admin") {
      setActivePortal("admin");
      setCustomerPage("admin-login");
    }
  }, []);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Render Customer storefront view
  const renderCustomerPage = () => {
    switch (customerPage) {
      case "home":
        return <Home setPage={setCustomerPage} setSelectedProductId={setSelectedProductId} />;
      case "catalog":
        return <Catalog setPage={setCustomerPage} setSelectedProductId={setSelectedProductId} />;
      case "product-detail":
        return <ProductDetail productId={selectedProductId} setPage={setCustomerPage} setSelectedProductId={setSelectedProductId} />;
      case "cart":
        return <Cart setPage={setCustomerPage} />;
      case "checkout":
        return currentUser ? <Checkout setPage={setCustomerPage} /> : <LoginPortal activePortal="customer" setActivePortal={setActivePortal} />;
      case "profile":
        return currentUser ? <Profile setPage={setCustomerPage} setSelectedProductId={setSelectedProductId} /> : <LoginPortal activePortal="customer" setActivePortal={setActivePortal} />;
      case "recipes":
        return <Recipes />;
      case "ai-nutritionist":
        return <AiNutritionist />;
      case "admin-login":
        return <LoginPortal activePortal="admin" setActivePortal={setActivePortal} />;
      default:
        return <Home setPage={setCustomerPage} setSelectedProductId={setSelectedProductId} />;
    }
  };

  return (
    <>
      {/* Dev Portal Switcher HUD */}
      {currentUser?.role === "admin" && (
        <PortalSwitcher activePortal={activePortal} setActivePortal={setActivePortal} />
      )}

      {/* Real-time Toast Banner */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          backgroundColor: "#0f172a",
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
          color: "#f8fafc",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          minWidth: "320px",
          maxWidth: "400px",
          animation: "slideIn 0.3s ease-out"
        }}>
          <style>{`
            @keyframes slideIn {
              from {
                transform: translateY(100px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
          `}</style>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            backgroundColor: toast.type === "order" ? "rgba(16, 185, 129, 0.2)" :
                             toast.type === "farmer" ? "rgba(245, 158, 11, 0.2)" :
                             toast.type === "delivery" ? "rgba(59, 130, 246, 0.2)" : "rgba(139, 92, 246, 0.2)",
            color: toast.type === "order" ? "#10b981" :
                   toast.type === "farmer" ? "#f59e0b" :
                   toast.type === "delivery" ? "#3b82f6" : "#8b5cf6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "1.2rem"
          }}>
            {toast.type === "order" ? "🛒" :
             toast.type === "farmer" ? "🌾" :
             toast.type === "delivery" ? "🚚" : "👤"}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: "700" }}>{toast.title}</h4>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: "#94a3b8" }}>{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(null)}
            style={{
              background: "none",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              fontSize: "1.2rem",
              padding: "4px"
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* 1. CUSTOMER PORTAL */}
      {activePortal === "customer" && (
        <div className="customer-layout" style={{ paddingTop: currentUser?.role === "admin" ? "36px" : 0 }}>
          {/* Storefront Header */}
          <header className="customer-header">
            <div className="container header-inner">
              <div className="logo-container" onClick={() => setCustomerPage("home")} style={{ cursor: "pointer" }}>
                <div className="logo-icon">
                  <Leaf size={20} color="#000" fill="#000" />
                </div>
                <span><span className="logo-text-vn">V</span><span className="logo-text-atural">Natural</span></span>
              </div>

              <nav className="nav-links">
                <button 
                  className={`nav-link ${customerPage === "home" ? "active" : ""}`}
                  onClick={() => setCustomerPage("home")}
                >
                  {t("Home", "హోమ్")}
                </button>
                <button 
                  className={`nav-link ${customerPage === "catalog" ? "active" : ""}`}
                  onClick={() => setCustomerPage("catalog")}
                >
                  {t("Organic Shop", "కేటలాగ్")}
                </button>
                <button 
                  className={`nav-link ${customerPage === "profile" ? "active" : ""}`}
                  onClick={() => setCustomerPage("profile")}
                >
                  {t("My Subscriptions", "నా చందాలు")}
                </button>
                <button 
                  className={`nav-link ${customerPage === "recipes" ? "active" : ""}`}
                  onClick={() => setCustomerPage("recipes")}
                >
                  {t("Recipes & Prep", "వంటకాలు")}
                </button>
                <button 
                  className={`nav-link ${customerPage === "ai-nutritionist" ? "active" : ""}`}
                  onClick={() => setCustomerPage("ai-nutritionist")}
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Sparkles size={14} color="var(--c-accent)" fill="var(--c-accent)" /> {t("AI Health", "AI నిపుణుడు")}
                </button>
              </nav>

              {/* Header Actions */}
              <div className="header-actions">
                {/* Language Switcher */}
                <button
                  onClick={() => setLanguage(language === "en" ? "te" : "en")}
                  style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    fontWeight: "600", fontSize: "0.8rem",
                    color: "var(--c-primary)",
                    border: "1px solid var(--c-border)",
                    padding: "5px 12px", borderRadius: "20px",
                    background: "var(--c-primary-dim)", cursor: "pointer",
                    transition: "var(--transition)"
                  }}
                >
                  <Globe size={13} /> {language === "en" ? "EN" : "తె"}
                </button>

                {/* Dark/Light Mode Toggle */}
                <button className="theme-toggle-btn" onClick={toggleTheme} title={theme === "dark" ? "Switch to Light" : "Switch to Dark"}>
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                {/* Cart Icon */}
                <button className="cart-icon-btn" onClick={() => setCustomerPage("cart")}>
                  <ShoppingCart size={20} />
                  {cartItemsCount > 0 && (
                    <span className="cart-badge">{cartItemsCount}</span>
                  )}
                </button>

                {/* Customer Account Avatar / Login */}
                {currentUser ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      onClick={() => setCustomerPage("profile")}
                      className="header-user-avatar"
                    />
                    <button onClick={logout} style={{ color: "var(--error)", padding: "4px", cursor: "pointer", display: "flex", alignItems: "center" }} title="Logout">
                      <LogOut size={15} />
                    </button>
                  </div>
                ) : (
                  <button className="btn-primary" onClick={() => setCustomerPage("profile")} style={{ padding: "0.5rem 1.2rem", fontSize: "0.85rem" }}>
                    <User size={14} /> {t("Login", "లాగిన్")}
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Page Contents */}
          <main style={{ flexGrow: 1, paddingBottom: "40px" }}>
            {renderCustomerPage()}
          </main>
          {/* AI Floating Chatbot widget */}
          <AiAssistantWidget />

          {/* Storefront Footer */}
          <footer className="customer-footer">
            <div className="container">
              <div className="footer-grid">
                {/* Brand col */}
                <div className="footer-col">
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: "800",
                    marginBottom: "12px",
                    color: "var(--c-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "1.15rem"
                  }}>
                    <Leaf size={18} fill="var(--c-primary)" /> VNatural
                  </h3>
                  <p className="footer-brand-desc">
                    {t(
                      "Fresh choices for a healthier and better life. Empowering health-conscious households with traceable, chemical-free farm staples.",
                      "ఆరోగ్యకరమైన మరియు మెరుగైన జీవితానికి తాజా ఎంపిక. రసాయనాలు లేని స్వచ్ఛమైన ఆహారం."
                    )}
                  </p>
                  {/* Social Icons */}
                  <div className="footer-social-row">
                    {["f", "ig", "tw", "yt"].map((s, i) => (
                      <div key={i} className="footer-social-icon">
                        {s === "f" && "f"}
                        {s === "ig" && "in"}
                        {s === "tw" && "x"}
                        {s === "yt" && "▶"}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company col */}
                <div className="footer-col">
                  <h4>{t("Company", "కంపెనీ")}</h4>
                  <ul>
                    <li><button onClick={() => setCustomerPage("home")}>{t("About Us", "మా గురించి")}</button></li>
                    <li><button onClick={() => setCustomerPage("home")}>{t("Our Farms", "మా ఫార్మ్లు")}</button></li>
                    <li><button onClick={() => setCustomerPage("home")}>{t("Careers", "కెరీర్")}</button></li>
                    <li><button onClick={() => setCustomerPage("home")}>{t("Press", "పత్రికా")}</button></li>
                  </ul>
                </div>

                {/* Customer Service col */}
                <div className="footer-col">
                  <h4>{t("Customer Service", "కస్టమర్ సేవ")}</h4>
                  <ul>
                    <li><button onClick={() => setCustomerPage("home")}>{t("Contact Us", "సంప్రదించండి")}</button></li>
                    <li><button onClick={() => setCustomerPage("home")}>{t("FAQs", "తరచుగా అడిగే ప్రశ్నలు")}</button></li>
                    <li><button onClick={() => setCustomerPage("home")}>{t("Shipping & Delivery", "షిప్పింగ్ & డెలివరీ")}</button></li>
                    <li><button onClick={() => setCustomerPage("home")}>{t("Returns", "రిటర్న్స్")}</button></li>
                  </ul>
                </div>

                {/* My Account col */}
                <div className="footer-col">
                  <h4>{t("My Account", "నా అకౌంట్")}</h4>
                  <ul>
                    <li><button onClick={() => setCustomerPage("profile")}>{t("My Orders", "నా ఆర్డర్లు")}</button></li>
                    <li><button onClick={() => setCustomerPage("profile")}>{t("Wishlist", "విష్‌లిస్ట్")}</button></li>
                    <li><button onClick={() => setCustomerPage("profile")}>{t("Track Order", "ఆర్డర్ ట్రాక్")}</button></li>
                    <li><button onClick={() => setCustomerPage("profile")}>{t("Account Details", "అకౌంట్ వివరాలు")}</button></li>
                  </ul>
                </div>

                {/* Download App col */}
                <div className="footer-col">
                  <h4>{t("Download Our App", "యాప్ డౌన్‌లోడ్")}</h4>
                  <div className="footer-app-row">
                    <div className="footer-app-badge">
                      <span className="footer-app-badge-icon">🍎</span>
                      <div className="footer-app-badge-text">
                        <span className="footer-app-badge-sub">Download on the</span>
                        <span className="footer-app-badge-name">App Store</span>
                      </div>
                    </div>
                    <div className="footer-app-badge">
                      <span className="footer-app-badge-icon">▶</span>
                      <div className="footer-app-badge-text">
                        <span className="footer-app-badge-sub">Get it on</span>
                        <span className="footer-app-badge-name">Google Play</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: "16px", fontSize: "0.8rem", color: "var(--c-text-muted)" }}>
                    <div>support@vnatural.com</div>
                    <div style={{ marginTop: "4px" }}>+91 99001 12233</div>
                    <div style={{ marginTop: "8px" }}>
                      <button
                        onClick={() => setActivePortal("admin")}
                        style={{ opacity: 0.45, fontSize: "0.76rem", color: "var(--c-text-subtle)" }}
                      >Admin Portal</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer bottom */}
              <div className="footer-bottom">
                <span>© 2026 VNatural Organic Sourcing Platform. All rights reserved.</span>
                <div style={{ display: "flex", gap: "16px" }}>
                  <button style={{ color: "var(--c-text-subtle)", fontSize: "0.8rem", cursor: "pointer" }}>
                    {t("Privacy Policy", "గోప్యతా విధానం")}
                  </button>
                  <button style={{ color: "var(--c-text-subtle)", fontSize: "0.8rem", cursor: "pointer" }}>
                    {t("Terms & Conditions", "నిబంధనలు")}
                  </button>
                  <span style={{ color: "var(--c-primary)", fontWeight: "600" }}>🌿 100% Organic</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* 2. ADMIN PORTAL */}
      {activePortal === "admin" && (
        currentUser && currentUser.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <LoginPortal activePortal="admin" setActivePortal={setActivePortal} />
        )
      )}

      {/* 3. ADMIN REGISTRATION — new admin account creation */}
      {activePortal === "admin-register" && (
        <AdminRegisterPage
          onSuccess={(user) => {
            // After successful registration, route new admin to their customer storefront
            setActivePortal("admin");
          }}
          onBackToLogin={() => setActivePortal("admin")}
        />
      )}
    </>
  );
}

function App() {
  return (
    <DbProvider>
      <MainAppContent />
    </DbProvider>
  );
}

export default App;
