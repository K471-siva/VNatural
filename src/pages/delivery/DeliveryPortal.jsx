import React, { useState, useEffect } from "react";
import { useDb } from "../../context/DbContext";
import { 
  Truck, MapPin, CheckCircle, Navigation, Phone, DollarSign, Key, AlertTriangle, 
  Search, FileText, Filter, TrendingUp, UserCheck, User, Sparkles, RefreshCw, 
  Sliders, Download, BarChart2, Play, Send, X, ChevronRight, Info, Layers,
  Power, ShieldAlert, Clock, Camera, Check, RotateCcw, Compass, HelpCircle,
  Smartphone, Map, LogOut
} from "lucide-react";

export const DeliveryPortal = () => {
  const { currentUser, orders, deliveryJobs, handleJobStatusChange, updateProfile, logout, t } = useDb();

  // Tab state
  const [activeTab, setActiveTab] = useState("dashboard");
  const [jobsSortKey, setJobsSortKey] = useState("priority"); // priority, nearest, cod_first

  // Shift and Connection state
  const [shiftStatus, setShiftStatus] = useState("online"); // online, break, offline, paused
  const [connectionState, setConnectionState] = useState("online"); // online, offline (testing offline mode)
  const [offlineSyncQueue, setOfflineSyncQueue] = useState([]);

  // Selections
  const [selectedJobId, setSelectedJobId] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  // Communication simulator
  const [callOverlayOpen, setCallOverlayOpen] = useState(false);
  const [smsTemplateOpen, setSmsTemplateOpen] = useState(false);
  const [navigationStepsOpen, setNavigationStepsOpen] = useState(false);

  // Delivery drop-off parameters
  const [codAmountCollected, setCodAmountCollected] = useState("");
  const [proofPhotoUrl, setProofPhotoUrl] = useState("");
  const [signatureData, setSignatureData] = useState("");
  const [failureReason, setFailureReason] = useState("");
  const [failedDeliveryModal, setFailedDeliveryModal] = useState(false);

  // Optical scan verification simulator
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scanTargetId, setScanTargetId] = useState("");
  const [scanStatusMsg, setScanStatusMsg] = useState("");

  // Withdrawals Ledger
  const [withdrawAmountInput, setWithdrawAmountInput] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("UPI");
  const [withdrawUpi, setWithdrawUpi] = useState("kalyan@upi");
  const [withdrawBank, setWithdrawBank] = useState("987654321098");
  const [withdrawIfsc, setWithdrawIfsc] = useState("HDFC0000240");
  const [withdrawnAmount, setWithdrawnAmount] = useState(0);
  const [payouts, setPayouts] = useState([]);

  // Emergency SOS triggers
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [safetyLogType, setSafetyLogType] = useState("");

  // Pre-trip checklist audits
  const [inspectedBrakes, setInspectedBrakes] = useState(true);
  const [inspectedLights, setInspectedLights] = useState(true);
  const [inspectedFuel, setInspectedFuel] = useState(true);

  // Driver Chat Assistant
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "VNatural DMS Driver Co-pilot active. Ask me about routes, pending COD, or client requests." }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Profile Editor states
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editVehicle, setEditVehicle] = useState("");
  const [editZone, setEditZone] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  // Safely populate state from user context on login/switch
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || "");
      setEditPhone(currentUser.phone || "");
      setEditVehicle(currentUser.vehicleNo || "");
      setEditZone(currentUser.zone || "");
      setEditAvatar(currentUser.avatar || "");

      // Safe local storage checks
      const savedWithdrawn = localStorage.getItem(`driver_${currentUser.id}_withdrawn`);
      if (savedWithdrawn) setWithdrawnAmount(Number(savedWithdrawn) || 0);

      try {
        const savedPayouts = localStorage.getItem(`driver_${currentUser.id}_payouts`);
        if (savedPayouts) setPayouts(JSON.parse(savedPayouts) || []);
      } catch (e) {
        console.warn("DMS: Failed to parse local payouts:", e);
      }
    }
  }, [currentUser]);

  if (!currentUser || currentUser.role !== "delivery") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyCenter: "center", padding: "40px" }}>
        <div style={{ maxWidth: "450px", width: "100%", backgroundColor: "#1e293b", borderRadius: "12px", border: "1px solid #334155", padding: "30px", textAlign: "center", margin: "auto" }}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: "16px" }} />
          <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: "700" }}>Logistics Access Denied</h3>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "10px 0 20px" }}>Please log in with an authorized Delivery Partner profile.</p>
        </div>
      </div>
    );
  }

  // Filter jobs
  const driverJobs = deliveryJobs.filter(j => j.deliveryPartnerId === currentUser.id);
  const pendingJobs = driverJobs.filter(j => j.status === "assigned" || j.status === "picked_up");
  const completedJobs = driverJobs.filter(j => j.status === "completed" || j.status === "delivered");

  // Sort jobs
  const sortedPendingJobs = [...pendingJobs].sort((a, b) => {
    if (jobsSortKey === "cod_first") {
      const aOrd = orders.find(o => o.id === a.orderId);
      const bOrd = orders.find(o => o.id === b.orderId);
      const aCOD = aOrd?.paymentMethod === "COD" ? 1 : 0;
      const bCOD = bOrd?.paymentMethod === "COD" ? 1 : 0;
      return bCOD - aCOD;
    }
    // Default sorting by priority/assigned
    return a.id.localeCompare(b.id);
  });

  const totalEarned = driverJobs
    .filter(j => j.status === "completed" || j.status === "delivered")
    .reduce((sum, j) => sum + j.earning, 0);

  const currentBalance = Math.max(0, totalEarned - withdrawnAmount);
  
  // Calculate COD cash total collected
  const pendingCodToDeposit = driverJobs
    .filter(j => j.status === "completed" || j.status === "delivered")
    .reduce((sum, j) => {
      const ord = orders.find(o => o.id === j.orderId);
      return ord && ord.paymentMethod === "COD" ? sum + ord.total : sum;
    }, 0);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateProfile({
      ...currentUser,
      name: editName,
      phone: editPhone,
      vehicleNo: editVehicle,
      zone: editZone,
      avatar: editAvatar
    });
    alert("Partner profile details updated successfully!");
  };

  const handlePayoutRequest = (e) => {
    e.preventDefault();
    const val = Number(withdrawAmountInput);
    if (!val || val <= 0) return;
    if (val > currentBalance) {
      alert("Insufficient commission earnings balance. Maximum withdrawable amount: ₹" + currentBalance);
      return;
    }

    const newPayout = {
      id: `pay_${Date.now()}`,
      amount: val,
      method: withdrawMethod,
      destination: withdrawMethod === "UPI" ? withdrawUpi : `A/C ${withdrawBank} (IFSC: ${withdrawIfsc})`,
      date: new Date().toLocaleString(),
      status: "COMPLETED"
    };

    const updatedPayouts = [newPayout, ...payouts];
    setPayouts(updatedPayouts);
    localStorage.setItem(`driver_${currentUser.id}_payouts`, JSON.stringify(updatedPayouts));
    
    const newWithdrawnTotal = withdrawnAmount + val;
    setWithdrawnAmount(newWithdrawnTotal);
    localStorage.setItem(`driver_${currentUser.id}_withdrawn`, String(newWithdrawnTotal));
    
    setWithdrawAmountInput("");
    alert(`Payout of ₹${val} initiated! Funds have been successfully sent to ${newPayout.destination}.`);
  };

  // Offline handler simulation
  const executeJobStatusUpdate = (jobId, status) => {
    if (connectionState === "offline") {
      const newAction = { jobId, status, timestamp: Date.now() };
      setOfflineSyncQueue([...offlineSyncQueue, newAction]);
      alert("Offline Mode Active: Status change queued locally. Will sync automatically on connection.");
    } else {
      handleJobStatusChange(jobId, status);
    }
  };

  const handleConfirmPickup = (jobId) => {
    executeJobStatusUpdate(jobId, "picked_up");
    if (connectionState === "online") {
      alert("Package checked out from warehouse! Customer route sequence initialized.");
    }
  };

  // Barcode Scanning simulator
  const triggerOpticalScan = (targetId) => {
    setScanTargetId(targetId);
    setScanStatusMsg("Aligning scanning sensors...");
    setScanModalOpen(true);

    setTimeout(() => {
      setScanStatusMsg(`✓ Barcode scanned successfully! Crate verified.`);
    }, 1200);
  };

  // Verify Customer OTP and complete
  const handleVerifyOtpSubmit = (e) => {
    e.preventDefault();
    const job = deliveryJobs.find(j => j.id === selectedJobId);
    if (!job) return;

    const orderObj = orders.find(o => o.id === job.orderId);
    if (orderObj && enteredOtp === orderObj.otp) {
      executeJobStatusUpdate(selectedJobId, "completed");
      setEnteredOtp("");
      setSelectedJobId("");
      setOtpError("");
      if (connectionState === "online") {
        alert(`OTP validated! Delivery marked complete. ₹${job.earning} payout credited.`);
      }
    } else {
      setOtpError("Incorrect security code entered. Please verify with customer.");
    }
  };

  // Failed Drop-off report
  const handleReportFailure = (e) => {
    e.preventDefault();
    if (!selectedJobId || !failureReason) return;
    
    executeJobStatusUpdate(selectedJobId, "failed");
    alert(`Delivery failed logged. Reason: ${failureReason}. Package slated for warehouse return.`);
    
    setFailedDeliveryModal(false);
    setSelectedJobId("");
  };

  // Conversational Driver Chat Agent
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    const newMessages = [...chatMessages, { sender: "user", text: userMsg }];
    setChatMessages(newMessages);
    setChatInput("");

    setTimeout(() => {
      let reply = "Processing route options...";
      const lower = userMsg.toLowerCase();

      if (lower.includes("first") || lower.includes("route") || lower.includes("sequence")) {
        if (pendingJobs.length > 0) {
          const firstJob = pendingJobs[0];
          const firstOrd = orders.find(o => o.id === firstJob.orderId);
          reply = `I suggest completing Order ${firstJob.orderId} for customer ${firstOrd?.customerName || "User"} first. It has high delivery priority and estimated travel time is 8 minutes.`;
        } else {
          reply = "You have no active pending assignments. Rest and wait for next warehouse allocations.";
        }
      } else if (lower.includes("remain") || lower.includes("pending")) {
        reply = `You currently have ${pendingJobs.length} route assignments remaining to complete today.`;
      } else if (lower.includes("cod") || lower.includes("cash") || lower.includes("collect")) {
        reply = `You have ₹${pendingCodToDeposit} Cash-on-Delivery collections to deposit at the warehouse cashier counter.`;
      } else if (lower.includes("performance") || lower.includes("rating")) {
        reply = `Your active rating is 4.9/5 stars across ${completedJobs.length} successful deliveries today. SLA compliance is 100%.`;
      }

      setChatMessages(prev => [...prev, { sender: "ai", text: reply }]);
    }, 800);
  };

  // Sync offline actions when connectivity returns
  useEffect(() => {
    if (connectionState === "online" && offlineSyncQueue.length > 0) {
      offlineSyncQueue.forEach(action => {
        handleJobStatusChange(action.jobId, action.status);
      });
      alert(`Network restored: Synced ${offlineSyncQueue.length} offline status changes to central servers!`);
      setOfflineSyncQueue([]);
    }
  }, [connectionState]);

  const selectedJob = deliveryJobs.find(j => j.id === selectedJobId);
  const selectedOrder = selectedJob ? orders.find(o => o.id === selectedJob.orderId) : null;

  return (
    <div style={{ backgroundColor: "#0f172a", minHeight: "100vh", color: "#f8fafc", fontFamily: "var(--font-sans)", display: "flex", flexDirection: "column", paddingTop: "36px" }}>
      
      {/* HEADER BAR */}
      <header style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "14px 20px", 
        backgroundColor: "#1e293b", 
        borderBottom: "1px solid #334155",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Truck size={22} color="#3b82f6" />
          <div>
            <h1 style={{ fontSize: "1rem", fontWeight: "800", color: "#fff", margin: 0 }}>VNatural DMS Portal</h1>
            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Driver Console</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Offline simulator toggle button */}
          <button
            onClick={() => setConnectionState(prev => prev === "online" ? "offline" : "online")}
            style={{
              padding: "4px 8px",
              fontSize: "0.65rem",
              fontWeight: "800",
              borderRadius: "4px",
              backgroundColor: connectionState === "online" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${connectionState === "online" ? "#10b981" : "#ef4444"}`,
              color: connectionState === "online" ? "#10b981" : "#ef4444",
              cursor: "pointer"
            }}
          >
            {connectionState === "online" ? "Online Mode" : "Offline Mode"}
          </button>

          {/* Shift status select */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#0f172a", padding: "4px 8px", borderRadius: "20px", border: "1px solid #334155" }}>
            <Power size={10} color={shiftStatus === "online" ? "#10b981" : "#f59e0b"} />
            <select 
              value={shiftStatus} 
              onChange={(e) => setShiftStatus(e.target.value)}
              style={{ backgroundColor: "transparent", color: "#fff", border: "none", fontSize: "0.7rem", fontWeight: "700", outline: "none", cursor: "pointer" }}
            >
              <option value="online" style={{ backgroundColor: "#1e293b" }}>Online</option>
              <option value="break" style={{ backgroundColor: "#1e293b" }}>Break</option>
              <option value="offline" style={{ backgroundColor: "#1e293b" }}>Offline</option>
            </select>
          </div>

          <button 
            onClick={logout}
            style={{ padding: "4px 8px", fontSize: "0.7rem", fontWeight: "700", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "4px", cursor: "pointer" }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE GRID */}
      <div style={{ display: "flex", flexGrow: 1, position: "relative" }}>
        
        {/* SIDEBAR NAVIGATION (Desktop) */}
        <aside style={{ 
          width: "240px", 
          backgroundColor: "#0b1329", 
          borderRight: "1px solid #223555",
          display: "flex",
          flexDirection: "column",
          padding: "16px 0",
          gap: "4px",
          flexShrink: 0
        }} className="desktop-sidebar">
          {[
            { id: "dashboard", label: "Dashboard Summary", icon: <Sliders size={16} /> },
            { id: "queue", label: "Jobs Queue Desk", icon: <Layers size={16} /> },
            { id: "route", label: "Optimized Route Map", icon: <MapPin size={16} /> },
            { id: "vehicle", label: "Vehicle Audit", icon: <Smartphone size={16} /> },
            { id: "ledger", label: "Payouts & COD", icon: <DollarSign size={16} /> },
            { id: "ai-assistant", label: "AI Co-pilot Chat", icon: <Sparkles size={16} /> },
            { id: "profile", label: "Partner Station Info", icon: <User size={16} /> }
          ].map(menu => (
            <button
              key={menu.id}
              onClick={() => setActiveTab(menu.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 20px",
                width: "100%",
                backgroundColor: activeTab === menu.id ? "#1b2a47" : "transparent",
                color: activeTab === menu.id ? "#3b82f6" : "#94a3b8",
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

        {/* WORKSPACE AREA */}
        <main style={{ flexGrow: 1, padding: "24px", overflowY: "auto" }}>

          {/* TAB 1: DASHBOARD SUMMARY */}
          {activeTab === "dashboard" && (
            <div>
              {/* TOP SUMMARY CARDS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                {[
                  { label: "COD Collected", val: `₹${pendingCodToDeposit}`, desc: "Deposit at warehouse", col: "#10b981" },
                  { label: "Earnings Balance", val: `₹${currentBalance}`, desc: `Total Earned: ₹${totalEarned}`, col: "#3b82f6" },
                  { label: "Active Jobs", val: pendingJobs.length, desc: "Assigned route listings", col: "#f59e0b" },
                  { label: "Driver SLA Rating", val: "4.9 / 5", desc: "100% on-time dispatch", col: "#10b981" }
                ].map((card, idx) => (
                  <div key={idx} style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px" }}>
                    <span style={{ fontSize: "0.65rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: "700" }}>{card.label}</span>
                    <h3 style={{ fontSize: "1.6rem", fontWeight: "800", marginTop: "4px", color: card.col }}>{card.val}</h3>
                    <span style={{ fontSize: "0.65rem", color: "#64748b", display: "block", marginTop: "2px" }}>{card.desc}</span>
                  </div>
                ))}
              </div>

              {/* SAFETY EMERGENCY BAR */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
                <button 
                  onClick={() => {
                    setSafetyLogType("SOS EMERGENCY DISPATCH");
                    setSosModalOpen(true);
                  }}
                  style={{ flexGrow: 1, backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "800", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyCenter: "center", gap: "6px" }}
                >
                  <ShieldAlert size={16} /> TRIGGER SOS EMERGENCY HOTLINE
                </button>
                <button 
                  onClick={() => {
                    setSafetyLogType("VEHICLE BREAKDOWN");
                    setSosModalOpen(true);
                  }}
                  style={{ backgroundColor: "#1e293b", border: "1px solid #475569", color: "#fff", padding: "12px 20px", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer" }}
                >
                  Vehicle Breakdown
                </button>
              </div>

              {/* OFFLINE ACTIONS QUEUE ALERTS */}
              {offlineSyncQueue.length > 0 && (
                <div style={{ backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid #f59e0b", color: "#f59e0b", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "0.8rem" }}>
                  ⚠️ You have <strong>{offlineSyncQueue.length}</strong> actions queued locally. Switch to Online Mode to sync them.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: JOBS QUEUE DESK */}
          {activeTab === "queue" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Route Jobs Queue ({sortedPendingJobs.length})</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Filter size={14} color="#64748b" />
                  <select 
                    value={jobsSortKey} 
                    onChange={(e) => setJobsSortKey(e.target.value)}
                    style={{ backgroundColor: "#1e293b", color: "#fff", border: "1px solid #334155", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem" }}
                  >
                    <option value="priority">Priority First</option>
                    <option value="cod_first">COD Orders First</option>
                  </select>
                </div>
              </div>

              {sortedPendingJobs.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
                  {sortedPendingJobs.map(job => {
                    const ord = orders.find(o => o.id === job.orderId);
                    if (!ord) return null;

                    return (
                      <div key={job.id} style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px" }}>
                        <div style={{ display: "flex", justifyBetween: "true", borderBottom: "1px solid #334155", paddingBottom: "8px", marginBottom: "12px" }}>
                          <strong>{ord.id}</strong>
                          <span style={{ color: "#3b82f6", fontWeight: "700" }}>Earning: ₹{job.earning}</span>
                        </div>

                        <div style={{ fontSize: "0.8rem", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
                          <div>👤 {ord.customerName} ({ord.customerPhone})</div>
                          <div style={{ paddingLeft: "16px" }}>📍 {ord.address}</div>
                          <div>💳 Payment: <strong>{ord.paymentMethod}</strong> ({ord.paymentStatus})</div>
                          <div>📦 Slot: {ord.deliverySlot}</div>
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          {job.status === "assigned" ? (
                            <>
                              <button 
                                onClick={() => triggerOpticalScan(job.id)}
                                style={{ flexGrow: 1, backgroundColor: "#334155", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}
                              >
                                Scan Package
                              </button>
                              <button 
                                onClick={() => handleConfirmPickup(job.id)}
                                style={{ flexGrow: 1, backgroundColor: "#3b82f6", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer" }}
                              >
                                Confirm Pickup
                              </button>
                            </>
                          ) : (
                            <>
                              <button 
                                onClick={() => {
                                  setSelectedJobId(job.id);
                                  setActiveTab("route");
                                }}
                                style={{ flexGrow: 1, backgroundColor: "#334155", border: "none", color: "#fff", padding: "8px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}
                              >
                                Route Map
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedJobId(job.id);
                                  setEnteredOtp("");
                                  setOtpError("");
                                  setCodAmountCollected("");
                                  setProofPhotoUrl("");
                                  setSignatureData("");
                                  setFailureReason("");
                                }}
                                style={{ flexGrow: 1, backgroundColor: "#10b981", border: "none", color: "#000", padding: "8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "800", cursor: "pointer" }}
                              >
                                Drop-off Complete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ border: "1px dashed #334155", padding: "40px", borderRadius: "10px", textAlign: "center" }}>
                  <CheckCircle size={36} color="#10b981" style={{ margin: "auto", marginBottom: "10px" }} />
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>All shipments completed! Online and waiting for warehouse hand-offs.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OPTIMIZED ROUTE MAP */}
          {activeTab === "route" && (
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Turn-by-Turn GPS Sequencing</h3>
              
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px", marginBottom: "16px" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#3b82f6", marginBottom: "12px" }}>Route Order Optimization</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {pendingJobs.map((job, idx) => {
                    const ord = orders.find(o => o.id === job.orderId);
                    return (
                      <div 
                        key={job.id} 
                        onClick={() => setSelectedJobId(job.id)}
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "10px", 
                          padding: "10px", 
                          backgroundColor: selectedJobId === job.id ? "rgba(59,130,246,0.1)" : "#0f172a", 
                          borderRadius: "8px",
                          border: selectedJobId === job.id ? "1px solid #3b82f6" : "1px solid transparent",
                          cursor: "pointer"
                        }}
                      >
                        <div style={{ backgroundColor: "#3b82f6", color: "#fff", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyCenter: "center", fontSize: "0.8rem", fontWeight: "800" }}>
                          {idx + 1}
                        </div>
                        <div style={{ flexGrow: 1 }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: "700", display: "block" }}>{ord?.customerName}</span>
                          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>{ord?.address}</span>
                        </div>
                        <ChevronRight size={14} color="#64748b" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedJobId && (
                <div style={{ backgroundColor: "#1e293b", border: "1px solid #3b82f6", borderRadius: "10px", padding: "20px" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#fff", marginBottom: "12px" }}>Active Navigation Steps</h4>
                  <div style={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "12px", fontSize: "0.75rem", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div>🚗 Exit warehouse gate, turn right onto Bypass. (1.5 km)</div>
                    <div>🚗 Turn left toward Benz Colony main road. (2.3 km)</div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                    <button onClick={() => setCallOverlayOpen(true)} style={{ flexGrow: 1, backgroundColor: "#1e293b", border: "1px solid #475569", color: "#fff", padding: "8px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", justifyCenter: "center", gap: "4px" }}>
                      <Phone size={12} color="#10b981" /> Call Customer
                    </button>
                    <button onClick={() => setSmsTemplateOpen(true)} style={{ flexGrow: 1, backgroundColor: "#1e293b", border: "1px solid #475569", color: "#fff", padding: "8px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}>
                      Send ETA SMS
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: VEHICLE AUDIT */}
          {activeTab === "vehicle" && (
            <div style={{ maxWidth: "600px" }}>
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px" }}>
                <h4 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "12px" }}>Daily Pre-Shift Checklist</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8rem", marginBottom: "16px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input type="checkbox" checked={inspectedBrakes} onChange={() => setInspectedBrakes(!inspectedBrakes)} style={{ width: "16px", height: "16px" }} />
                    <span>Brake pads check - Functional</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input type="checkbox" checked={inspectedLights} onChange={() => setInspectedLights(!inspectedLights)} style={{ width: "16px", height: "16px" }} />
                    <span>Signal headlights check - Verified</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input type="checkbox" checked={inspectedFuel} onChange={() => setInspectedFuel(!inspectedFuel)} style={{ width: "16px", height: "16px" }} />
                    <span>Fuel/Battery levels checked - OK</span>
                  </label>
                </div>
                <button onClick={() => alert("Vehicle safety report filed.")} style={{ width: "100%", backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
                  File Safety Report
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: PAYOUTS & COD */}
          {activeTab === "ledger" && (
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "16px" }}>Payouts Ledger & COD Settlements</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }} className="responsive-grid">
                
                <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "12px" }}>Withdraw Commissions</h4>
                  <form onSubmit={handlePayoutRequest} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <select value={withdrawMethod} onChange={(e) => setWithdrawMethod(e.target.value)} style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", padding: "8px", borderRadius: "6px" }}>
                      <option value="UPI">UPI Transfer</option>
                      <option value="Bank">Bank Account Payout</option>
                    </select>
                    <input type="text" placeholder="UPI ID / Bank details" value={withdrawUpi} onChange={(e) => setWithdrawUpi(e.target.value)} style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", padding: "8px", borderRadius: "6px" }} />
                    <input type="number" placeholder="Withdrawal Amount (₹)" value={withdrawAmountInput} onChange={(e) => setWithdrawAmountInput(e.target.value)} style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", padding: "8px", borderRadius: "6px" }} />
                    <button type="submit" style={{ width: "100%", backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "700", cursor: "pointer" }}>
                      Transfer Now
                    </button>
                  </form>
                </div>

                <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "16px" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "10px" }}>Payout History</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.75rem" }}>
                    {payouts.map(p => (
                      <div key={p.id} style={{ borderBottom: "1px solid #33415533", paddingBottom: "6px", display: "flex", justifyBetween: "true" }}>
                        <span>{p.method} Payout Complete</span>
                        <strong style={{ color: "#ef4444" }}>-₹{p.amount}</strong>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: AI CO-PILOT CHAT */}
          {activeTab === "ai-assistant" && (
            <div style={{ maxWidth: "600px", margin: "auto" }}>
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #3b82f6", borderRadius: "10px", overflow: "hidden" }}>
                
                <div style={{ backgroundColor: "#0f172a", padding: "12px 16px", borderBottom: "1px solid #334155", display: "flex", gap: "8px", alignItems: "center" }}>
                  <Sparkles size={16} color="#3b82f6" fill="#3b82f6" />
                  <strong>DMS Driver Assistant</strong>
                </div>

                <div style={{ height: "240px", overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      style={{ 
                        alignSelf: msg.sender === "ai" ? "flex-start" : "flex-end",
                        maxWidth: "85%",
                        backgroundColor: msg.sender === "ai" ? "#0f172a" : "#3b82f6",
                        color: "#fff",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        fontSize: "0.75rem"
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleChatSubmit} style={{ display: "flex", padding: "10px", borderTop: "1px solid #334155", backgroundColor: "#0f172a" }}>
                  <input 
                    type="text" 
                    placeholder="Ask AI driver co-pilot..." 
                    style={{ flexGrow: 1, backgroundColor: "transparent", color: "#fff", border: "none", fontSize: "0.75rem", outline: "none" }}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit" style={{ backgroundColor: "transparent", border: "none", color: "#3b82f6", cursor: "pointer" }}>
                    <Send size={16} />
                  </button>
                </form>

              </div>
            </div>
          )}

          {/* TAB 7: PROFILE STATION */}
          {activeTab === "profile" && (
            <div style={{ maxWidth: "600px" }}>
              <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "10px", padding: "24px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "16px" }}>Manage Partner Account Details</h3>
                <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div className="portal-form-group">
                    <label className="portal-label">Driver Full Name</label>
                    <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={editName} onChange={(e) => setEditName(e.target.value)} required />
                  </div>
                  <div className="portal-form-group">
                    <label className="portal-label">Contact Phone</label>
                    <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required />
                  </div>
                  <div className="portal-form-group">
                    <label className="portal-label">Vehicle Registration Number</label>
                    <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={editVehicle} onChange={(e) => setEditVehicle(e.target.value)} required />
                  </div>
                  <div className="portal-form-group">
                    <label className="portal-label">Delivery Zone</label>
                    <input type="text" className="portal-input" style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155" }} value={editZone} onChange={(e) => setEditZone(e.target.value)} required />
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
                  <button type="submit" style={{ width: "100%", backgroundColor: "#3b82f6", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", marginTop: "10px" }}>
                    Save Profile Changes
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* OPTICAL SCAN VERIFICATION MODAL */}
      {scanModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyCenter: "center" }}>
          <div style={{ backgroundColor: "#1e293b", border: "1px solid #3b82f6", borderRadius: "12px", width: "320px", padding: "20px", position: "relative", margin: "auto" }}>
            <button onClick={() => setScanModalOpen(false)} style={{ position: "absolute", right: "12px", top: "12px", backgroundColor: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>✕</button>
            <h4 style={{ color: "#fff", fontWeight: "800", marginBottom: "14px" }}>Route Barcode Scan</h4>
            
            <div style={{ width: "100%", height: "140px", backgroundColor: "#000", border: "1px solid #334155", display: "flex", alignItems: "center", justifyCenter: "center", position: "relative" }}>
              <div style={{ position: "absolute", left: 0, right: 0, height: "2px", backgroundColor: "#ef4444", boxShadow: "0 0 8px #ef4444" }}></div>
              <div style={{ width: "80px", height: "80px", border: "2px dashed #3b82f6", opacity: 0.7 }}></div>
            </div>

            <div style={{ marginTop: "12px", padding: "8px", backgroundColor: "#0f172a", borderRadius: "4px", fontSize: "0.7rem", color: "#94a3b8" }}>
              {scanStatusMsg}
            </div>

            <button onClick={() => setScanModalOpen(false)} style={{ width: "100%", marginTop: "14px", backgroundColor: "#334155", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}>
              Close Scan
            </button>
          </div>
        </div>
      )}

      {/* SOS EMERGENCY LOG TRIGGER OVERLAY */}
      {sosModalOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.9)", zIndex: 1000, display: "flex", alignItems: "center", justifyCenter: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#1e293b", border: "2px solid #ef4444", borderRadius: "12px", width: "340px", padding: "20px", textAlign: "center", margin: "auto" }}>
            <AlertTriangle size={48} color="#ef4444" style={{ margin: "auto", marginBottom: "14px" }} />
            <h3 style={{ color: "#fff", fontWeight: "800", fontSize: "1.1rem" }}>{safetyLogType}</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: "10px 0 16px" }}>
              This will immediately trigger a high-priority push warning to logistics coordinators and share your current active GPS coordinates.
            </p>
            
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setSosModalOpen(false)} style={{ flexGrow: 1, backgroundColor: "#334155", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontSize: "0.8rem", cursor: "pointer" }}>Cancel</button>
              <button 
                onClick={() => {
                  alert("SOS Dispatch triggered! Emergency coordinators have been paged.");
                  setSosModalOpen(false);
                }}
                style={{ flexGrow: 1, backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", fontWeight: "800", fontSize: "0.8rem", cursor: "pointer" }}
              >
                SEND SOS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALL OVERLAY OVERLAY */}
      {callOverlayOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15,23,42,0.95)", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", justifyCenter: "center", padding: "30px" }}>
          <div style={{ textAlign: "center", margin: "auto" }}>
            <div style={{ backgroundColor: "#10b981", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyCenter: "center", margin: "0 auto 20px" }}>
              <Phone size={36} color="#fff" />
            </div>
            <h3 style={{ fontSize: "1.4rem", color: "#fff", fontWeight: "800" }}>Calling Customer...</h3>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "6px" }}>Line Secure via VNatural Caller mask</p>
            
            <button 
              onClick={() => setCallOverlayOpen(false)}
              style={{ marginTop: "40px", backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "12px 30px", borderRadius: "30px", fontWeight: "700", cursor: "pointer" }}
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* OTP DROPOFF VERIFICATION DIALOG MODAL */}
      {selectedJobId && !failedDeliveryModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px"
        }}>
          <div style={{ backgroundColor: "#1e293b", border: "1px solid #3b82f6", borderRadius: "12px", width: "340px", padding: "20px", margin: "auto", position: "relative" }}>
            <button onClick={() => setSelectedJobId("")} style={{ position: "absolute", right: "12px", top: "12px", backgroundColor: "transparent", border: "none", color: "#64748b", cursor: "pointer" }}>✕</button>
            <h3 style={{ color: "#fff", fontSize: "1rem", fontWeight: "800", marginBottom: "10px" }}>Verify OTP Security Code</h3>
            
            <form onSubmit={handleVerifyOtpSubmit}>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: "14px" }}>
                Enter the 4-digit drop-off verification code from the customer's portal screen.
              </p>

              {otpError && (
                <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", padding: "8px", borderRadius: "6px", fontSize: "0.7rem", marginBottom: "10px" }}>
                  {otpError}
                </div>
              )}

              <div className="portal-form-group" style={{ marginBottom: "16px" }}>
                <input 
                  type="text" 
                  className="portal-input" 
                  maxLength={4} 
                  placeholder="e.g. 1948" 
                  value={enteredOtp} 
                  onChange={(e) => setEnteredOtp(e.target.value)} 
                  style={{ width: "100%", backgroundColor: "#0f172a", color: "#fff", border: "1px solid #3b82f6", textAlign: "center", fontSize: "1.2rem", fontWeight: "bold", letterSpacing: "4px" }}
                  required 
                />
                <span style={{ fontSize: "0.65rem", color: "#64748b", marginTop: "4px", display: "block", textAlign: "center" }}>
                  (Testing hint: see Customer profile or Admin orders list)
                </span>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button type="button" className="btn-portal-secondary" style={{ width: "40%" }} onClick={() => setSelectedJobId("")}>Cancel</button>
                <button type="submit" className="btn-portal" style={{ width: "60%" }}>Verify & Complete</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="portal-bottom-nav mobile-only" style={{ display: "none", backgroundColor: "#0b1329", borderTop: "1px solid #223555" }}>
        {[
          { id: "dashboard", label: "Dashboard", icon: <Sliders size={18} /> },
          { id: "queue", label: "Queue", icon: <Layers size={18} /> },
          { id: "route", label: "Route", icon: <MapPin size={18} /> },
          { id: "ledger", label: "Commissions", icon: <DollarSign size={18} /> },
          { id: "ai-assistant", label: "Assistant", icon: <Sparkles size={18} /> }
        ].map(menu => (
          <div 
            key={menu.id} 
            onClick={() => setActiveTab(menu.id)}
            className={`portal-bottom-nav-item ${activeTab === menu.id ? "active" : ""}`}
            style={{ color: activeTab === menu.id ? "#3b82f6" : "#94a3b8" }}
          >
            {menu.icon}
            <span>{menu.label}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
