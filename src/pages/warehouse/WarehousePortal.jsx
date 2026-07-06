import React, { useState } from "react";
import { useDb } from "../../context/DbContext";
import { 
  Package, ClipboardList, CheckSquare, ShieldCheck, MapPin, Grid, AlertTriangle, 
  Search, FileText, Truck, TrendingUp, UserCheck, Sparkles, RefreshCw, 
  Sliders, Download, BarChart2, Play, Send, X, ChevronRight, Info, Layers 
} from "lucide-react";

export const WarehousePortal = () => {
  const { 
    currentUser, orders, products, updateOrderDeliveryStatus, updateProfile, logout,
    procurements, updateProcurementStatus, saveProduct, logWarehouseMovement, warehouseLogs, t 
  } = useDb();

  // Tab State
  const [activeTab, setActiveTab] = useState("dashboard");
  // Workstation Role State
  const [activeRole, setActiveRole] = useState(currentUser?.role || "warehouse");

  // State Variables
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [packedItems, setPackedItems] = useState({});
  const [selectedProcurementId, setSelectedProcurementId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Receiving/QA Inputs
  const [moistureLevel, setMoistureLevel] = useState("12.5");
  const [freshnessScore, setFreshnessScore] = useState("9/10");
  const [isOrganicCertified, setIsOrganicCertified] = useState(true);
  const [temperatureCheck, setTemperatureCheck] = useState("22°C");
  const [qaStatus, setQaStatus] = useState("approved");
  const [qaNotes, setQaNotes] = useState("");
  const [uploadedDoc, setUploadedDoc] = useState("");
  const [printedLabel, setPrintedLabel] = useState(null);

  // Scan Simulator Modal States
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scanTargetType, setScanTargetType] = useState("");
  const [scanTargetId, setScanTargetId] = useState("");
  const [scanStatusMsg, setScanStatusMsg] = useState("");

  // Internal Stock Transfer Inputs
  const [transferProductId, setTransferProductId] = useState("");
  const [transferQty, setTransferQty] = useState("");
  const [transferFromZone, setTransferFromZone] = useState("Zone A (Dry)");
  const [transferToZone, setTransferToZone] = useState("Zone C (Cold)");
  const [transferShelf, setTransferShelf] = useState("Shelf-B3");

  // Returns/Damaged Inputs
  const [damagedProductId, setDamagedProductId] = useState("");
  const [damagedQty, setDamagedQty] = useState("");
  const [damagedReason, setDamagedReason] = useState("Contaminated Packing");
  const [damagedLocation, setDamagedLocation] = useState("Damaged Zone H");

  // WMS AI Chatbot Assistant State
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Welcome to VNatural WMS Assistant. Ask me about stock levels, expiries, pick speed, or shelf overcrowding." }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Profile Form States
  const [editName, setEditName] = useState(currentUser?.name || "");
  const [editPhone, setEditPhone] = useState(currentUser?.phone || "");
  const [editShift, setEditShift] = useState(currentUser?.shift || "Day Shift (8 AM - 5 PM)");
  const [editFacility, setEditFacility] = useState(currentUser?.facility || "Vijayawada Hub");
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || "");

  if (!currentUser || currentUser.role !== "warehouse") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyCenter: "center", padding: "40px" }}>
        <div style={{ maxWidth: "450px", width: "100%", backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "30px", textAlign: "center", margin: "auto" }}>
          <AlertTriangle size={48} color="#f59e0b" style={{ marginBottom: "16px" }} />
          <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "700" }}>WMS Access Denied</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "10px 0 20px" }}>Please log in with an authorized Warehouse Staff credential profile.</p>
        </div>
      </div>
    );
  }

  // Dashboard Stats Calculations
  const ordersPendingPick = orders.filter(o => o.status === "pending").length;
  const ordersBeingPacked = orders.filter(o => o.status === "packed").length; // packing state in flow
  const ordersReadyDispatch = orders.filter(o => o.status === "packed").length; 
  const totalSkuCount = products.length;
  const outOfStockSku = products.filter(p => p.stock === 0).length;
  const lowStockSku = products.filter(p => p.stock > 0 && p.stock < 50).length;
  
  // Expiring items tracker (shelf life check)
  const expiringProductsList = products.filter(p => {
    const harvest = new Date(p.harvestDate || "2026-07-01");
    const ageDays = Math.round((new Date("2026-07-05") - harvest) / (1000 * 60 * 60 * 24));
    return (p.shelfLifeDays - ageDays) < 30;
  });

  const incomingFarmerDeliveries = procurements.filter(p => p.status === "pending");

  // Profile Update handler
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfile({
      ...currentUser,
      name: editName,
      phone: editPhone,
      shift: editShift,
      facility: editFacility,
      avatar: editAvatar
    });
    alert("WMS profile updated successfully!");
  };

  // Farmer Sourcing Approval Workflow
  const handleProcessIncoming = (e) => {
    e.preventDefault();
    const proc = procurements.find(p => p.id === selectedProcurementId);
    if (!proc) return;

    if (qaStatus === "approved") {
      updateProcurementStatus(selectedProcurementId, "approved");
      
      // Generate Batch Labels
      const generatedBatch = {
        batchNo: `BATCH-F-${selectedProcurementId.substring(5)}`,
        productName: proc.productName,
        quantity: proc.quantity,
        harvestDate: proc.date,
        zone: proc.category === "vegetables" || proc.category === "fruits" ? "Zone C (Cold Storage)" : "Zone B (Grain Bins)",
        shelf: `R-${Math.floor(1 + Math.random() * 5)}-S${Math.floor(1 + Math.random() * 4)}`,
        barcode: `VN-${Date.now().toString().substring(6)}`,
        moisture: moistureLevel + "%",
        inspector: currentUser.name
      };
      
      setPrintedLabel(generatedBatch);
      alert(`Sourcing approved! Created ${generatedBatch.batchNo} allocated to ${generatedBatch.zone} - ${generatedBatch.shelf}`);
    } else {
      updateProcurementStatus(selectedProcurementId, "rejected");
      alert(`Procurement ${selectedProcurementId} rejected due to quality check failure. Report filed.`);
    }
    
    setSelectedProcurementId("");
  };

  // Simulated Scan verification
  const triggerScan = (type, targetId) => {
    setScanTargetType(type);
    setScanTargetId(targetId);
    setScanStatusMsg("Initializing optical sensor scanner...");
    setScanModalOpen(true);

    setTimeout(() => {
      setScanStatusMsg(`✓ Barcode code decoded successfully: ${targetId}`);
    }, 1200);
  };

  const executeTransfer = (e) => {
    e.preventDefault();
    if (!transferProductId || !transferQty) return;
    
    const prod = products.find(p => p.id === transferProductId);
    if (!prod) return;

    logWarehouseMovement("transfer", transferProductId, Number(transferQty), `XFER-${transferFromZone.substring(5, 6)}➔${transferToZone.substring(5, 6)}`);
    alert(`Transfer registered: Moved ${transferQty} kg of ${prod.name} from ${transferFromZone} to ${transferToZone} on ${transferShelf}.`);
    
    setTransferProductId("");
    setTransferQty("");
  };

  const registerDamaged = (e) => {
    e.preventDefault();
    if (!damagedProductId || !damagedQty) return;
    
    const prod = products.find(p => p.id === damagedProductId);
    if (!prod) return;

    // Deduct stock for damaged items
    prod.stock = Math.max(0, prod.stock - Number(damagedQty));
    saveProduct(prod);

    logWarehouseMovement("outflow", damagedProductId, Number(damagedQty), `DAMAGED-${damagedReason.substring(0, 4).toUpperCase()}`);
    alert(`Damaged goods logged: Disposed ${damagedQty} kg of ${prod.name} from ${damagedLocation}. Stock updated.`);
    
    setDamagedProductId("");
    setDamagedQty("");
  };

  // Local WMS AI Bot Rules Processor
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    const newMessages = [...chatMessages, { sender: "user", text: userMsg }];
    setChatMessages(newMessages);
    setChatInput("");

    setTimeout(() => {
      let reply = "I'm analyzing the VNatural warehouse matrices. Could you rephrase your question?";
      const lower = userMsg.toLowerCase();

      if (lower.includes("expire") || lower.includes("aging")) {
        if (expiringProductsList.length > 0) {
          reply = `We have ${expiringProductsList.length} items nearing expiry: ` + 
            expiringProductsList.map(p => `${p.name} (${p.stock} kg, harvest: ${p.harvestDate})`).join(", ") + 
            `. I recommend dispatching them to packing or scheduling a 15% discount campaign.`;
        } else {
          reply = "Excellent news! No products are currently flagged as expiring within 30 days.";
        }
      } else if (lower.includes("reorder") || lower.includes("shortage") || lower.includes("low stock")) {
        const lowStock = products.filter(p => p.stock < 50);
        if (lowStock.length > 0) {
          reply = `Alert! The following SKUs are running below safety threshold (50kg): ` + 
            lowStock.map(p => `${p.name} (Current: ${p.stock} kg)`).join(", ") + 
            `. I suggest initiating procurement requests with local farmers.`;
        } else {
          reply = "All product categories have sufficient safety stock margins (> 50kg).";
        }
      } else if (lower.includes("overcrowd") || lower.includes("shelf") || lower.includes("capacity")) {
        reply = `Zone B (Grain Bins) is currently at 88% capacity and nearing limits. I suggest allocating incoming rice loads to Row C (Zone A dry rack).`;
      } else if (lower.includes("employee") || lower.includes("packed")) {
        reply = `Top Pick/Pack operators today: 1. Kalyan K. (24 orders), 2. Rama R. (18 orders). Average packing speed is 4.8 minutes per bundle.`;
      } else if (lower.includes("farmer") || lower.includes("keshav")) {
        const keshavDeliveries = procurements.filter(p => p.farmerName.toLowerCase().includes("keshav") && p.status === "approved");
        const totalQty = keshavDeliveries.reduce((sum, item) => sum + Number(item.quantity), 0);
        reply = `Farmer Keshav submitted ${keshavDeliveries.length} approved yield shipments this month, totaling ${totalQty} kg of organic produce.`;
      } else if (lower.includes("sales") || lower.includes("value") || lower.includes("summary")) {
        const val = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
        reply = `Today's WMS Summary: Orders Packed: ${ordersBeingPacked}, Sku Inventory: ${totalSkuCount} categories, Total Warehouse Valuation: ₹${val.toLocaleString("en-IN")}.`;
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: reply }]);
    }, 800);
  };

  // Filtered Inventory List
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.includes(searchQuery);
    const matchesCat = filterCategory === "all" ? true : p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", fontFamily: "var(--font-sans)", color: "#f8fafc", paddingBottom: "40px", paddingTop: "36px" }}>
      
      {/* HEADER SECTION */}
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "16px 30px", 
        backgroundColor: "#1e293b", 
        borderBottom: "1px solid #334155" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ backgroundColor: "#f59e0b", color: "#000", padding: "6px", borderRadius: "6px" }}>
            <Layers size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}>
              VNatural Enterprise WMS <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(245,158,11,0.15)", color: "#f59e0b", padding: "2px 8px", borderRadius: "20px" }}>WMS v4.2</span>
            </h2>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{currentUser.facility} Central Storage Hub</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Workstation Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#0f172a", padding: "6px 12px", borderRadius: "8px", border: "1px solid #334155" }}>
            <Sliders size={14} color="#f59e0b" />
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Station Role:</span>
            <select 
              value={activeRole} 
              onChange={(e) => setActiveRole(e.target.value)}
              style={{ backgroundColor: "transparent", color: "#fff", border: "none", fontSize: "0.75rem", fontWeight: "700", outline: "none", cursor: "pointer" }}
            >
              <option value="warehouse" style={{ backgroundColor: "#1e293b" }}>Warehouse Manager</option>
              <option value="inspector" style={{ backgroundColor: "#1e293b" }}>Quality Inspector</option>
              <option value="receiving" style={{ backgroundColor: "#1e293b" }}>Receiving Staff</option>
              <option value="picker" style={{ backgroundColor: "#1e293b" }}>Picking operator</option>
              <option value="packer" style={{ backgroundColor: "#1e293b" }}>Packing workstation</option>
              <option value="dispatch" style={{ backgroundColor: "#1e293b" }}>Dispatch Controller</option>
            </select>
          </div>

          <div style={{ fontSize: "0.8rem", color: "#94a3b8", textAlign: "right" }}>
            <span style={{ display: "block", color: "#fff", fontWeight: "600" }}>{currentUser.name}</span>
            <span>{editShift}</span>
          </div>

          <button 
            onClick={logout}
            style={{ 
              backgroundColor: "rgba(239,68,68,0.15)", 
              color: "#ef4444", 
              border: "1px solid rgba(239,68,68,0.3)", 
              padding: "6px 12px", 
              borderRadius: "6px", 
              fontSize: "0.75rem", 
              fontWeight: "700", 
              cursor: "pointer" 
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* CORE GRID LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "calc(100vh - 72px)" }}>
        
        {/* SIDEBAR NAVIGATION */}
        <aside style={{ backgroundColor: "#0f172a", borderRight: "1px solid #334155", padding: "20px 10px" }}>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "6px", padding: 0, margin: 0 }}>
            {[
              { id: "dashboard", label: "Dashboard Summary", icon: <BarChart2 size={16} /> },
              { id: "receiving", label: "Farmer Sourcing & QA", icon: <ClipboardList size={16} />, badge: incomingFarmerDeliveries.length },
              { id: "inventory", label: "Inventory & Storage Map", icon: <Grid size={16} /> },
              { id: "picking-packing", label: "Pick & Pack Line", icon: <CheckSquare size={16} />, badge: ordersPendingPick },
              { id: "dispatch", label: "Dispatch Desk", icon: <Truck size={16} />, badge: ordersReadyDispatch },
              { id: "returns-damage", label: "Returns & Damage Logs", icon: <AlertTriangle size={16} /> },
              { id: "ai-assistant", label: "WMS AI Co-pilot", icon: <Sparkles size={16} /> },
              { id: "profile", label: "WMS Station Profile", icon: <UserCheck size={16} /> }
            ].map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: activeTab === item.id ? "#1e293b" : "transparent",
                    color: activeTab === item.id ? "#fff" : "#94a3b8",
                    border: "none",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    textAlign: "left",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span style={{ backgroundColor: "#f59e0b", color: "#000", fontSize: "0.7rem", padding: "1px 6px", borderRadius: "10px", fontWeight: "800" }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "40px", padding: "10px 14px", backgroundColor: "#1e293b33", borderRadius: "8px", border: "1px solid #33415555" }}>
            <span style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>WMS Utilization</span>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginTop: "4px", fontWeight: "700" }}>
              <span>Capacity</span>
              <span>82% Full</span>
            </div>
            <div style={{ width: "100%", height: "6px", backgroundColor: "#334155", borderRadius: "3px", marginTop: "6px", overflow: "hidden" }}>
              <div style={{ width: "82%", height: "100%", backgroundColor: "#f59e0b" }}></div>
            </div>
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <main style={{ padding: "30px", overflowY: "auto" }}>
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#fff" }}>WMS Metrics Overview</h3>
                  <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Real-time telemetry from Vijayawada facility</span>
                </div>
                <button 
                  onClick={() => alert("Daily operational PDF report compiled.")}
                  style={{ backgroundColor: "#334155", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Download size={14} /> Download Operations Manifest
                </button>
              </div>

              {/* KPI Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                {[
                  { label: "Orders in Picking Queue", val: ordersPendingPick, alert: ordersPendingPick > 0, col: "#0ea5e9" },
                  { label: "Sourcing Shipments Pending QA", val: incomingFarmerDeliveries.length, alert: incomingFarmerDeliveries.length > 0, col: "#f59e0b" },
                  { label: "Orders Ready for Pick/Ship", val: ordersReadyDispatch, alert: false, col: "#10b981" },
                  { label: "Low/Out Stock Categories", val: lowStockSku + outOfStockSku, alert: lowStockSku > 0, col: "#ef4444" }
                ].map((kpi, idx) => (
                  <div key={idx} style={{ backgroundColor: "#1e293b", border: `1px solid ${kpi.alert ? kpi.col : "#334155"}`, borderRadius: "10px", padding: "16px" }}>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: "700" }}>{kpi.label}</span>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: "800", marginTop: "6px", color: "#fff" }}>{kpi.val}</h2>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
                
                {/* Left: Operational Charts Mock */}
                <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "16px" }}>Hourly Fulfillment Velocity</h4>
                  <div style={{ display: "flex", alignItems: "flex-end", height: "180px", gap: "12px", borderBottom: "1px solid #334155", paddingBottom: "10px" }}>
                    {[
                      { hr: "08 AM", pct: 30 },
                      { hr: "10 AM", pct: 55 },
                      { hr: "12 PM", pct: 85 },
                      { hr: "02 PM", pct: 95 },
                      { hr: "04 PM", pct: 70 },
                      { hr: "06 PM", pct: 40 }
                    ].map((bar, idx) => (
                      <div key={idx} style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: "100%", height: `${bar.pct}px`, backgroundColor: "#f59e0b", borderRadius: "4px 4px 0 0" }}></div>
                        <span style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "6px" }}>{bar.hr}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Shelf Warnings & Quick Alerts */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px" }}>
                    <h4 style={{ fontSize: "0.9rem", color: "#fff", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                      <AlertTriangle size={14} color="#ef4444" /> Urgent Action Center
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                      <div style={{ fontSize: "0.75rem", borderLeft: "2.5px solid #ef4444", paddingLeft: "8px" }}>
                        <strong>Stock Expiry Risk</strong>: Organic Moong Dal (30 kg) will reach shelf-life limits in 9 days. Recommendation: Move to active packing lines immediately.
                      </div>
                      <div style={{ fontSize: "0.75rem", borderLeft: "2.5px solid #f59e0b", paddingLeft: "8px" }}>
                        <strong>Out of Stock Alert</strong>: Ancient Ragi Flour is currently depleted. 4 subscription bundles are waiting for packing.
                      </div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px" }}>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#fff" }}>Warehouse Storage Zones</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px", fontSize: "0.75rem" }}>
                      <div style={{ padding: "8px", backgroundColor: "#0f172a", borderRadius: "4px" }}>Zone A (Dry Goods): 68%</div>
                      <div style={{ padding: "8px", backgroundColor: "#0f172a", borderRadius: "4px" }}>Zone B (Grains Shelf): 88%</div>
                      <div style={{ padding: "8px", backgroundColor: "#0f172a", borderRadius: "4px" }}>Zone C (Cold Room): 42%</div>
                      <div style={{ padding: "8px", backgroundColor: "#0f172a", borderRadius: "4px" }}>Zone D (Pack Area): Active</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: RECEIVING & QA */}
          {activeTab === "receiving" && (
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#fff", marginBottom: "10px" }}>Farmer Crop Sourcing Station</h3>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "20px" }}>Verify incoming crop yields, run quality checks, log certificates, and record batches</p>

              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px" }}>
                
                {/* Left: Pending deliveries list */}
                <div style={{ backgroundColor: "#1e293b", borderRadius: "10px", border: "1px solid #334155", padding: "20px" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px" }}>Incoming Deliveries Queue ({incomingFarmerDeliveries.length})</h4>
                  
                  {incomingFarmerDeliveries.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {incomingFarmerDeliveries.map(p => (
                        <div 
                          key={p.id} 
                          onClick={() => setSelectedProcurementId(p.id)}
                          style={{
                            border: `1px solid ${selectedProcurementId === p.id ? "#f59e0b" : "#334155"}`,
                            backgroundColor: selectedProcurementId === p.id ? "rgba(245, 158, 11, 0.05)" : "#0f172a",
                            padding: "12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: "0.85rem", color: "#fff" }}>{p.productName}</strong>
                            <span style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>
                              Farmer: {p.farmerName} | Qty: {p.quantity} kg | Expected: ₹{p.pricePerKg}/kg
                            </span>
                          </div>
                          <ChevronRight size={16} color="#64748b" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#64748b", fontSize: "0.8rem", textAlign: "center", padding: "20px" }}>No farmer deliveries require inspection.</p>
                  )}
                </div>

                {/* Right: Inspection details form */}
                <div>
                  {selectedProcurementId ? (
                    <form onSubmit={handleProcessIncoming} style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                      <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#f59e0b", marginBottom: "16px" }}>Workstation Quality Control</h4>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                        <div className="portal-form-group" style={{ marginBottom: 0 }}>
                          <label className="portal-label" style={{ color: "#94a3b8" }}>Moisture level %</label>
                          <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={moistureLevel} onChange={(e) => setMoistureLevel(e.target.value)} placeholder="e.g. 12%" />
                        </div>
                        <div className="portal-form-group" style={{ marginBottom: 0 }}>
                          <label className="portal-label" style={{ color: "#94a3b8" }}>Visual Smell score</label>
                          <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={freshnessScore} onChange={(e) => setFreshnessScore(e.target.value)} />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                        <div className="portal-form-group" style={{ marginBottom: 0 }}>
                          <label className="portal-label" style={{ color: "#94a3b8" }}>Temperature</label>
                          <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={temperatureCheck} onChange={(e) => setTemperatureCheck(e.target.value)} />
                        </div>
                        <div className="portal-form-group" style={{ marginBottom: 0 }}>
                          <label className="portal-label" style={{ color: "#94a3b8" }}>Decision</label>
                          <select 
                            className="portal-select" 
                            style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} 
                            value={qaStatus} 
                            onChange={(e) => setQaStatus(e.target.value)}
                          >
                            <option value="approved">Approve & Store</option>
                            <option value="rejected">Reject & File Report</option>
                          </select>
                        </div>
                      </div>

                      <div className="portal-form-group" style={{ marginBottom: "12px" }}>
                        <label className="portal-label" style={{ color: "#94a3b8" }}>Upload Certification Document (Web path)</label>
                        <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={uploadedDoc} onChange={(e) => setUploadedDoc(e.target.value)} placeholder="https://drive.google.com/cert-1" />
                      </div>

                      <div className="portal-form-group" style={{ marginBottom: "16px" }}>
                        <label className="portal-label" style={{ color: "#94a3b8" }}>Laboratory Notes</label>
                        <textarea 
                          className="portal-input" 
                          style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", minHeight: "60px" }} 
                          value={qaNotes} 
                          onChange={(e) => setQaNotes(e.target.value)} 
                          placeholder="Visual assessment verified. Passing pesticide chromotography check."
                        />
                      </div>

                      <button 
                        type="submit" 
                        style={{ 
                          width: "100%", 
                          backgroundColor: "#f59e0b", 
                          color: "#000", 
                          border: "none", 
                          padding: "10px", 
                          borderRadius: "8px", 
                          fontWeight: "700", 
                          cursor: "pointer" 
                        }}
                      >
                        File QA Manifest & Print Batch Label
                      </button>
                    </form>
                  ) : (
                    <div style={{ backgroundColor: "#1e293b", border: "1px dashed #334155", borderRadius: "10px", padding: "40px", textAlign: "center" }}>
                      <Info size={36} color="#64748b" style={{ marginBottom: "10px" }} />
                      <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Select an incoming farmer delivery from the queue to start quality checks.</p>
                    </div>
                  )}

                  {/* Printed Label Preview */}
                  {printedLabel && (
                    <div style={{ backgroundColor: "#fff", color: "#000", borderRadius: "10px", padding: "16px", marginTop: "20px", border: "2px solid #000" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #000", paddingBottom: "6px" }}>
                        <strong style={{ fontSize: "0.95rem" }}>VNATURAL STORAGE LABEL</strong>
                        <span style={{ fontSize: "0.7rem", backgroundColor: "#000", color: "#fff", padding: "1px 6px" }}>PASSED</span>
                      </div>
                      <div style={{ fontSize: "0.75rem", marginTop: "10px", display: "grid", gridTemplateColumns: "1.2fr 0.8fr" }}>
                        <div>
                          <div><strong>Batch:</strong> {printedLabel.batchNo}</div>
                          <div><strong>SKU:</strong> {printedLabel.productName}</div>
                          <div><strong>Quantity:</strong> {printedLabel.quantity} kg</div>
                          <div><strong>Zone:</strong> {printedLabel.zone}</div>
                          <div><strong>Shelf:</strong> {printedLabel.shelf}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          {/* Simulated Barcode block */}
                          <div style={{ height: "40px", width: "100px", border: "1px solid #000", backgroundColor: "#000", margin: "auto" }}></div>
                          <span style={{ fontSize: "0.65rem", display: "block", marginTop: "4px" }}>{printedLabel.barcode}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: INVENTORY & TRANSFERS */}
          {activeTab === "inventory" && (
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#fff", marginBottom: "10px" }}>Stock Directory & Shelf Allocations</h3>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "20px" }}>Monitor safety threshold levels, trace batches, and register internal stock transfers</p>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
                
                {/* Left: Filtered Inventory */}
                <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                    <div style={{ position: "relative", flexGrow: 1 }}>
                      <Search size={14} color="#64748b" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                      <input 
                        type="text" 
                        placeholder="Search SKU or Product ID..." 
                        style={{ width: "100%", padding: "8px 10px 8px 30px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "6px", fontSize: "0.8rem" }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <select 
                      value={filterCategory} 
                      onChange={(e) => setFilterCategory(e.target.value)}
                      style={{ padding: "8px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "6px", fontSize: "0.8rem" }}
                    >
                      <option value="all">All Categories</option>
                      <option value="rice">Rice Staples</option>
                      <option value="dals">Dals & Lentils</option>
                      <option value="ancient-grains">Ancient Grains</option>
                      <option value="vegetables">Fresh Greens</option>
                    </select>
                  </div>

                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", textAlign: "left" }}>
                          <th style={{ padding: "10px 6px" }}>SKU Item</th>
                          <th style={{ padding: "10px 6px" }}>Bin Code</th>
                          <th style={{ padding: "10px 6px" }}>Stock Level</th>
                          <th style={{ padding: "10px 6px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map(p => {
                          const bin = `${p.category.substring(0, 1).toUpperCase()}-${p.id.substring(2, 4)}`;
                          const isLow = p.stock < 50;

                          return (
                            <tr key={p.id} style={{ borderBottom: "1px solid #334155" }}>
                              <td style={{ padding: "10px 6px" }}>
                                <strong>{p.name}</strong>
                                <span style={{ display: "block", fontSize: "0.7rem", color: "#64748b" }}>ID: {p.id}</span>
                              </td>
                              <td style={{ padding: "10px 6px", color: "#f59e0b", fontWeight: "700" }}>{bin}</td>
                              <td style={{ padding: "10px 6px", color: isLow ? "#ef4444" : "#fff", fontWeight: "600" }}>
                                {p.stock} kg {isLow && <span style={{ fontSize: "0.65rem", backgroundColor: "rgba(239,68,68,0.15)", padding: "1px 4px", borderRadius: "3px" }}>LOW</span>}
                              </td>
                              <td style={{ padding: "10px 6px" }}>
                                <button 
                                  onClick={() => triggerScan("inventory", p.id)}
                                  style={{ padding: "2px 6px", backgroundColor: "#334155", border: "none", color: "#fff", borderRadius: "4px", fontSize: "0.7rem", cursor: "pointer" }}
                                >
                                  Scan Bin
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Internal Stock Transfer Form */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <form onSubmit={executeTransfer} style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#f59e0b", marginBottom: "16px" }}>Zone Transfer Desk</h4>

                    <div className="portal-form-group">
                      <label className="portal-label">Choose SKU Product</label>
                      <select 
                        className="portal-select" 
                        value={transferProductId} 
                        onChange={(e) => setTransferProductId(e.target.value)}
                        style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }}
                        required
                      >
                        <option value="">-- Choose SKU --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({p.stock} kg)</option>
                        ))}
                      </select>
                    </div>

                    <div className="portal-form-group">
                      <label className="portal-label">Transfer Quantity (Kg)</label>
                      <input 
                        type="number" 
                        className="portal-input" 
                        style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} 
                        value={transferQty} 
                        onChange={(e) => setTransferQty(e.target.value)} 
                        placeholder="e.g. 50" 
                        required 
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div className="portal-form-group">
                        <label className="portal-label">Source Zone</label>
                        <select 
                          className="portal-select" 
                          style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} 
                          value={transferFromZone} 
                          onChange={(e) => setTransferFromZone(e.target.value)}
                        >
                          <option value="Zone A (Dry)">Zone A (Dry)</option>
                          <option value="Zone B (Grain Bins)">Zone B (Grains)</option>
                          <option value="Zone C (Cold Storage)">Zone C (Cold)</option>
                        </select>
                      </div>
                      <div className="portal-form-group">
                        <label className="portal-label">Target Zone</label>
                        <select 
                          className="portal-select" 
                          style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} 
                          value={transferToZone} 
                          onChange={(e) => setTransferToZone(e.target.value)}
                        >
                          <option value="Zone C (Cold Storage)">Zone C (Cold)</option>
                          <option value="Zone A (Dry)">Zone A (Dry)</option>
                          <option value="Zone B (Grain Bins)">Zone B (Grains)</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      style={{ width: "100%", backgroundColor: "#f59e0b", color: "#000", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", marginTop: "10px" }}
                    >
                      Authorize Internal Movement
                    </button>
                  </form>

                  {/* Warehouse Audit Logs snippet */}
                  <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px" }}>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "10px" }}>Live WMS Logs</h4>
                    <div style={{ maxHeight: "120px", overflowY: "auto", fontSize: "0.7rem", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {warehouseLogs && warehouseLogs.slice(-4).reverse().map((log, idx) => (
                        <div key={idx} style={{ borderBottom: "1px solid #33415533", paddingBottom: "4px" }}>
                          <span>[{log.timestamp?.substring(11, 16) || "WMS"}]</span>: SKU <strong>{log.productId}</strong> {log.type} of {log.quantity} units (Batch: {log.batchNo})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: PICK & PACK LINE */}
          {activeTab === "picking-packing" && (
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#fff", marginBottom: "10px" }}>Pick & Pack Conveyor Line</h3>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "20px" }}>Workstation for picking checklists, packaging box choices, and packing confirmations</p>

              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
                
                {/* Left: Orders needing Attention */}
                <div style={{ backgroundColor: "#1e293b", borderRadius: "10px", border: "1px solid #334155", padding: "20px" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px" }}>Order Packing Conveyor Queue</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {orders.filter(o => o.status === "pending" || o.status === "packed").map(ord => (
                      <div 
                        key={ord.id} 
                        onClick={() => {
                          setSelectedOrderId(ord.id);
                          setPackedItems({});
                        }}
                        style={{
                          border: `1px solid ${selectedOrderId === ord.id ? "#f59e0b" : "#334155"}`,
                          backgroundColor: selectedOrderId === ord.id ? "rgba(245, 158, 11, 0.05)" : "#0f172a",
                          padding: "12px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <strong style={{ color: "#fff" }}>{ord.id}</strong>
                          <span style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>
                            Items: {ord.items.length} | Slot: {ord.deliverySlot} | Total: ₹{ord.total}
                          </span>
                        </div>
                        <span className={`admin-badge ${ord.status}`}>{ord.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Packing checklist details */}
                <div>
                  {selectedOrderId ? (
                    (() => {
                      const ord = orders.find(o => o.id === selectedOrderId);
                      if (!ord) return null;

                      return (
                        <div style={{ backgroundColor: "#1e293b", border: "1px solid #f59e0b", borderRadius: "10px", padding: "20px" }}>
                          <h4 style={{ fontSize: "0.95rem", color: "#f59e0b", fontWeight: "700", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <CheckSquare size={16} /> Packaging Station: {ord.id}
                          </h4>

                          <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "16px 0" }}>
                            {ord.items.map((item, idx) => {
                              const isChecked = !!packedItems[idx];
                              const prod = products.find(p => p.id === item.productId || p.name === item.name);
                              const shelfCode = prod ? `${prod.category.substring(0, 1).toUpperCase()}-${prod.id.substring(2, 4)}` : "A-1";

                              return (
                                <div 
                                  key={idx} 
                                  style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "space-between", 
                                    paddingBottom: "8px", 
                                    borderBottom: "1px solid #334155" 
                                  }}
                                >
                                  <div>
                                    <strong style={{ fontSize: "0.85rem", color: "#fff", textDecoration: isChecked ? "line-through" : "none", opacity: isChecked ? 0.6 : 1 }}>
                                      {item.quantity}x {item.name}
                                    </strong>
                                    <span style={{ display: "block", fontSize: "0.7rem", color: "#94a3b8" }}>Bin Shelf: {shelfCode}</span>
                                  </div>
                                  
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <button 
                                      onClick={() => triggerScan("product", item.productId)}
                                      style={{ padding: "4px 8px", backgroundColor: "#334155", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.7rem", cursor: "pointer" }}
                                    >
                                      Simulate Scan
                                    </button>
                                    <input 
                                      type="checkbox" 
                                      checked={isChecked} 
                                      onChange={() => handleCheckItem(idx)} 
                                      style={{ width: "16px", height: "16px", cursor: "pointer" }} 
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div style={{ marginBottom: "16px" }}>
                            <label className="portal-label">Pack Sizing Box</label>
                            <select className="portal-select" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }}>
                              <option value="eco">Recyclable Eco-Bag</option>
                              <option value="cardboard">VNatural Cardboard Carrier</option>
                              <option value="cold">Insulated Cold-Chain Bag (Gel Packs)</option>
                            </select>
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                              Scanned: {Object.values(packedItems).filter(Boolean).length} / {ord.items.length}
                            </span>
                            <button
                              onClick={handleConfirmPacked}
                              disabled={Object.values(packedItems).filter(Boolean).length !== ord.items.length}
                              style={{
                                backgroundColor: Object.values(packedItems).filter(Boolean).length === ord.items.length ? "#10b981" : "#475569",
                                color: "#000",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "6px",
                                fontWeight: "700",
                                cursor: Object.values(packedItems).filter(Boolean).length === ord.items.length ? "pointer" : "not-allowed"
                              }}
                            >
                              Dispatch to Driver Lane
                            </button>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div style={{ backgroundColor: "#1e293b", border: "1px dashed #334155", borderRadius: "10px", padding: "40px", textAlign: "center" }}>
                      <Info size={36} color="#64748b" style={{ marginBottom: "10px" }} />
                      <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Choose an active order from the line queue to start pick checklists and barcode scans.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: DISPATCH */}
          {activeTab === "dispatch" && (
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#fff", marginBottom: "10px" }}>Logistics Dispatch Desk</h3>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "20px" }}>Hand off packed crates to drivers and record dispatch schedules</p>

              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px" }}>Ready For Hand-off</h4>
                
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", textAlign: "left" }}>
                      <th style={{ padding: "10px" }}>Order ID</th>
                      <th style={{ padding: "10px" }}>Delivery Partner Assigned</th>
                      <th style={{ padding: "10px" }}>Vehicle No</th>
                      <th style={{ padding: "10px" }}>Status</th>
                      <th style={{ padding: "10px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.filter(o => o.status === "packed" || o.status === "out_for_delivery").map(ord => {
                      const driver = "Kalyan Kumar";
                      const vehicle = "AP-07-TV-4521";

                      return (
                        <tr key={ord.id} style={{ borderBottom: "1px solid #334155" }}>
                          <td style={{ padding: "10px" }}><strong>{ord.id}</strong></td>
                          <td style={{ padding: "10px" }}>{driver}</td>
                          <td style={{ padding: "10px", color: "#0ea5e9", fontWeight: "700" }}>{vehicle}</td>
                          <td style={{ padding: "10px" }}>
                            <span className={`admin-badge ${ord.status}`}>{ord.status}</span>
                          </td>
                          <td style={{ padding: "10px" }}>
                            {ord.status === "packed" ? (
                              <button 
                                onClick={() => {
                                  updateOrderDeliveryStatus(ord.id, "out_for_delivery");
                                  alert(`Crate ${ord.id} signed off to driver Kalyan K. (Vehicle: ${vehicle})`);
                                }}
                                style={{ padding: "6px 12px", backgroundColor: "#f59e0b", color: "#000", border: "none", borderRadius: "4px", fontWeight: "700", cursor: "pointer" }}
                              >
                                Sign Out Custody
                              </button>
                            ) : (
                              <span style={{ color: "#10b981", fontWeight: "700" }}>En Route ➔</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: RETURNS & DAMAGE */}
          {activeTab === "returns-damage" && (
            <div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#fff", marginBottom: "10px" }}>Returns & Damage Management</h3>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "20px" }}>Process customer returns and write off contaminated or damaged shelf inventory</p>

              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px" }}>
                
                {/* Left: Returns Queue */}
                <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px" }}>Returned Parcels Inspection</h4>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      { id: "RET-2819", customer: "Geetha S.", item: "Sonamasuri Rice (5 kg)", reason: "Wrong item delivered", decision: "Restock" },
                      { id: "RET-1092", customer: "Ravi Teja", item: "Organic Sonamasuri Ghee", reason: "Packaging leak", decision: "Quarantine" }
                    ].map(ret => (
                      <div key={ret.id} style={{ border: "1px solid #334155", backgroundColor: "#0f172a", padding: "12px", borderRadius: "8px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <strong>{ret.id}</strong>
                          <span style={{ color: "#f59e0b", fontWeight: "600", fontSize: "0.75rem" }}>{ret.reason}</span>
                        </div>
                        <span style={{ display: "block", fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" }}>
                          Item: {ret.item} | Cust: {ret.customer}
                        </span>
                        
                        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                          <button 
                            onClick={() => alert(`Item ${ret.id} approved for restocking in Zone B shelf.`)}
                            style={{ padding: "4px 8px", backgroundColor: "#10b981", color: "#000", border: "none", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700", cursor: "pointer" }}
                          >
                            Approve Restock
                          </button>
                          <button 
                            onClick={() => alert(`Item ${ret.id} marked as contaminated. Dispatched to Disposal Zone.`)}
                            style={{ padding: "4px 8px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "700", cursor: "pointer" }}
                          >
                            Discard Write-off
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Damage Entry Form */}
                <form onSubmit={registerDamaged} style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#ef4444", marginBottom: "16px" }}>Register Damage Write-off</h4>

                  <div className="portal-form-group">
                    <label className="portal-label">Choose Damaged SKU SKU</label>
                    <select 
                      className="portal-select" 
                      value={damagedProductId} 
                      onChange={(e) => setDamagedProductId(e.target.value)}
                      style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }}
                      required
                    >
                      <option value="">-- Choose SKU --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.stock} kg)</option>
                      ))}
                    </select>
                  </div>

                  <div className="portal-form-group">
                    <label className="portal-label">Write-off Quantity (Kg)</label>
                    <input 
                      type="number" 
                      className="portal-input" 
                      style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} 
                      value={damagedQty} 
                      onChange={(e) => setFormattedQty(e, setDamagedQty)} 
                      placeholder="e.g. 10" 
                      required 
                    />
                  </div>

                  <div className="portal-form-group">
                    <label className="portal-label">Reason Code</label>
                    <select 
                      className="portal-select" 
                      style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} 
                      value={damagedReason} 
                      onChange={(e) => setDamagedReason(e.target.value)}
                    >
                      <option value="Broken Packaging">Broken Packaging / Tear</option>
                      <option value="Mold Contamination">Mold / Contamination</option>
                      <option value="Expired Shelf life">Expired Shelf life</option>
                      <option value="Transit damage">Transit Hand-off Damage</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    style={{ width: "100%", backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", marginTop: "10px" }}
                  >
                    Commit Damage Disposal Write-off
                  </button>
                </form>

              </div>
            </div>
          )}

          {/* TAB 7: WMS AI CO-PILOT CHATBOT */}
          {activeTab === "ai-assistant" && (
            <div style={{ maxWidth: "700px", margin: "auto" }}>
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #f59e0b", borderRadius: "12px", overflow: "hidden" }}>
                
                {/* Header */}
                <div style={{ backgroundColor: "#0f172a", padding: "16px 20px", borderBottom: "1px solid #334155", display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ backgroundColor: "rgba(245,158,11,0.15)", padding: "6px", borderRadius: "50%" }}>
                    <Sparkles size={20} color="#f59e0b" fill="#f59e0b" />
                  </div>
                  <div>
                    <strong style={{ color: "#fff", display: "block" }}>WMS Conversational Co-pilot</strong>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Analyzing real-time stock, orders, and farmer shipments</span>
                  </div>
                </div>

                {/* Messages stream */}
                <div style={{ height: "300px", overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {chatMessages.map((msg, idx) => {
                    const isAi = msg.sender === "ai";
                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          alignSelf: isAi ? "flex-start" : "flex-end",
                          maxWidth: "80%",
                          backgroundColor: isAi ? "#0f172a" : "#f59e0b",
                          color: isAi ? "#fff" : "#000",
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

                {/* Suggestion prompt chips */}
                <div style={{ display: "flex", gap: "6px", padding: "10px 20px", backgroundColor: "#0f172a55", borderTop: "1px solid #334155", overflowX: "auto" }}>
                  {[
                    "Which products will expire next week?",
                    "What should be reordered today?",
                    "Which shelf is overcrowded?",
                    "How much inventory arrived from Farmer Keshav?"
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setChatInput(chip);
                      }}
                      style={{
                        whiteSpace: "nowrap",
                        backgroundColor: "#334155",
                        color: "#fff",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "0.7rem",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Chat Form */}
                <form onSubmit={handleChatSubmit} style={{ display: "flex", padding: "12px 20px", borderTop: "1px solid #334155", backgroundColor: "#0f172a" }}>
                  <input 
                    type="text" 
                    placeholder="Ask WMS Co-pilot..." 
                    style={{ flexGrow: 1, backgroundColor: "transparent", color: "#fff", border: "none", fontSize: "0.85rem", outline: "none" }}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" style={{ backgroundColor: "transparent", border: "none", color: "#f59e0b", cursor: "pointer" }}>
                    <Send size={18} />
                  </button>
                </form>

              </div>
            </div>
          )}

          {/* TAB 8: PROFILE */}
          {activeTab === "profile" && (
            <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "20px", maxWidth: "500px", margin: "auto" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Manage WMS Workstation Details</h3>
              <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div className="portal-form-group">
                  <label className="portal-label">Staff Full Name</label>
                  <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={editName} onChange={(e) => setEditName(e.target.value)} required />
                </div>
                <div className="portal-form-group">
                  <label className="portal-label">Contact Phone</label>
                  <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
                </div>
                <div className="portal-form-group">
                  <label className="portal-label">Shift Hours</label>
                  <select className="portal-select" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={editShift} onChange={(e) => setEditShift(e.target.value)}>
                    <option value="Day Shift (8 AM - 5 PM)">Day Shift (8 AM - 5 PM)</option>
                    <option value="Night Shift (9 PM - 6 AM)">Night Shift (9 PM - 6 AM)</option>
                  </select>
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
                          setEditAvatar(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                  />
                </div>
                <div className="portal-form-group">
                  <label className="portal-label">Warehouse Facility</label>
                  <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={editFacility} onChange={(e) => setEditFacility(e.target.value)} required />
                </div>
                <div className="portal-form-group">
                  <label className="portal-label">Primary Login Email (Read-Only)</label>
                  <input type="email" className="portal-input" style={{ width: "100%", backgroundColor: "#334155", color: "#94a3b8", border: "1px solid #334155", cursor: "not-allowed" }} value={currentUser.email} disabled />
                </div>
                <button type="submit" style={{ width: "100%", backgroundColor: "#f59e0b", color: "#000", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", marginTop: "10px" }}>
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* SCANNER MODAL */}
      {scanModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{ backgroundColor: "#1e293b", border: "1px solid #f59e0b", borderRadius: "12px", width: "400px", padding: "24px", position: "relative" }}>
            <button onClick={() => setScanModalOpen(false)} style={{ position: "absolute", right: "16px", top: "16px", backgroundColor: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>
              <X size={20} />
            </button>
            <h3 style={{ color: "#fff", fontSize: "1.1rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              Optical Barcode Scanner
            </h3>
            
            {/* Simulated camera scanning finder frame */}
            <div style={{
              width: "100%",
              height: "180px",
              backgroundColor: "#000",
              borderRadius: "8px",
              position: "relative",
              border: "1.5px solid #334155",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden"
            }}>
              {/* Laser line effect */}
              <div style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: "2.5px",
                backgroundColor: "#ef4444",
                boxShadow: "0 0 10px #ef4444",
                animation: "scannerLaser 2s infinite ease-in-out"
              }}></div>
              
              <div style={{ border: "2px dashed #f59e0b", width: "180px", height: "60px", opacity: 0.7 }}></div>
            </div>

            <div style={{ marginTop: "16px", padding: "10px", backgroundColor: "#0f172a", borderRadius: "6px", fontSize: "0.75rem", color: "#94a3b8" }}>
              {scanStatusMsg}
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
              <button 
                onClick={() => setScanModalOpen(false)}
                style={{ width: "40%", backgroundColor: "#334155", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}
              >
                Close
              </button>
              <button 
                onClick={() => {
                  if (scanTargetType === "product") {
                    // Automatically tick packing item
                    const ord = orders.find(o => o.id === selectedOrderId);
                    if (ord) {
                      const idx = ord.items.findIndex(item => item.productId === scanTargetId);
                      if (idx !== -1) {
                        handleCheckItem(idx);
                        setScanStatusMsg("✓ Item matched and checked on packing queue!");
                      }
                    }
                  } else {
                    setScanStatusMsg("✓ Storage Bin inventory check verified!");
                  }
                }}
                style={{ width: "60%", backgroundColor: "#f59e0b", border: "none", color: "#000", padding: "8px", borderRadius: "6px", fontWeight: "700", cursor: "pointer", fontSize: "0.8rem" }}
              >
                Confirm Verification
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Formatter Helper to prevent React number inputs warning
function setFormattedQty(e, setter) {
  const v = e.target.value;
  setter(v);
}
