import React, { useState } from "react";
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
import { Leaf, ShoppingCart, User, Globe, LogOut, Sparkles } from "lucide-react";

function MainAppContent() {
  const [activePortal, setActivePortal] = useState("customer");
  const [customerPage, setCustomerPage] = useState("home");
  const [selectedProductId, setSelectedProductId] = useState("");

  const { language, setLanguage, cart, currentUser, logout, t, toast, setToast } = useDb();

  // Auto-dismiss real-time toast after 5 seconds
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, setToast]);

  // Handle Admin Portal URL redirection
  React.useEffect(() => {
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
                <Leaf className="logo-leaf" size={26} fill="var(--c-primary)" />
                <span>VNatural</span>
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

              <div className="header-actions">
                {/* Language Switcher */}
                <button
                  onClick={() => setLanguage(language === "en" ? "te" : "en")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    color: "var(--c-primary)",
                    border: "1px solid var(--c-border)",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    backgroundColor: "#fff",
                    cursor: "pointer"
                  }}
                >
                  <Globe size={14} /> {language === "en" ? "English" : "తెలుగు"}
                </button>

                {/* Cart Icon */}
                <button 
                  onClick={() => setCustomerPage("cart")}
                  style={{ position: "relative", padding: "6px", cursor: "pointer", color: "var(--c-primary)" }}
                >
                  <ShoppingCart size={22} />
                  {cartItemsCount > 0 && (
                    <span style={{
                      position: "absolute",
                      top: "-2px",
                      right: "-2px",
                      backgroundColor: "var(--c-accent)",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                {/* Customer Account Avatar */}
                {currentUser ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      onClick={() => setCustomerPage("profile")}
                      style={{ width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", objectFit: "cover", border: "1.5px solid var(--c-primary)" }}
                    />
                    <button onClick={logout} style={{ color: "var(--error)", padding: "4px", cursor: "pointer" }} title="Logout">
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <button className="btn-primary" onClick={() => setCustomerPage("profile")} style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>
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
                <div className="footer-col">
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: "800", marginBottom: "10px", color: "var(--c-accent)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Leaf size={18} fill="var(--c-accent)" /> VNatural Organics
                  </h3>
                  <p style={{ fontSize: "0.85rem", opacity: 0.8, lineHeight: "1.6" }}>
                    {t("Empowering health-conscious households with traceable, chemical-free farm staples. Our direct crop sourcing benefits local agriculture.",
                       "రసాయనాలు లేని స్వచ్ఛమైన సేంద్రీయ ఆహార ఉత్పత్తులు. స్థానిక వ్యవసాయాన్ని ప్రోత్సహించండి.")}
                  </p>
                </div>
                <div className="footer-col">
                  <h4>{t("Quick Links", "లింకులు")}</h4>
                  <ul>
                    <li><button onClick={() => setCustomerPage("home")}>{t("Home Page", "హోమ్")}</button></li>
                    <li><button onClick={() => setCustomerPage("catalog")}>{t("Organic Catalog", "కేటలాగ్")}</button></li>
                    <li><button onClick={() => setCustomerPage("profile")}>{t("Subscriptions", "సబ్‌స్క్రిప్షన్స్")}</button></li>
                    <li><button onClick={() => setCustomerPage("admin-login")} style={{ opacity: 0.6 }}>{t("Admin Portal", "అడ్మిన్ పోర్టల్")}</button></li>
                  </ul>
                </div>
                <div className="footer-col">
                  <h4>{t("Local Delivery Zones", "డెలివరీ ప్రాంతాలు")}</h4>
                  <ul style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                    <li>Madhapur, Hyderabad</li>
                    <li>Gachibowli, Hyderabad</li>
                    <li>Kondapur, Hyderabad</li>
                    <li>Begumpet, Secunderabad</li>
                  </ul>
                </div>
                <div className="footer-col">
                  <h4>{t("Support Channels", "సహాయం")}</h4>
                  <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                    Email: support@vnatural.com<br />
                    Phone: +91 99001 12233
                  </p>
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", textAlign: "center", fontSize: "0.8rem", opacity: 0.7 }}>
                &copy; 2026 VNatural Organic Sourcing Platform. All rights reserved.
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
