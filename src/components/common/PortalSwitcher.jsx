import React, { useState } from "react";
import { useDb } from "../../context/DbContext";
import { Shield, ShoppingBag, Wheat, Package, Truck, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

export const PortalSwitcher = ({ activePortal, setActivePortal }) => {
  const { login, logout, users, syncStatus, pendingSyncCount } = useDb();
  const [isOpen, setIsOpen] = useState(false);

  const portals = [
    {
      id: "customer",
      name: "Customer Storefront",
      email: "customer@gmail.com",
      role: "customer",
      icon: <ShoppingBag size={16} />,
      color: "var(--c-primary)"
    },
    {
      id: "admin",
      name: "Admin Dashboard",
      email: "admin@vnatural.com",
      role: "admin",
      icon: <Shield size={16} />,
      color: "var(--a-primary)"
    },
    {
      id: "farmer",
      name: "Farmer Portal",
      email: "farmer.keshav@gmail.com",
      role: "farmer",
      icon: <Wheat size={16} />,
      color: "var(--p-primary)"
    },
    {
      id: "warehouse",
      name: "Warehouse Ops",
      email: "warehouse.rama@vnatural.com",
      role: "warehouse",
      icon: <Package size={16} />,
      color: "#f59e0b"
    },
    {
      id: "delivery",
      name: "Delivery Driver",
      email: "delivery.kalyan@gmail.com",
      role: "delivery",
      icon: <Truck size={16} />,
      color: "#3b82f6"
    }
  ];

  const handleSwitch = async (portal) => {
    // Directly log in as the mock user for that portal to avoid timing delays
    if (portal.role === "admin") {
      await login(portal.email, "admin123");
    } else if (portal.role === "farmer") {
      await login(portal.email, "farmer123");
    } else if (portal.role === "warehouse") {
      await login(portal.email, "warehouse123");
    } else if (portal.role === "delivery") {
      await login(portal.email, "delivery123");
    } else {
      await login(portal.email, "customer123");
    }
    setActivePortal(portal.id);
    setIsOpen(false);
  };

  const activeInfo = portals.find(p => p.id === activePortal);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 9999,
      fontFamily: "var(--font-display)",
      fontSize: "0.85rem",
      backgroundColor: "#1e293b",
      color: "#f8fafc",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      borderBottom: "2px solid " + (activeInfo?.color || "var(--c-primary)")
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 16px",
        height: "36px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 8px",
            borderRadius: "4px",
            backgroundColor: "rgba(255,255,255,0.1)",
            fontSize: "0.75rem",
            fontWeight: "700"
          }}>
            VNATURAL CORE FLOW
          </span>
          <span style={{ color: "#94a3b8" }}>Active:</span>
          <strong style={{ display: "flex", alignItems: "center", gap: "4px", color: activeInfo?.color }}>
            {activeInfo?.icon} {activeInfo?.name}
          </strong>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Real-time Sync Status HUD */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.75rem",
            color: "#94a3b8",
            backgroundColor: "rgba(0,0,0,0.2)",
            padding: "4px 8px",
            borderRadius: "12px",
            border: "1px solid #334155"
          }}>
            <span style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: syncStatus === "synced" ? "#10b981" :
                               syncStatus === "syncing" ? "#3b82f6" : "#f59e0b",
              display: "inline-block",
              boxShadow: syncStatus === "synced" ? "0 0 8px #10b981" :
                         syncStatus === "syncing" ? "0 0 8px #3b82f6" : "0 0 8px #f59e0b",
              animation: syncStatus === "syncing" ? "pulse 1s infinite" : "none"
            }} />
            <style>{`
              @keyframes pulse {
                0% { opacity: 0.4; }
                50% { opacity: 1; }
                100% { opacity: 0.4; }
              }
            `}</style>
            <span>
              {syncStatus === "synced" ? "Synced" :
               syncStatus === "syncing" ? "Syncing..." :
               `Offline Mode (${pendingSyncCount} pending)`}
            </span>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#f8fafc",
              fontWeight: "600",
              cursor: "pointer",
              background: "none",
              border: "none"
            }}
          >
            <RefreshCw size={12} /> Switch Portal {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          padding: "12px 16px",
          backgroundColor: "#0f172a",
          borderTop: "1px solid #334155"
        }}>
          {portals.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSwitch(p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid " + (activePortal === p.id ? p.color : "#334155"),
                backgroundColor: activePortal === p.id ? "rgba(255,255,255,0.05)" : "transparent",
                color: activePortal === p.id ? p.color : "#94a3b8",
                fontWeight: "600",
                transition: "all 0.2s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                if (activePortal !== p.id) {
                  e.currentTarget.style.color = p.color;
                  e.currentTarget.style.borderColor = p.color;
                }
              }}
              onMouseLeave={(e) => {
                if (activePortal !== p.id) {
                  e.currentTarget.style.color = "#94a3b8";
                  e.currentTarget.style.borderColor = "#334155";
                }
              }}
            >
              {p.icon} {p.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
