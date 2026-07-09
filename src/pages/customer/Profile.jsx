import React, { useState } from "react";
import { useDb } from "../../context/DbContext";
import { Stars } from "../../components/common/Stars";
import { Award, User, RefreshCw, Calendar, Eye, CreditCard } from "lucide-react";

export const Profile = ({ setPage, setSelectedProductId }) => {
  const {
    currentUser,
    orders,
    subscriptions,
    products,
    toggleSubStatus,
    updateProfile,
    addToCart,
    addSubscription,
    t
  } = useDb();

  const [activeSubTab, setActiveSubTab] = useState("subs");
  const [depositAmount, setDepositAmount] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [newCard, setNewCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [savedCards, setSavedCards] = useState([
    { id: 1, type: "Visa Debit", number: "**** **** **** 4321", name: "Vijay Kumar", expiry: "12/29" }
  ]);

  const [editName, setEditName] = useState(currentUser?.name || "");
  const [editPhone, setEditPhone] = useState(currentUser?.phone || "");
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || "");
  const [newStreet, setNewStreet] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newCity, setNewCity] = useState("Vijayawada");
  const [newPincode, setNewPincode] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    updateProfile({
      ...currentUser,
      name: editName,
      phone: editPhone,
      avatar: editAvatar
    });
    alert("Profile information updated successfully!");
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newStreet || !newPincode) return;

    const newAddr = {
      street: newStreet,
      area: newArea,
      city: newCity,
      pincode: newPincode
    };

    updateProfile({
      ...currentUser,
      addresses: [...currentUser.addresses, newAddr]
    });

    setNewStreet("");
    setNewArea("");
    setNewPincode("");
    setShowAddressForm(false);
    alert("Shipping address registered successfully!");
  };

  const handleDeposit = () => {
    const amt = Number(depositAmount);
    if (!amt || amt <= 0) return;
    
    const currentBalance = currentUser?.walletBalance !== undefined ? currentUser.walletBalance : 250;
    updateProfile({
      ...currentUser,
      walletBalance: currentBalance + amt
    });
    setDepositAmount("");
    alert(`Wallet deposit of ₹${amt} successful!`);
  };

  const handleLinkCard = (e) => {
    e.preventDefault();
    if (!newCard.number || !newCard.name) return;

    setSavedCards(prev => [
      ...prev,
      {
        id: Date.now(),
        type: newCard.number.startsWith("4") ? "Visa" : "Mastercard",
        number: "**** **** **** " + newCard.number.slice(-4),
        name: newCard.name,
        expiry: newCard.expiry
      }
    ]);
    setNewCard({ name: "", number: "", expiry: "", cvv: "" });
    setShowCardForm(false);
    alert("Payment card linked successfully!");
  };

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <h3>Please log in to view your profile.</h3>
      </div>
    );
  }

  // Filter orders and subscriptions for this customer
  const customerOrders = orders.filter(o => o.customerId === currentUser.id);
  const customerSubs = subscriptions.filter(s => s.customerId === currentUser.id);

  const handleReorder = (order) => {
    order.items.forEach(item => {
      const productObj = products.find(p => p.id === item.productId);
      if (productObj) {
        addToCart(productObj, item.quantity);
      }
    });
    alert("Items from this order added to your cart!");
    setPage("cart");
  };

  const handleDietToggle = (prefKey) => {
    const updatedPreferences = {
      ...currentUser.dietPreferences,
      [prefKey]: !currentUser.dietPreferences[prefKey]
    };
    updateProfile({
      ...currentUser,
      dietPreferences: updatedPreferences
    });
  };

  return (
    <div className="container" style={{ padding: "40px 16px", animation: "fadeIn 0.3s ease-out" }}>
      {/* Profile Header */}
      <div className="portal-card flex justify-between align-center" style={{ flexWrap: "wrap", gap: "16px" }}>
        <div className="flex align-center gap-md">
          <img src={currentUser.avatar} alt={currentUser.name} style={{ width: "80px", height: "80px", borderRadius: "50%", border: "2.5px solid var(--c-primary)", objectFit: "cover" }} />
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: "800" }}>{currentUser.name}</h2>
            <span style={{ fontSize: "0.85rem", color: "var(--c-text-muted)" }}>{currentUser.email} | {currentUser.phone}</span>
          </div>
        </div>

        {/* Loyalty Points */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backgroundColor: "var(--c-primary-light)",
          padding: "16px 20px",
          borderRadius: "12px",
          border: "1.5px solid var(--c-primary)"
        }}>
          <Award size={36} color="var(--c-accent)" />
          <div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "700", color: "var(--c-primary)" }}>
              {t("VNatural Loyalty Balance", "లాయల్టీ పాయింట్ల నిల్వ")}
            </span>
            <strong style={{ display: "block", fontSize: "1.5rem", color: "var(--c-primary)", fontFamily: "var(--font-display)" }}>
              {currentUser.loyaltyPoints} {t("Points", "పాయింట్లు")}
            </strong>
          </div>
        </div>
      </div>

      {/* Grid: Left column (diet preferences) / Right column (Subscriptions & orders) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px", marginTop: "24px" }}>
        {/* Left Side: Preferences */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="portal-card">
            <h3 className="portal-title" style={{ fontSize: "1.1rem" }}>{t("Diet & Health Preferences", "ఆరోగ్య ప్రాధాన్యతలు")}</h3>
            <p style={{ fontSize: "0.8rem", color: "var(--c-text-muted)", marginBottom: "16px" }}>
              {t("VNatural AI uses these preferences to highlight relevant foods and recipes in the catalog and chat widget.", 
                 "మా AI అసిస్టెంట్ ఇక్కడ మీరు ఎంచుకున్న ప్రాధాన్యతల ఆధారంగా సిఫార్సులు చేస్తుంది.")}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { key: "diabeticAware", label: t("Diabetic Friendly Suggestions", "డయాబెటిస్-ఫ్రెండ్లీ") },
                { key: "highProtein", label: t("High Protein Focus", "అధిక ప్రోటీన్ ఆహారం") },
                { key: "vegan", label: t("Vegan Diet Items Only", "కేవలం శాకాహార వస్తువులు") },
                { key: "glutenFree", label: t("Gluten-Free Grains Only", "గ్లూటెన్ లేని చిరుధాన్యాలు") }
              ].map((pref) => (
                <label key={pref.key} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.85rem" }}>
                  <input
                    type="checkbox"
                    checked={currentUser.dietPreferences[pref.key] || false}
                    onChange={() => handleDietToggle(pref.key)}
                    className="checklist-checkbox"
                    style={{ width: "16px", height: "16px" }}
                  />
                  <span>{pref.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Sub Tab Navigation */}
          <div style={{ display: "flex", gap: "16px", borderBottom: "1.5px solid var(--c-border)", paddingBottom: "10px", marginBottom: "10px" }}>
            <button
              onClick={() => setActiveSubTab("subs")}
              style={{
                fontWeight: "700",
                color: activeSubTab === "subs" ? "var(--c-primary)" : "var(--c-text-muted)",
                borderBottom: activeSubTab === "subs" ? "2.5px solid var(--c-primary)" : "none",
                paddingBottom: "8px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {t("Subscriptions & History", "చందాలు & కొనుగోళ్ళు")}
            </button>
            <button
              onClick={() => setActiveSubTab("wallet")}
              style={{
                fontWeight: "700",
                color: activeSubTab === "wallet" ? "var(--c-primary)" : "var(--c-text-muted)",
                borderBottom: activeSubTab === "wallet" ? "2.5px solid var(--c-primary)" : "none",
                paddingBottom: "8px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {t("Payments & Wallet", "వాలెట్ & పేమెంట్లు")}
            </button>
            <button
              onClick={() => setActiveSubTab("info")}
              style={{
                fontWeight: "700",
                color: activeSubTab === "info" ? "var(--c-primary)" : "var(--c-text-muted)",
                borderBottom: activeSubTab === "info" ? "2.5px solid var(--c-primary)" : "none",
                paddingBottom: "8px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {t("Personal Details", "వ్యక్తిగత వివరాలు")}
            </button>
          </div>

          {activeSubTab === "subs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Subscriptions */}
          <div className="portal-card">
            <h3 className="portal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Calendar size={20} /> {t("Manage Active Subscriptions", "నెలవారీ సబ్‌స్క్రిప్షన్ల నిర్వహణ")}
            </h3>
            
            {customerSubs.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {customerSubs.map((sub) => (
                  <div key={sub.id} style={{
                    border: "1px solid var(--c-border)",
                    padding: "16px",
                    borderRadius: "10px",
                    backgroundColor: sub.status === "active" ? "#fbfbfa" : "#f1f1f0",
                    opacity: sub.status === "active" ? 1 : 0.7,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div>
                      <strong style={{ display: "block", fontSize: "1rem" }}>{sub.productName}</strong>
                      <span style={{ fontSize: "0.8rem", color: "var(--c-text-muted)", display: "block", margin: "2px 0 6px" }}>
                        {t("Quantity: ", "పరిమాణం: ")}{sub.quantity} units | {t("Interval: ", "డెలివరీ: ")}{t(sub.frequency.toUpperCase(), sub.frequency === "weekly" ? "ప్రతి వారం" : "ప్రతి నెల")}
                      </span>
                      <span style={{ fontSize: "0.75rem", backgroundColor: "var(--c-primary-light)", color: "var(--c-primary)", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>
                        {t("Next Delivery: ", "తదుపరి డెలివరీ: ")}{sub.nextDelivery}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {sub.status === "active" ? (
                        <button
                          onClick={() => toggleSubStatus(sub.id, "paused")}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            backgroundColor: "var(--warning)",
                            color: "#fff",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          {t("Pause", "తాత్కాలికంగా ఆపు")}
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleSubStatus(sub.id, "active")}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            backgroundColor: "var(--success)",
                            color: "#fff",
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          {t("Resume", "మళ్లీ ప్రారంభించు")}
                        </button>
                      )}

                      <button
                        onClick={() => toggleSubStatus(sub.id, "cancelled")}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid var(--error)",
                          color: "var(--error)",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        {t("Cancel", "రద్దు చేయి")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--c-text-muted)", fontSize: "0.85rem" }}>
                {t("You have no active subscription cycles. Save 15% on daily grocery staples by choosing subscription delivery in checkout.", 
                   "మీకు ఎలాంటి సబ్‌స్క్రిప్షన్లు లేవు. 15% రాయితీ కొరకు చెక్అవుట్‌లో చందా ఎంచుకోండి.")}
              </p>
            )}
          </div>

          {/* Available Subscription Packages */}
          <div className="portal-card" style={{ marginTop: "10px" }}>
            <h3 className="portal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Calendar size={20} /> {t("Explore Available Subscription Plans", "మరిన్ని సబ్‌స్క్రిప్షన్ ప్లాన్లు")}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--c-text-muted)", marginBottom: "16px" }}>
              {t("Choose a recurring delivery plan and save 15% on regular prices. Automated delivery at your preferred intervals.", 
                 "నిరంతర సరఫరా కొరకు సబ్‌స్క్రిప్షన్ ప్లాన్ ఎంచుకోండి, సాధారణ ధరలకంటే 15% ఆదా చేసుకోండి.")}
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { id: "p6", name: t("Daily Farm Eggs Subscription", "రోజువారీ కోడిగుడ్ల సబ్‌స్క్రిప్షన్"), desc: "6 Country Eggs delivered fresh every week.", price: 110, frequency: "weekly" },
                { id: "p1", name: t("Monthly Sonamasuri Rice Staples", "నెలవారీ సోనామసూరి బియ్యం"), desc: "5kg unpolished organic rice delivered monthly.", price: 85, frequency: "monthly" },
                { id: "p2", name: t("Weekly Pure Cow Ghee Plan", "వారపు స్వచ్ఛమైన ఆవు నెయ్యి"), desc: "500ml pure Bilona A2 ghee delivered weekly.", price: 420, frequency: "weekly" },
                { id: "p3", name: t("Bi-Weekly High Protein Moong Dal", "ద్వైవార పెసరపప్పు సబ్‌స్క్రిప్షన్"), desc: "1kg high protein moong dal delivered every 2 weeks.", price: 155, frequency: "weekly" }
              ].map(plan => {
                const alreadySubbed = customerSubs.some(s => s.productId === plan.id && s.status === "active");
                return (
                  <div key={plan.id} style={{
                    border: "1.5px dashed var(--c-primary-light)",
                    borderRadius: "10px",
                    padding: "16px",
                    backgroundColor: "#fcfdfc",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "10px"
                  }}>
                    <div>
                      <div className="flex justify-between align-center">
                        <strong style={{ fontSize: "0.95rem", color: "var(--c-primary)" }}>{plan.name}</strong>
                        <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--c-accent)" }}>
                          {plan.frequency}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--c-text-muted)", margin: "6px 0" }}>
                        {plan.desc}
                      </p>
                    </div>
                    <div className="flex justify-between align-center" style={{ borderTop: "1px solid var(--c-border)", paddingTop: "10px", marginTop: "4px" }}>
                      <div>
                        <span style={{ fontSize: "0.7rem", color: "var(--c-text-muted)", display: "block" }}>Billed Rate</span>
                        <strong style={{ fontSize: "1.1rem", color: "var(--c-text)" }}>₹{plan.price}</strong>
                      </div>
                      <button
                        disabled={alreadySubbed}
                        onClick={() => {
                          addSubscription(plan.id, 1, plan.frequency);
                          alert(`Subscription for ${plan.name} created successfully! Billed recurringly.`);
                        }}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          backgroundColor: alreadySubbed ? "var(--c-border)" : "var(--c-primary)",
                          color: "#fff",
                          border: "none",
                          fontSize: "0.75rem",
                          fontWeight: "700",
                          cursor: alreadySubbed ? "not-allowed" : "pointer"
                        }}
                      >
                        {alreadySubbed ? t("Active Plan", "ప్రస్తుతం అమల్లో ఉంది") : t("Subscribe Now", "సబ్‌స్క్రయిబ్ చేసుకో")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Past Orders */}
          <div className="portal-card">
            <h3 className="portal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={20} /> {t("Order Sourcing History", "కొనుగోలు చరిత్ర")}
            </h3>
            
            {customerOrders.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {customerOrders.map((ord) => (
                  <div key={ord.id} style={{
                    border: "1px solid var(--c-border)",
                    padding: "16px",
                    borderRadius: "10px",
                    backgroundColor: "var(--c-bg-pure)"
                  }}>
                    <div className="flex justify-between align-center" style={{ marginBottom: "10px", borderBottom: "1px solid var(--c-border)", paddingBottom: "8px" }}>
                      <div>
                        <strong>{ord.id}</strong>
                        <span style={{ fontSize: "0.8rem", color: "var(--c-text-muted)", marginLeft: "12px" }}>
                          {new Date(ord.date).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`admin-badge ${ord.status}`} style={{ fontSize: "0.7rem" }}>{ord.status}</span>
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "var(--c-text-muted)", marginBottom: "10px" }}>
                      {ord.items.map((item, idx) => (
                        <div key={idx}>{item.quantity}x {item.name}</div>
                      ))}
                    </div>

                    <div className="flex justify-between align-center">
                      <div>
                        <span style={{ fontSize: "0.8rem", color: "var(--c-text-muted)" }}>{t("Amount Paid", "చెల్లించిన బిల్లు")}: </span>
                        <strong style={{ color: "var(--c-primary)", fontFamily: "var(--font-display)" }}>₹{ord.total}</strong>
                      </div>
                      
                      <div style={{ display: "flex", gap: "8px" }}>
                        {ord.status === "delivered" && (
                          <button
                            className="btn-accent"
                            onClick={() => handleReorder(ord)}
                            style={{ padding: "4px 10px", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}
                          >
                            <RefreshCw size={12} /> {t("Reorder Again", "మళ్లీ ఆర్డర్")}
                          </button>
                        )}
                        <span style={{ fontSize: "0.75rem", padding: "4px 8px", backgroundColor: "#f1f5f9", borderRadius: "4px", display: "inline-block" }}>
                          OTP: <strong>{ord.otp}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--c-text-muted)", fontSize: "0.85rem" }}>{t("No orders placed yet.", "ఇంకా ఎలాంటి ఆర్డర్లు చేయలేదు.")}</p>
            )}
          </div>
          </div>
          )}

          {activeSubTab === "wallet" && (
            /* WALLET & PAYMENTS VIEW */
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fadeIn 0.2s" }}>
              {/* Wallet Balance Card */}
              <div className="portal-card" style={{
                background: "linear-gradient(135deg, var(--c-primary) 0%, var(--c-primary-hover) 100%)",
                color: "#fff",
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "var(--shadow-md)"
              }}>
                <span style={{ fontSize: "0.85rem", textTransform: "uppercase", opacity: 0.8, fontWeight: "700" }}>
                  {t("VNatural Digital Wallet Balance", "వి.నేచురల్ డిజిటల్ వాలెట్ నిల్వ")}
                </span>
                <h2 style={{ fontSize: "2.5rem", fontFamily: "var(--font-display)", fontWeight: "800", marginTop: "8px", color: "var(--c-accent)" }}>
                  ₹{currentUser.walletBalance !== undefined ? currentUser.walletBalance : 250}
                </h2>
                <p style={{ fontSize: "0.75rem", opacity: 0.8, marginTop: "12px" }}>
                  * {t("Select your digital wallet at checkout for fast 1-click orders.", "వేగవంతమైన ఆర్డర్ల కోసం చెక్అవుట్‌లో డిజిటల్ వాలెట్‌ను ఎంచుకోండి.")}
                </p>
              </div>

              {/* Add funds Form */}
              <div className="portal-card">
                <h3 className="portal-title">{t("Deposit Wallet Funds", "వాలెట్‌లో డబ్బులు జమచేయండి")}</h3>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                  <div className="portal-form-group" style={{ flexGrow: 1, marginBottom: 0 }}>
                    <label className="portal-label">{t("Deposit Amount (₹)", "డబ్బు పరిమాణం (₹)")}</label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      className="portal-input"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </div>
                  <button className="btn-primary" onClick={handleDeposit} style={{ height: "42px" }}>
                    {t("Add Funds", "జమచేయి")}
                  </button>
                </div>
              </div>

              {/* Saved Cards */}
              <div className="portal-card">
                <div className="flex justify-between align-center" style={{ marginBottom: "16px" }}>
                  <h3 className="portal-title" style={{ margin: 0 }}>{t("Saved Debit & Credit Cards", "భద్రపరచిన కార్డ్‌ల వివరాలు")}</h3>
                  <button className="btn-portal" onClick={() => setShowCardForm(true)} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
                    + {t("Link Card", "కార్డ్‌ని జతచేయి")}
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {savedCards.map(card => (
                    <div key={card.id} style={{
                      border: "1px solid var(--c-border)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#fbfbfa"
                    }}>
                      <div>
                        <strong>{card.type} Card ({card.number.slice(-4)})</strong>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "var(--c-text-muted)" }}>
                          Holder: {card.name} | Expires: {card.expiry}
                        </span>
                      </div>
                      <button 
                        onClick={() => setSavedCards(prev => prev.filter(c => c.id !== card.id))}
                        style={{ color: "var(--error)", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer" }}
                      >
                        {t("Remove", "తొలగించు")}
                      </button>
                    </div>
                  ))}
                </div>

                {showCardForm && (
                  <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: "360px" }}>
                      <div className="flex justify-between align-center" style={{ borderBottom: "1.5px solid var(--p-border)", paddingBottom: "10px", marginBottom: "16px" }}>
                        <h3 style={{ color: "var(--c-primary)" }}>{t("Link Debit/Credit Card", "కార్డ్‌ని జతచేయుట")}</h3>
                        <button onClick={() => setShowCardForm(false)}>✕</button>
                      </div>

                      <form onSubmit={handleLinkCard}>
                        <div className="portal-form-group">
                          <label className="portal-label">Cardholder Name</label>
                          <input type="text" className="portal-input" required value={newCard.name} onChange={(e) => setNewCard({...newCard, name: e.target.value})} />
                        </div>
                        <div className="portal-form-group">
                          <label className="portal-label">Card Number</label>
                          <input type="text" className="portal-input" required placeholder="XXXX XXXX XXXX XXXX" maxLength={19} value={newCard.number} onChange={(e) => setNewCard({...newCard, number: e.target.value})} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div className="portal-form-group">
                            <label className="portal-label">Expiry MM/YY</label>
                            <input type="text" className="portal-input" required placeholder="12/29" value={newCard.expiry} onChange={(e) => setNewCard({...newCard, expiry: e.target.value})} />
                          </div>
                          <div className="portal-form-group">
                            <label className="portal-label">CVV PIN</label>
                            <input type="password" className="portal-input" required maxLength={3} placeholder="***" value={newCard.cvv} onChange={(e) => setNewCard({...newCard, cvv: e.target.value})} />
                          </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "12px" }}>
                          {t("Save Card Info", "కార్డ్‌ను భద్రపరుచు")}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSubTab === "info" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", animation: "fadeIn 0.2s" }}>
              {/* Account details card */}
              <div className="portal-card">
                <h3 className="portal-title">{t("Edit Personal Information", "వ్యక్తిగత సమాచార సవరణ")}</h3>
                <form onSubmit={handleUpdateInfo} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="portal-form-group">
                    <label className="portal-label">Full Account Name</label>
                    <input type="text" className="portal-input" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                  </div>
                  <div className="portal-form-group">
                    <label className="portal-label">Contact Phone Number</label>
                    <input type="text" className="portal-input" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
                  </div>
                  <div className="portal-form-group">
                    <label className="portal-label">Upload Profile Avatar File</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ fontSize: "0.8rem", color: "var(--c-text-muted)" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditAvatar(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                  </div>
                  <div className="portal-form-group">
                    <label className="portal-label">Registered Email (Read-Only)</label>
                    <input type="email" className="portal-input" value={currentUser?.email || ""} disabled style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed" }} />
                  </div>
                  <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start", padding: "10px 20px" }}>
                    {t("Update Information", "సమాచారాన్ని సేవ్ చేయి")}
                  </button>
                </form>
              </div>

              {/* Shipping Addresses card */}
              <div className="portal-card">
                <div className="flex justify-between align-center" style={{ marginBottom: "16px" }}>
                  <h3 className="portal-title" style={{ margin: 0 }}>{t("Registered Shipping Addresses", "రిజిస్టర్ చేయబడిన చిరునామాలు")}</h3>
                  <button className="btn-portal" onClick={() => setShowAddressForm(true)} style={{ padding: "4px 8px", fontSize: "0.75rem" }}>
                    + {t("Add Address", "కొత్త చిరునామా")}
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {(currentUser?.addresses || []).map((addr, idx) => (
                    <div key={idx} style={{
                      border: "1px solid var(--c-border)",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "#fbfbfa",
                      fontSize: "0.85rem"
                    }}>
                      <strong style={{ display: "block", color: "var(--c-primary)", marginBottom: "4px" }}>
                        Address Slot #{idx + 1} {idx === 0 && "(Default)"}
                      </strong>
                      <div style={{ color: "var(--c-text-muted)", lineHeight: "1.4" }}>
                        {addr.street}, {addr.area}<br/>
                        {addr.city} - {addr.pincode}
                      </div>
                    </div>
                  ))}
                </div>

                {showAddressForm && (
                  <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: "360px" }}>
                      <div className="flex justify-between align-center" style={{ borderBottom: "1.5px solid var(--p-border)", paddingBottom: "10px", marginBottom: "16px" }}>
                        <h3 style={{ color: "var(--c-primary)" }}>{t("Add New Shipping Address", "కొత్త చిరునామాను జతచేయుట")}</h3>
                        <button onClick={() => setShowAddressForm(false)}>✕</button>
                      </div>

                      <form onSubmit={handleAddAddress}>
                        <div className="portal-form-group">
                          <label className="portal-label">Street / House No.</label>
                          <input type="text" className="portal-input" required value={newStreet} onChange={(e) => setNewStreet(e.target.value)} />
                        </div>
                        <div className="portal-form-group">
                          <label className="portal-label">Landmark / Area</label>
                          <input type="text" className="portal-input" value={newArea} onChange={(e) => setNewArea(e.target.value)} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "10px" }}>
                          <div className="portal-form-group">
                            <label className="portal-label">City State</label>
                            <input type="text" className="portal-input" required value={newCity} onChange={(e) => setNewCity(e.target.value)} />
                          </div>
                          <div className="portal-form-group">
                            <label className="portal-label">Pincode</label>
                            <input type="text" className="portal-input" required maxLength={6} placeholder="520001" value={newPincode} onChange={(e) => setNewPincode(e.target.value)} />
                          </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "12px" }}>
                          {t("Save Address", "చిరునామాను భద్రపరుచు")}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
