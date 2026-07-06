import React, { useState } from "react";
import { useDb } from "../../context/DbContext";
import { Leaf, Lock, Mail, ShieldAlert, Wheat, Package, Truck, Shield } from "lucide-react";

export const LoginPortal = ({ activePortal, setActivePortal }) => {
  const { login, saveUser, t } = useDb();

  // Selected role maps to the active portal passed down
  const selectedRole = activePortal;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Register toggles and states
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  
  // Role specific fields
  const [regStreet, setRegStreet] = useState("");
  const [regArea, setRegArea] = useState("");
  const [regCity, setRegCity] = useState("Hyderabad");
  const [regPincode, setRegPincode] = useState("");
  const [regFarmName, setRegFarmName] = useState("");
  const [regFarmLocation, setRegFarmLocation] = useState("");
  const [regFacility, setRegFacility] = useState("Central Warehouse Hub");
  const [regShift, setRegShift] = useState("Day Shift (8 AM - 5 PM)");
  const [regVehicleNo, setRegVehicleNo] = useState("");
  const [regZone, setRegZone] = useState("");

  const accounts = {
    customer: { email: "customer@gmail.com", pass: "customer123", label: "Vijay Kumar (Customer)" },
    admin: { email: "admin@vnatural.com", pass: "admin123", label: "Srinivas Raju (Admin)" },
    farmer: { email: "farmer.keshav@gmail.com", pass: "farmer123", label: "Keshav Reddy (Farmer)" },
    warehouse: { email: "warehouse.rama@vnatural.com", pass: "warehouse123", label: "Rama Rao (Warehouse)" },
    delivery: { email: "delivery.kalyan@gmail.com", pass: "delivery123", label: "Kalyan Kumar (Driver)" }
  };

  // Pre-fill demo credentials helper
  const handlePrefill = () => {
    setEmail(accounts[selectedRole].email);
    setPassword(accounts[selectedRole].pass);
    setErrorMsg("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      setActivePortal(result.user.role);
    } else {
      setErrorMsg(t("Incorrect username or password validation failed.", "ఈమెయిల్ లేదా పాస్‌వర్డ్ తప్పుగా నమోదు చేయబడింది."));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regEmail || !regPassword || !regName) return;

    // Construct registration user model
    const newUser = {
      id: `u_${selectedRole}_${Date.now()}`,
      email: regEmail,
      password: regPassword,
      role: selectedRole,
      name: regName,
      phone: regPhone,
      avatar: selectedRole === "customer" 
        ? "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=150&auto=format&fit=crop"
        : selectedRole === "farmer"
        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
        : selectedRole === "delivery"
        ? "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      addresses: selectedRole === "customer" ? [{ id: 1, type: "Home", street: regStreet, area: regArea, city: regCity, pincode: regPincode }] : [],
      loyaltyPoints: selectedRole === "customer" ? 100 : 0, // Welcome points
      walletBalance: selectedRole === "customer" ? 500 : 0, // Welcome wallet balance
      dietPreferences: { diabeticAware: false, highProtein: false, vegan: false, glutenFree: false },
      farmName: regFarmName || null,
      farmLocation: regFarmLocation || null,
      shift: regShift || null,
      facility: regFacility || null,
      vehicleNo: regVehicleNo || null,
      zone: regZone || null,
      withdrawnAmount: 0,
      payouts: []
    };

    await saveUser(newUser);
    
    // Auto login
    const result = await login(regEmail, regPassword);
    if (result.success) {
      setActivePortal(selectedRole);
      alert(`Registration successful! Logged in as ${regName}.`);
    } else {
      setErrorMsg("Failed to auto-login after registration.");
    }
  };

  // Theme matching current active portal role
  const getThemeDetails = () => {
    switch (selectedRole) {
      case "customer":
        return {
          icon: <Leaf size={24} fill="#10b981" />,
          color: "#10b981",
          bgColor: "#10b981",
          title: t("Customer Storefront Login", "కస్టమర్ స్టోర్ లాగిన్"),
          subtitle: t("Browse, buy and subscribe to farm-fresh organic food", "సేంద్రీయ ఆహార పదార్థాల కొనుగోలు వేదిక")
        };
      case "admin":
        return {
          icon: <Shield size={24} />,
          color: "#8b5cf6",
          bgColor: "#8b5cf6",
          title: t("Admin Operations Console", "అడ్మిన్ నియంత్రణ ప్యానెల్"),
          subtitle: t("Manage orders, approvals, and inventory details", "నిర్వహణ మరియు పర్యవేక్షణ వేదిక")
        };
      case "farmer":
        return {
          icon: <Wheat size={24} />,
          color: "#f59e0b",
          bgColor: "#f59e0b",
          title: t("Farmer Yields Portal", "రైతు విక్రయాల వేదిక"),
          subtitle: t("Offer crops and track procurement approvals", "సేంద్రీయ పంటల నమోదు మరియు చెల్లింపులు")
        };
      case "warehouse":
        return {
          icon: <Package size={24} />,
          color: "#d97706",
          bgColor: "#d97706",
          title: t("Warehouse Management Portal", "గోదాము పంపిణీ లాగిన్"),
          subtitle: t("Manage aging stocks and order packing checklists", "రసీదుల నమోదు మరియు ప్యాకింగ్ సదుపాయం")
        };
      case "delivery":
        return {
          icon: <Truck size={24} />,
          color: "#3b82f6",
          bgColor: "#3b82f6",
          title: t("Logistics & Delivery Portal", "డెలివరీ భాగస్వామి లాగిన్"),
          subtitle: t("Verify OTPs, deliver orders and withdraw earnings", "డెలివరీల నిర్వహణ మరియు విత్‌డ్రా సదుపాయం")
        };
      default:
        return {
          icon: <Leaf size={24} />,
          color: "#10b981",
          bgColor: "#10b981",
          title: "VNatural Supply Chain Portal",
          subtitle: "Unified agricultural commerce system"
        };
    }
  };

  const theme = getThemeDetails();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0f172a",
      fontFamily: "var(--font-sans)",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "500px",
        width: "100%",
        backgroundColor: "#1e293b",
        border: `1.5px solid ${theme.color}44`,
        borderRadius: "16px",
        padding: "30px",
        boxShadow: `0 10px 25px -5px ${theme.color}22`,
        animation: "slideUp 0.3s ease-out"
      }}>
        {/* Portal-specific Logo Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "54px",
            height: "54px",
            borderRadius: "50%",
            backgroundColor: `${theme.color}15`,
            color: theme.color,
            marginBottom: "12px"
          }}>
            {theme.icon}
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", color: "#fff", fontWeight: "800", fontSize: "1.5rem" }}>
            {theme.title}
          </h2>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>
            {theme.subtitle}
          </p>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "0.75rem",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <ShieldAlert size={14} /> {errorMsg}
          </div>
        )}

        {!isRegistering ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="admin-input-group" style={{ marginBottom: 0 }}>
              <label style={{ color: "#94a3b8" }}>Email Address</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className="admin-input"
                  style={{ width: "100%", paddingLeft: "32px", border: "1px solid #334155", backgroundColor: "#0f172a", color: "#fff" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                />
              </div>
            </div>

            <div className="admin-input-group" style={{ marginBottom: 0 }}>
              <label style={{ color: "#94a3b8" }}>Secret Password</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  className="admin-input"
                  style={{ width: "100%", paddingLeft: "32px", border: "1px solid #334155", backgroundColor: "#0f172a", color: "#fff" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Quick Demo Pre-fill helper */}
            <button
              type="button"
              onClick={handlePrefill}
              style={{
                background: "transparent",
                border: "none",
                color: theme.color,
                fontSize: "0.75rem",
                fontWeight: "600",
                alignSelf: "flex-start",
                cursor: "pointer",
                padding: "2px 0",
                textDecoration: "underline"
              }}
            >
              🔑 Pre-fill Demo Account Details
            </button>

            <button
              type="submit"
              className="btn-admin"
              style={{
                marginTop: "6px",
                padding: "12px",
                fontSize: "0.9rem",
                fontWeight: "700",
                backgroundColor: theme.color,
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "8px"
              }}
            >
              Authorize Access
            </button>

            {selectedRole !== "admin" && (
              <div style={{ textAlign: "center", marginTop: "10px", fontSize: "0.8rem", color: "#94a3b8" }}>
                New to VNatural?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setErrorMsg("");
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: theme.color,
                    fontWeight: "700",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Register Account
                </button>
              </div>
            )}
            {selectedRole === "admin" && (
              <div style={{ textAlign: "center", marginTop: "10px", fontSize: "0.8rem", color: "#64748b",
                padding: "12px", borderTop: "1px solid rgba(51,65,85,0.5)" }}>
                New administrator?{" "}
                <button
                  type="button"
                  onClick={() => setActivePortal("admin-register")}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#a78bfa",
                    fontWeight: "700",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  Create Admin Account →
                </button>
              </div>
            )}
          </form>
        ) : (
          /* REGISTRATION / SIGN UP FORM */
          <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <h4 style={{ color: "#fff", margin: "0 0 4px", fontSize: "0.95rem" }}>Register as {selectedRole.toUpperCase()}</h4>
            
            <div className="admin-input-group" style={{ marginBottom: 0 }}>
              <label style={{ color: "#94a3b8" }}>Full Legal Name</label>
              <input type="text" className="admin-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} required value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Vijay Kumar" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="admin-input-group" style={{ marginBottom: 0 }}>
                <label style={{ color: "#94a3b8" }}>Email ID</label>
                <input type="email" className="admin-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="name@domain.com" />
              </div>
              <div className="admin-input-group" style={{ marginBottom: 0 }}>
                <label style={{ color: "#94a3b8" }}>Password</label>
                <input type="password" className="admin-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Min 6 chars" />
              </div>
            </div>

            <div className="admin-input-group" style={{ marginBottom: 0 }}>
              <label style={{ color: "#94a3b8" }}>Contact Phone Number</label>
              <input type="text" className="admin-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="9876543210" />
            </div>

            {/* Customer specific signup details */}
            {selectedRole === "customer" && (
              <>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: "#94a3b8" }}>Street / Flat Address</label>
                  <input type="text" className="admin-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} required value={regStreet} onChange={(e) => setRegStreet(e.target.value)} placeholder="Flat 402, Green Meadows" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "10px" }}>
                  <div className="admin-input-group" style={{ marginBottom: 0 }}>
                    <label style={{ color: "#94a3b8" }}>Area / Landmark</label>
                    <input type="text" className="admin-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} required value={regArea} onChange={(e) => setRegArea(e.target.value)} placeholder="Madhapur" />
                  </div>
                  <div className="admin-input-group" style={{ marginBottom: 0 }}>
                    <label style={{ color: "#94a3b8" }}>Pincode</label>
                    <input type="text" className="admin-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} required maxLength={6} value={regPincode} onChange={(e) => setRegPincode(e.target.value)} placeholder="500081" />
                  </div>
                </div>
              </>
            )}

            {/* Farmer specific signup details */}
            {selectedRole === "farmer" && (
              <>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: "#94a3b8" }}>Farm / Cooperative Name</label>
                  <input type="text" className="admin-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} required value={regFarmName} onChange={(e) => setRegFarmName(e.target.value)} placeholder="Krishna Organic Farms" />
                </div>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: "#94a3b8" }}>Farm Location Address & Pincode</label>
                  <input type="text" className="admin-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} required value={regFarmLocation} onChange={(e) => setRegFarmLocation(e.target.value)} placeholder="Guntur Rural, AP - 522002" />
                </div>
              </>
            )}

            {/* Warehouse specific signup details */}
            {selectedRole === "warehouse" && (
              <>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: "#94a3b8" }}>Warehouse Facility Location</label>
                  <input type="text" className="admin-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} required value={regFacility} onChange={(e) => setRegFacility(e.target.value)} placeholder="Central Warehouse Hub - Vijayawada" />
                </div>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: "#94a3b8" }}>Assigned Shift Hours</label>
                  <select className="admin-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={regShift} onChange={(e) => setRegShift(e.target.value)}>
                    <option style={{ backgroundColor: "#1e293b", color: "#fff" }} value="Day Shift (8 AM - 5 PM)">Day Shift (8 AM - 5 PM)</option>
                    <option style={{ backgroundColor: "#1e293b", color: "#fff" }} value="Night Shift (9 PM - 6 AM)">Night Shift (9 PM - 6 AM)</option>
                  </select>
                </div>
              </>
            )}

            {/* Delivery specific signup details */}
            {selectedRole === "delivery" && (
              <>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: "#94a3b8" }}>Vehicle Registration Number</label>
                  <input type="text" className="admin-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} required value={regVehicleNo} onChange={(e) => setRegVehicleNo(e.target.value)} placeholder="AP-07-TV-4521" />
                </div>
                <div className="admin-input-group" style={{ marginBottom: 0 }}>
                  <label style={{ color: "#94a3b8" }}>Delivery Operations Zone</label>
                  <input type="text" className="admin-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} required value={regZone} onChange={(e) => setRegZone(e.target.value)} placeholder="Guntur City & Amaravati" />
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn-admin"
              style={{
                marginTop: "10px",
                padding: "12px",
                fontSize: "0.9rem",
                fontWeight: "700",
                backgroundColor: theme.color,
                color: "#fff",
                border: "none",
                cursor: "pointer",
                borderRadius: "8px"
              }}
            >
              Complete Registration & Login
            </button>

            <div style={{ textAlign: "center", marginTop: "4px", fontSize: "0.8rem", color: "#94a3b8" }}>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setErrorMsg("");
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: theme.color,
                  fontWeight: "700",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Sign In Instead
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
