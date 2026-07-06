import React, { useState } from "react";
import { useDb } from "../../context/DbContext";
import { 
  Wheat, Plus, DollarSign, Award, Clock, FileText, CheckCircle2, 
  X, ShieldAlert, BookOpen, Send, HelpCircle, User, MessageSquare, 
  MapPin, Sliders, TrendingUp, Layers, Check, FileInput, Calendar,
  Info, Eye, Trash2, ArrowRight, RotateCw, Sparkles, Filter, ChevronRight,
  TrendingDown, ShieldCheck, Map, Smartphone, Download, Search, Bell, Globe,
  Briefcase, Activity, CheckSquare
} from "lucide-react";

export const FarmerPortal = () => {
  const { currentUser, procurements, submitProcurementOffer, updateProfile, logout, t } = useDb();

  // Navigation state
  const [activeTab, setActiveTab] = useState("dashboard");

  // Form & Wizard state
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [editingCropId, setEditingCropId] = useState(null);

  // Wizard Form Fields
  const [wName, setWName] = useState("");
  const [wCategory, setWCategory] = useState("rice");
  const [wQty, setWQty] = useState("");
  const [wPrice, setWPrice] = useState("");
  const [wHarvestDate, setWHarvestDate] = useState("");
  const [wPickupDate, setWPickupDate] = useState("");
  const [wStorage, setWStorage] = useState("dry");
  const [wCertifications, setWCertifications] = useState(["PGS Organic"]);
  const [wImage, setWImage] = useState("");
  const [wNotes, setWNotes] = useState("");

  // Live status tracking
  const [documents, setDocuments] = useState([
    { id: "doc_1", name: "PGS Organic Certificate", status: "VERIFIED", expiry: "2027-04-12", date: "2026-07-01", file: "pgs_cert_2026.pdf" },
    { id: "doc_2", name: "Land Lease Verification", status: "VERIFIED", expiry: "2029-12-31", date: "2026-07-02", file: "lease_doc.pdf" },
    { id: "doc_3", name: "Soil Quality Lab Report", status: "PENDING", expiry: "2026-09-15", date: "2026-07-05", file: "" }
  ]);

  const [activePickups, setActivePickups] = useState([
    { id: "PKP_102", driver: "Kalyan Kumar", vehicle: "AP-07-TV-4521", eta: "Tomorrow, 10:00 AM", status: "Assigned", warehouse: "Vijayawada Hub" }
  ]);

  const [procurementRequests, setProcurementRequests] = useState([
    { id: "REQ_401", item: "Organic Sonamasuri Rice", qty: "500 kg", targetPrice: "₹82/kg", status: "pending", date: "2026-07-10" },
    { id: "REQ_402", item: "Ancient Ragi Flour", qty: "300 kg", targetPrice: "₹75/kg", status: "pending", date: "2026-07-12" }
  ]);

  const [invoices, setInvoices] = useState([
    { id: "INV_9081", date: "2026-07-02", amount: 33120, method: "HDFC Bank (Direct Deposit)", file: "invoice_9081.pdf" }
  ]);

  const [qaReports, setQaReports] = useState([
    { id: "QA_8021", date: "2026-07-04", status: "Approved (Grade A)", inspector: "Rama Rao", moisture: "12.4%", weight: "500 kg", remarks: "Excellent grain quality, optimal moisture level below 14% threshold." }
  ]);

  // Messages thread states
  const [activeChatChannel, setActiveChatChannel] = useState("Procurement");
  const [messages, setMessages] = useState([
    { id: 1, sender: "admin", text: "Namaste Keshav Garu, your Basmati rice batch looks excellent. Warehouse team has confirmed receipt.", date: "2026-07-04 11:30 AM", channel: "Procurement" }
  ]);
  const [msgInput, setMsgInput] = useState("");

  // AI Farm Advisor states
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "VNatural AI Advisor active. Ask me about crop yields, weather forecasts, or PGS certification compliance." }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Profile states
  const [editName, setEditName] = useState(currentUser?.name || "");
  const [editPhone, setEditPhone] = useState(currentUser?.phone || "");
  const [editFarmName, setEditFarmName] = useState(currentUser?.farmName || "Nalgonda Eco-Organic Farms");
  const [editFarmLocation, setEditFarmLocation] = useState(currentUser?.farmLocation || "Nalgonda Rural, AP");
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || "");

  if (!currentUser || currentUser.role !== "farmer") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyCenter: "center", padding: "40px" }}>
        <div style={{ maxWidth: "450px", width: "100%", backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "30px", textAlign: "center", margin: "auto" }}>
          <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: "16px" }} />
          <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "700" }}>Farmer Access Denied</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "10px 0 20px" }}>Authorized partner credentials required.</p>
        </div>
      </div>
    );
  }

  // Filter listings
  const farmerProcurements = procurements.filter(p => p.farmerId === currentUser.id);

  // Financial calculations
  const totalPaidRevenue = farmerProcurements
    .filter(p => p.status === "approved")
    .reduce((sum, p) => sum + (p.quantity * p.pricePerKg), 0);

  const pendingPayments = farmerProcurements
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + (p.quantity * p.pricePerKg), 0);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfile({
      ...currentUser,
      name: editName,
      phone: editPhone,
      farmName: editFarmName,
      farmLocation: editFarmLocation,
      avatar: editAvatar
    });
    alert("Farm profile updated successfully!");
  };

  // Crop Wizard Logic
  const handleOpenWizard = (crop = null) => {
    if (crop) {
      setEditingCropId(crop.id);
      setWName(crop.productName);
      setWCategory(crop.category);
      setWQty(crop.quantity);
      setWPrice(crop.pricePerKg);
      setWHarvestDate(crop.date);
      setWPickupDate("");
      setWStorage("dry");
      setWCertifications(["PGS Organic"]);
      setWImage("");
      setWNotes(crop.description || "");
    } else {
      setEditingCropId(null);
      setWName("");
      setWCategory("rice");
      setWQty("");
      setWPrice("");
      setWHarvestDate("");
      setWPickupDate("");
      setWStorage("dry");
      setWCertifications(["PGS Organic"]);
      setWImage("");
      setWNotes("");
    }
    setWizardStep(1);
    setShowWizardModal(true);
  };

  const handleOpenOfferModal = (crop = null) => {
    handleOpenWizard(crop);
  };

  const handleDeleteOffer = (cropId) => {
    alert("Crop yield offer marked for archive successfully!");
  };

  const getCropImageUrl = (name = "", category = "") => {
    const n = name.toLowerCase();
    const c = category.toLowerCase();
    
    if (n.includes("rice") || c.includes("rice")) {
      return "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop";
    }
    if (n.includes("ghee") || c.includes("ghee") || c.includes("oil")) {
      return "https://images.unsplash.com/photo-1627915558017-68c0780d6599?q=80&w=600&auto=format&fit=crop";
    }
    if (n.includes("dal") || n.includes("lentil") || c.includes("dals") || c.includes("pulses")) {
      return "https://images.unsplash.com/photo-1547058886-af77992d478c?q=80&w=600&auto=format&fit=crop";
    }
    if (n.includes("ragi") || n.includes("millet") || c.includes("grains") || c.includes("ancient")) {
      return "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop";
    }
    if (n.includes("turmeric") || n.includes("spice") || n.includes("powder")) {
      return "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600&auto=format&fit=crop";
    }
    return "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=600&auto=format&fit=crop";
  };

  const handleNextStep = () => {
    if (wizardStep < 7) setWizardStep(wizardStep + 1);
  };

  const handlePrevStep = () => {
    if (wizardStep > 1) setWizardStep(wizardStep - 1);
  };

  const handleWizardSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: editingCropId || `proc_${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      productName: wName,
      teluguName: wName,
      category: wCategory,
      quantity: Number(wQty),
      pricePerKg: Number(wPrice),
      date: wHarvestDate || new Date().toISOString().split("T")[0],
      status: "pending",
      description: wNotes
    };

    submitProcurementOffer(payload);
    setShowWizardModal(false);
    alert(`Crop offer ${editingCropId ? "modified" : "submitted"} successfully!`);
  };

  const handleDocumentUpload = (docId, e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments(prev => prev.map(d => {
        if (d.id === docId) {
          return { ...d, file: file.name, status: "SUBMITTED", date: new Date().toISOString().split("T")[0] };
        }
        return d;
      }));
      alert(`PGS Certificate draft stored: ${file.name}`);
    }
  };

  const handleAcceptRequest = (reqId) => {
    setProcurementRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "accepted" } : r));
    alert("Procurement contract accepted! Scheduling harvest window.");
  };

  const handleMsgSend = (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "farmer",
      text: msgInput.trim(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: activeChatChannel
    };

    setMessages([...messages, newMsg]);
    setMsgInput("");

    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          sender: "admin", 
          text: `Acknowledged for ${activeChatChannel} team. Sourcing managers have been notified.`, 
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          channel: activeChatChannel
        }
      ]);
    }, 1500);
  };

  const handleAiChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      let reply = "Processing mandi data coordinates...";
      const lower = userMsg.toLowerCase();

      if (lower.includes("price") || lower.includes("rate") || lower.includes("mandi")) {
        reply = "Today's Mandi index: Organic Sonamasuri at Nizamabad is ₹8,200/quintal (steady). Ragi at Warangal Grains Mandi is ₹4,200/quintal (up 1.8%). Basmati premium is ₹11,500/quintal.";
      } else if (lower.includes("harvest") || lower.includes("grow") || lower.includes("demand")) {
        reply = "High demand is forecasted for Ragi Millets and Basmati Rice over the next 20 days. Harvesting millets now is recommended due to soil moisture margins.";
      } else if (lower.includes("fertilizer") || lower.includes("compost")) {
        reply = "For organic certification compliance under PGS standards, use only farmyard manure, vermicompost, and bio-fertilizers like Azotobacter. Avoid chemical additives.";
      } else if (lower.includes("weather") || lower.includes("rain")) {
        reply = "Nizamabad Rural weather forecast: Light showers expected on Thursday. Secure harvested crop bags in dry storages.";
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: reply }]);
    }, 800);
  };

  return (
    <div style={{ backgroundColor: "#F7F8FA", minHeight: "100vh", color: "#111827", fontFamily: "var(--font-sans)", display: "flex", flexDirection: "column", paddingTop: "36px" }}>
      
      {/* PREMIUM TOP NAVIGATION BAR */}
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "12px 24px", 
        backgroundColor: "#111827", 
        borderBottom: "1px solid #1f2937",
        position: "sticky",
        top: "36px",
        zIndex: 50,
        color: "#fff"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Wheat size={22} color="#16A34A" />
          <div>
            <h1 style={{ fontSize: "1rem", fontWeight: "800", color: "#fff", margin: 0 }}>VNatural Agritech Platform</h1>
            <span style={{ fontSize: "0.65rem", color: "#9ca3af" }}>Nalgonda Sourcing Node</span>
          </div>
        </div>

        {/* Top actions/search */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#1f2937", padding: "4px 10px", borderRadius: "16px", fontSize: "0.75rem", color: "#9ca3af" }}>
            <span>Season:</span>
            <strong style={{ color: "#16A34A" }}>Kharif 2026</strong>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ fontSize: "0.75rem", display: "flex", flexDirection: "column" }}>
              <strong style={{ color: "#fff" }}>{currentUser.name}</strong>
              <span style={{ fontSize: "0.6rem", color: "#16A34A" }}>● Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* CORE WORKSPACE PANEL */}
      <div style={{ display: "flex", flexGrow: 1, position: "relative" }}>
        
        {/* DESKTOP SIDEBAR */}
        <aside style={{ 
          width: "240px", 
          backgroundColor: "#0F172A", 
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          padding: "20px 0",
          gap: "4px",
          flexShrink: 0
        }} className="desktop-sidebar">
          {[
            { id: "dashboard", label: "Overview Dashboard", icon: <Sliders size={16} /> },
            { id: "crops", label: "Crop Management", icon: <Layers size={16} /> },
            { id: "planner", label: "AI Demand Planner", icon: <TrendingUp size={16} /> },
            { id: "qa", label: "Inspections Audit", icon: <Activity size={16} /> },
            { id: "logistics", label: "Logistics Progress", icon: <Map size={16} /> },
            { id: "docs", label: "Document Center", icon: <FileText size={16} /> },
            { id: "finance", label: "Payment Dashboard", icon: <DollarSign size={16} /> },
            { id: "messenger", label: "Support Messenger", icon: <MessageSquare size={16} /> },
            { id: "ai-assistant", label: "AI Advisor Chat", icon: <Sparkles size={16} /> },
            { id: "profile", label: "Profile Registration", icon: <User size={16} /> }
          ].map(menu => (
            <button
              key={menu.id}
              onClick={() => setActiveTab(menu.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 24px",
                width: "100%",
                backgroundColor: activeTab === menu.id ? "rgba(22,163,74,0.1)" : "transparent",
                color: activeTab === menu.id ? "#16A34A" : "#94a3b8",
                border: "none",
                textAlign: "left",
                fontSize: "0.85rem",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {menu.icon} {menu.label}
            </button>
          ))}
        </aside>

        {/* MAIN WORKSPACE AREA */}
        <main style={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "dashboard" && (
            <div>
              {/* Premium KPI widgets */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                {[
                  { label: "Lifetime Earnings", val: `₹${totalPaidRevenue.toLocaleString("en-IN")}`, desc: "Direct settled payouts", icon: <DollarSign size={18} color="#16A34A" /> },
                  { label: "Pending Payments", val: `₹${pendingPayments.toLocaleString("en-IN")}`, desc: "Inspection audit approvals", icon: <Clock size={18} color="#F59E0B" /> },
                  { label: "Approved Crop Yields", val: `${farmerProcurements.filter(p => p.status === "approved").length} batches`, desc: "QA certified grades", icon: <CheckSquare size={18} color="#16A34A" /> },
                  { label: "PGS Document Status", val: "Verified", desc: "Compliance score: 100%", icon: <ShieldCheck size={18} color="#16A34A" /> }
                ].map((card, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      backgroundColor: "#fff", 
                      border: "1px solid #E5E7EB", 
                      borderRadius: "12px", 
                      padding: "18px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                    }}
                  >
                    <div style={{ display: "flex", justifyBetween: "true", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontSize: "0.7rem", color: "#6B7280", textTransform: "uppercase", fontWeight: "700" }}>{card.label}</span>
                      {card.icon}
                    </div>
                    <h3 style={{ fontSize: "1.6rem", fontWeight: "800", color: "#111827", margin: 0 }}>{card.val}</h3>
                    <span style={{ fontSize: "0.65rem", color: "#6B7280", display: "block", marginTop: "4px" }}>{card.desc}</span>
                  </div>
                ))}
              </div>

              {/* FARM HEALTH SECTION */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }} className="responsive-grid">
                
                <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#111827", marginBottom: "16px", borderBottom: "1px solid #F3F4F6", paddingBottom: "8px" }}>Farm Health Scorecard</h3>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", textAlign: "center" }}>
                    {[
                      { label: "Organic Score", score: "96%", desc: "PGS Compliant" },
                      { label: "QA Pass Rate", score: "100%", desc: "Grade A grains" },
                      { label: "Delivery SLA", score: "98%", desc: "On-time pickups" }
                    ].map((health, idx) => (
                      <div key={idx} style={{ padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "3px solid #16A34A", display: "flex", alignItems: "center", justifyCenter: "center", margin: "0 auto 8px", fontSize: "0.85rem", fontWeight: "800", color: "#16A34A" }}>
                          {health.score}
                        </div>
                        <strong style={{ fontSize: "0.75rem", color: "#111827", display: "block" }}>{health.label}</strong>
                        <span style={{ fontSize: "0.65rem", color: "#6B7280" }}>{health.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sourcing Opportunities */}
                <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#111827", marginBottom: "12px" }}>Smart Sourcing Demands</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.75rem" }}>
                    <div style={{ padding: "10px", backgroundColor: "rgba(34,197,94,0.05)", borderLeft: "3px solid #22C55E", borderRadius: "6px" }}>
                      <strong>High demand forecasted</strong>: Organic Sonamasuri Rice (expected rates: ₹82/kg). Submit offers.
                    </div>
                    <div style={{ padding: "10px", backgroundColor: "rgba(37,99,235,0.05)", borderLeft: "3px solid #2563EB", borderRadius: "6px" }}>
                      <strong>Weather Advisory</strong>: Scattered showers expected on Thursday. Secure packaging bins.
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: MY CROPS / CROP MANAGEMENT */}
          {activeTab === "crops" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Crop Management Catalog</h3>
                <button 
                  onClick={() => handleOpenOfferModal(null)}
                  style={{ backgroundColor: "#16A34A", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Plus size={14} /> Offer New Crop Yield
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                {farmerProcurements.map(crop => (
                  <div 
                    key={crop.id} 
                    style={{ 
                      backgroundColor: "#fff", 
                      border: "1px solid #E5E7EB", 
                      borderRadius: "12px", 
                      padding: "20px", 
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)" 
                    }}
                  >
                    <img 
                      src={getCropImageUrl(crop.productName, crop.category)} 
                      alt={crop.productName} 
                      style={{ width: "100%", height: "140px", borderRadius: "8px", objectFit: "cover", marginBottom: "12px", border: "1px solid #E5E7EB" }} 
                    />
                    <div style={{ display: "flex", justifyBetween: "true", borderBottom: "1px solid #F3F4F6", paddingBottom: "8px", marginBottom: "12px" }}>
                      <div>
                        <strong style={{ fontSize: "0.95rem", color: "#111827", display: "block" }}>{crop.productName}</strong>
                        <span style={{ fontSize: "0.7rem", color: "#6B7280" }}>ID: {crop.id}</span>
                      </div>
                      <span className={`admin-badge ${crop.status}`} style={{ fontSize: "0.65rem" }}>{crop.status}</span>
                    </div>

                    <div style={{ fontSize: "0.8rem", color: "#4B5563", display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                      <div>Offered quantity: <strong>{crop.quantity} kg</strong></div>
                      <div>Expected Price: <strong>₹{crop.pricePerKg}/kg</strong></div>
                      <div>Harvest date: <strong>{crop.date}</strong></div>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button 
                        onClick={() => handleOpenOfferModal(crop)}
                        style={{ flexGrow: 1, backgroundColor: "#fff", border: "1px solid #D1D5DB", color: "#374151", padding: "6px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", fontWeight: "700" }}
                      >
                        Edit Offer
                      </button>
                      <button 
                        onClick={() => handleDeleteOffer(crop.id)}
                        style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", padding: "6px" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SMART DEMAND PLANNER */}
          {activeTab === "planner" && (
            <div style={{ maxWidth: "800px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Smart Demand Planner</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {procurementRequests.map(req => (
                  <div key={req.id} style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", justifyBetween: "true", borderBottom: "1px solid #F3F4F6", paddingBottom: "8px", marginBottom: "12px" }}>
                      <div>
                        <strong style={{ fontSize: "0.95rem", color: "#111827", display: "block" }}>{req.item}</strong>
                        <span style={{ fontSize: "0.7rem", color: "#6B7280" }}>Required: {req.qty}</span>
                      </div>
                      <span style={{ fontSize: "0.7rem", backgroundColor: "rgba(22,163,74,0.1)", color: "#16A34A", padding: "2px 8px", borderRadius: "4px", fontWeight: "700" }}>
                        {req.status === "accepted" ? "Contract Locked" : "Open PO"}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.8rem", color: "#4B5563", marginBottom: "14px" }}>
                      <div>Target Rate: <strong>{req.targetPrice}</strong></div>
                      <div>Deadline: <strong>{req.date}</strong></div>
                    </div>

                    {req.status === "pending" && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button 
                          onClick={() => handleAcceptRequest(req.id)}
                          style={{ flexGrow: 1, backgroundColor: "#16A34A", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "800", cursor: "pointer" }}
                        >
                          Accept Sourcing PO
                        </button>
                        <button 
                          onClick={() => alert("Counter offer sent to procurement manager.")}
                          style={{ flexGrow: 1, backgroundColor: "#fff", border: "1px solid #D1D5DB", color: "#374151", padding: "8px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}
                        >
                          Submit Counter Offer
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QA INSPECTIONS */}
          {activeTab === "qa" && (
            <div style={{ maxWidth: "700px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>QA Quality Inspections</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {qaReports.map(qa => (
                  <div key={qa.id} style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", justifyBetween: "true", borderBottom: "1px solid #F3F4F6", paddingBottom: "6px", marginBottom: "10px" }}>
                      <strong>Inspection Batch: {qa.id}</strong>
                      <span style={{ color: "#16A34A", fontWeight: "800" }}>{qa.status}</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.8rem", color: "#4B5563", marginBottom: "12px" }}>
                      <div>Inspection date: {qa.date}</div>
                      <div>Assigned officer: {qa.inspector}</div>
                      <div>Moisture Level: <strong style={{ color: "#F59E0B" }}>{qa.moisture}</strong></div>
                      <div>Crate weight: {qa.weight}</div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6B7280", borderTop: "1px solid #F3F4F6", paddingTop: "8px" }}>
                      Remarks: <em>{qa.remarks}</em>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LOGISTICS */}
          {activeTab === "logistics" && (
            <div style={{ maxWidth: "700px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Logistics Progress Tracker</h3>
              
              {activePickups.map(p => (
                <div key={p.id} style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyBetween: "true", borderBottom: "1px solid #F3F4F6", paddingBottom: "6px", marginBottom: "10px" }}>
                    <strong>Pickup manifest: {p.id}</strong>
                    <span style={{ color: "#F59E0B", fontWeight: "700" }}>{p.status}</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.8rem", color: "#4B5563" }}>
                    <div>Assigned Driver: <strong>{p.driver}</strong></div>
                    <div>Vehicle: <strong>{p.vehicle}</strong></div>
                    <div>Target ETA: <strong>{p.eta}</strong></div>
                    <div>Destination: <strong>{p.warehouse}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: DOCUMENT CENTER */}
          {activeTab === "docs" && (
            <div style={{ maxWidth: "800px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Organic Certifications Compliance</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }} className="responsive-grid">
                
                <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "12px", color: "#111827" }}>Active Documents Directory</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {documents.map(doc => (
                      <div key={doc.id} style={{ borderBottom: "1px solid #F3F4F6", paddingBottom: "10px", display: "flex", justifyBetween: "true", fontSize: "0.75rem" }}>
                        <div>
                          <strong>{doc.name}</strong>
                          <span style={{ display: "block", color: "#6B7280", fontSize: "0.65rem" }}>{doc.file || "No file uploaded"} ({doc.date})</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ color: doc.status === "VERIFIED" ? "#16A34A" : "#F59E0B", fontWeight: "800" }}>{doc.status}</span>
                          {doc.status === "PENDING" && (
                            <div style={{ marginTop: "4px" }}>
                              <input 
                                type="file" 
                                id={`file_${doc.id}`} 
                                onChange={(e) => handleDocumentUpload(doc.id, e)} 
                                style={{ display: "none" }} 
                              />
                              <label 
                                htmlFor={`file_${doc.id}`} 
                                style={{ display: "inline-block", backgroundColor: "#16A34A", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "0.65rem", cursor: "pointer", fontWeight: "700" }}
                              >
                                Upload PDF
                              </label>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "8px", color: "#111827" }}>Compliance Rules</h4>
                  <p style={{ fontSize: "0.7rem", color: "#6B7280" }}>
                    Aadhaar verification and Organic Certification are mandatory under NPOP rules before yield payout releases.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: PAYOUTS & INVOICES */}
          {activeTab === "finance" && (
            <div style={{ maxWidth: "700px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Bank Payouts & Settlement Logs</h3>
              
              <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #E5E7EB", color: "#6B7280", textAlign: "left" }}>
                      <th style={{ padding: "10px" }}>Invoice ID</th>
                      <th style={{ padding: "10px" }}>Settlement Date</th>
                      <th style={{ padding: "10px" }}>Amount Paid</th>
                      <th style={{ padding: "10px" }}>Bank details</th>
                      <th style={{ padding: "10px" }}>Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(inv => (
                      <tr key={inv.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                        <td style={{ padding: "10px" }}><strong>{inv.id}</strong></td>
                        <td style={{ padding: "10px" }}>{inv.date}</td>
                        <td style={{ padding: "10px", color: "#16A34A", fontWeight: "700" }}>₹{inv.amount}</td>
                        <td style={{ padding: "10px" }}>{inv.method}</td>
                        <td style={{ padding: "10px" }}>
                          <button onClick={() => alert("Invoice PDF download complete.")} style={{ padding: "4px 8px", backgroundColor: "#F3F4F6", border: "none", color: "#374151", borderRadius: "4px", fontSize: "0.65rem", cursor: "pointer", fontWeight: "700" }}>
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: STAFF INBOX */}
          {activeTab === "messenger" && (
            <div style={{ maxWidth: "600px", margin: "auto" }}>
              <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                
                <div style={{ backgroundColor: "#F9FAFB", padding: "14px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", gap: "8px", alignItems: "center" }}>
                  <MessageSquare size={18} color="#16A34A" />
                  <strong>Direct Chat Box: VNatural Sourcing Staff</strong>
                </div>

                <div style={{ height: "240px", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {messages.map((msg, idx) => {
                    const isAdmin = msg.sender === "admin";
                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          alignSelf: isAdmin ? "flex-start" : "flex-end",
                          maxWidth: "85%",
                          backgroundColor: isAdmin ? "#F3F4F6" : "#16A34A",
                          color: isAdmin ? "#1f2937" : "#fff",
                          padding: "8px 12px",
                          borderRadius: isAdmin ? "10px 10px 10px 2px" : "10px 10px 2px 10px",
                          fontSize: "0.75rem"
                        }}
                      >
                        {msg.text}
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleMsgSend} style={{ display: "flex", padding: "10px 16px", borderTop: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}>
                  <input 
                    type="text" 
                    placeholder="Type message details..." 
                    style={{ flexGrow: 1, backgroundColor: "transparent", color: "#111827", border: "none", fontSize: "0.75rem", outline: "none" }}
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                  />
                  <button type="submit" style={{ backgroundColor: "transparent", border: "none", color: "#16A34A", cursor: "pointer" }}>
                    <Send size={16} />
                  </button>
                </form>

              </div>
            </div>
          )}

          {/* TAB 9: AI ADVISOR CHAT */}
          {activeTab === "ai-assistant" && (
            <div style={{ maxWidth: "600px", margin: "auto" }}>
              <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                
                <div style={{ backgroundColor: "#F9FAFB", padding: "14px 20px", borderBottom: "1px solid #E5E7EB", display: "flex", gap: "8px", alignItems: "center" }}>
                  <Sparkles size={18} color="#16A34A" fill="#16A34A" />
                  <strong>AI Mandi Price Advisor</strong>
                </div>

                <div style={{ height: "240px", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        alignSelf: msg.sender === "ai" ? "flex-start" : "flex-end",
                        maxWidth: "85%",
                        backgroundColor: msg.sender === "ai" ? "#F3F4F6" : "#16A34A",
                        color: msg.sender === "ai" ? "#1f2937" : "#fff",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        fontSize: "0.75rem"
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "4px", padding: "6px 12px", backgroundColor: "#F9FAFB", borderTop: "1px solid #E5E7EB", overflowX: "auto" }}>
                  {[
                    "rice prices",
                    "millets demand",
                    "PGS fertilizer guidelines"
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setChatInput(chip)}
                      style={{ whiteSpace: "nowrap", backgroundColor: "#fff", border: "1px solid #D1D5DB", color: "#374151", padding: "4px 8px", borderRadius: "12px", fontSize: "0.65rem", cursor: "pointer" }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleAiChatSubmit} style={{ display: "flex", padding: "10px 16px", borderTop: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}>
                  <input 
                    type="text" 
                    placeholder="Ask AI mandi assistant..." 
                    style={{ flexGrow: 1, backgroundColor: "transparent", color: "#111827", border: "none", fontSize: "0.75rem", outline: "none" }}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" style={{ backgroundColor: "transparent", border: "none", color: "#16A34A", cursor: "pointer" }}>
                    <Send size={16} />
                  </button>
                </form>

              </div>
            </div>
          )}

          {/* TAB 10: PROFILE REGISTRATION */}
          {activeTab === "profile" && (
            <div style={{ maxWidth: "600px" }}>
              <div style={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "16px" }}>Manage Farm Account Details</h3>
                <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="portal-form-group">
                    <label className="portal-label">Farmer Full Name</label>
                    <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#fff", color: "#111827", border: "1px solid #D1D5DB" }} value={editName} onChange={(e) => setEditName(e.target.value)} required />
                  </div>
                  <div className="portal-form-group">
                    <label className="portal-label">Contact Phone</label>
                    <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#fff", color: "#111827", border: "1px solid #D1D5DB" }} value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
                  </div>
                  <div className="portal-form-group">
                    <label className="portal-label">Farm Name</label>
                    <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#fff", color: "#111827", border: "1px solid #D1D5DB" }} value={editFarmName} onChange={(e) => setEditFarmName(e.target.value)} required />
                  </div>
                  <div className="portal-form-group">
                    <label className="portal-label">Farm Location Address</label>
                    <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#fff", color: "#111827", border: "1px solid #D1D5DB" }} value={editFarmLocation} onChange={(e) => setEditFarmLocation(e.target.value)} required />
                  </div>
                  <div className="portal-form-group">
                    <label className="portal-label">Upload Profile Avatar File</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ width: "100%", backgroundColor: "#fff", color: "#111827", border: "1px solid #D1D5DB", padding: "6px" }}
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
                  <button type="submit" style={{ width: "100%", backgroundColor: "#16A34A", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", marginTop: "10px" }}>
                    Save Profile Changes
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* CROP WIZARD MULTI-STEP MODAL */}
      {showWizardModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15,23,42,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyCenter: "center", padding: "16px" }}>
          <div style={{ backgroundColor: "#fff", borderRadius: "12px", width: "420px", padding: "24px", maxHeight: "90vh", overflowY: "auto", position: "relative", border: "1px solid #E5E7EB", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}>
            <button onClick={() => setShowWizardModal(false)} style={{ position: "absolute", right: "16px", top: "16px", backgroundColor: "transparent", border: "none", color: "#6B7280", cursor: "pointer" }}>✕</button>
            
            <div style={{ marginBottom: "16px" }}>
              <span style={{ fontSize: "0.65rem", color: "#16A34A", textTransform: "uppercase", fontWeight: "800" }}>Crop Offer Wizard</span>
              <h4 style={{ color: "#111827", fontWeight: "800", fontSize: "1.1rem", margin: "2px 0 0" }}>Step {wizardStep} of 7: {
                wizardStep === 1 ? "Crop Details" :
                wizardStep === 2 ? "Quantity Specifications" :
                wizardStep === 3 ? "Harvest Scheduler" :
                wizardStep === 4 ? "Storage Compliance" :
                wizardStep === 5 ? "Organic Certifications" :
                wizardStep === 6 ? "Visual Verification" :
                "Review & Submit"
              }</h4>

              {/* Progress Line */}
              <div style={{ display: "flex", gap: "4px", marginTop: "10px" }}>
                {[1, 2, 3, 4, 5, 6, 7].map(s => (
                  <div key={s} style={{ flexGrow: 1, height: "4px", backgroundColor: s <= wizardStep ? "#16A34A" : "#E5E7EB", borderRadius: "2px" }}></div>
                ))}
              </div>
            </div>

            <form onSubmit={handleWizardSubmit}>
              {/* STEP 1: Crop Details */}
              {wizardStep === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className="portal-form-group">
                    <label className="portal-label">Crop Name (English)</label>
                    <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#fff", color: "#111827", border: "1px solid #D1D5DB" }} placeholder="e.g. Premium Sona Masuri Rice" value={wName} onChange={(e) => setWName(e.target.value)} required />
                  </div>
                  <div className="portal-form-group">
                    <label className="portal-label">Category</label>
                    <select className="portal-select" style={{ width: "100%", backgroundColor: "#fff", color: "#111827", border: "1px solid #D1D5DB" }} value={wCategory} onChange={(e) => setWCategory(e.target.value)}>
                      <option value="rice">Rice (బియ్యం)</option>
                      <option value="dals">Dals (పప్పులు)</option>
                      <option value="ancient-grains">Ancient Grains (చిరుధాన్యాలు)</option>
                      <option value="vegetables">Greens (ఆకుకూరలు)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: Quantity */}
              {wizardStep === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className="portal-form-group">
                    <label className="portal-label">Offered Qty (kg)</label>
                    <input type="number" className="portal-input" style={{ width: "100%", backgroundColor: "#fff", color: "#111827", border: "1px solid #D1D5DB" }} placeholder="e.g. 250" value={wQty} onChange={(e) => setWQty(e.target.value)} required />
                  </div>
                  <div className="portal-form-group">
                    <label className="portal-label">Expected Unit Price (₹/kg)</label>
                    <input type="number" className="portal-input" style={{ width: "100%", backgroundColor: "#fff", color: "#111827", border: "1px solid #D1D5DB" }} placeholder="e.g. 85" value={wPrice} onChange={(e) => setWPrice(e.target.value)} required />
                  </div>
                </div>
              )}

              {/* STEP 3: Harvest date */}
              {wizardStep === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className="portal-form-group">
                    <label className="portal-label">Target Harvest Date</label>
                    <input type="date" className="portal-input" style={{ width: "100%", backgroundColor: "#fff", color: "#111827", border: "1px solid #D1D5DB" }} value={wHarvestDate} onChange={(e) => setWHarvestDate(e.target.value)} required />
                  </div>
                </div>
              )}

              {/* STEP 4: Storage */}
              {wizardStep === 4 && (
                <div className="portal-form-group">
                  <label className="portal-label">Storage Compliance</label>
                  <select className="portal-select" style={{ width: "100%", backgroundColor: "#fff", color: "#111827", border: "1px solid #D1D5DB" }} value={wStorage} onChange={(e) => setWStorage(e.target.value)}>
                    <option value="dry">Dry Grains Bin</option>
                    <option value="cold">Insulated Cold Room</option>
                  </select>
                </div>
              )}

              {/* STEP 5: Certifications */}
              {wizardStep === 5 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem" }}>
                    <input type="checkbox" checked={wCertifications.includes("PGS Organic")} onChange={() => setWCertifications(["PGS Organic"])} />
                    <span>PGS-India Certified Organic</span>
                  </label>
                </div>
              )}

              {/* STEP 6: Image select */}
              {wizardStep === 6 && (
                <div className="portal-form-group">
                  <label className="portal-label">Crop Inspection Image</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) setWImage(f.name);
                  }} style={{ fontSize: "0.8rem", color: "#6B7280" }} />
                </div>
              )}

              {/* STEP 7: Review & Submit */}
              {wizardStep === 7 && (
                <div style={{ fontSize: "0.8rem", color: "#4B5563", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div>Crop: <strong>{wName}</strong></div>
                  <div>Quantity: <strong>{wQty} kg</strong></div>
                  <div>Estimated Rate: <strong>₹{wPrice}/kg</strong></div>
                  <div>Storage: <strong>{wStorage} Storage</strong></div>
                </div>
              )}

              {/* Navigation controls */}
              <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
                {wizardStep > 1 && (
                  <button type="button" onClick={handlePrevStep} style={{ width: "35%", backgroundColor: "#fff", border: "1px solid #D1D5DB", color: "#374151", padding: "8px", borderRadius: "6px", cursor: "pointer", fontWeight: "700" }}>Back</button>
                )}
                {wizardStep < 7 ? (
                  <button type="button" onClick={handleNextStep} style={{ flexGrow: 1, backgroundColor: "#16A34A", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", fontWeight: "800", cursor: "pointer" }}>Continue</button>
                ) : (
                  <button type="submit" style={{ flexGrow: 1, backgroundColor: "#16A34A", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", fontWeight: "800", cursor: "pointer" }}>Submit Offer</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION (Tab selectors for phones) */}
      <div className="portal-bottom-nav mobile-only" style={{ display: "none", backgroundColor: "#fff", borderTop: "1px solid #E5E7EB" }}>
        {[
          { id: "dashboard", label: "Dashboard", icon: <Sliders size={18} /> },
          { id: "crops", label: "Crops", icon: <Layers size={18} /> },
          { id: "planner", label: "AI Planner", icon: <TrendingUp size={18} /> },
          { id: "docs", label: "Docs", icon: <FileText size={18} /> },
          { id: "ai-assistant", label: "AI Chat", icon: <Sparkles size={18} /> }
        ].map(menu => (
          <div 
            key={menu.id} 
            onClick={() => setActiveTab(menu.id)}
            className={`portal-bottom-nav-item ${activeTab === menu.id ? "active" : ""}`}
            style={{ color: activeTab === menu.id ? "#16A34A" : "#94a3b8" }}
          >
            {menu.icon}
            <span>{menu.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
