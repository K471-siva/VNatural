import React, { useState } from "react";
import { useDb } from "../../context/DbContext";
import { CreditCard, MapPin, Calendar, CheckCircle2, Ticket, QrCode, FileText, ArrowRight, Home } from "lucide-react";

export const Checkout = ({ setPage }) => {
  const { cart, currentUser, checkoutCart, updateProfile, t } = useDb();

  const [step, setStep] = useState(1);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [deliverySlot, setDeliverySlot] = useState("Morning (6 AM - 9 AM)");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Simulated payment states
  const [upiId, setUpiId] = useState("user@ybl");
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [phonePeMobile, setPhonePeMobile] = useState("9876543210");
  const [phonePeOtpSent, setPhonePeOtpSent] = useState(false);
  const [phonePeOtp, setPhonePeOtp] = useState("");
  const [paytmMobile, setPaytmMobile] = useState("9876543210");
  const [paytmPin, setPaytmPin] = useState("");

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.isSubscribed ? Math.round(item.price * 0.85) : item.price;
    return sum + price * item.quantity;
  }, 0);

  const finalTotal = Math.max(0, cartTotal - couponDiscount);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "ORGANIC100") {
      setCouponDiscount(100);
      alert("Coupon applied! ₹100 discount added.");
    } else if (couponCode.toUpperCase() === "VNATURAL15") {
      const discount = Math.round(cartTotal * 0.15);
      setCouponDiscount(discount);
      alert(`Coupon applied! 15% discount (₹${discount}) added.`);
    } else {
      alert("Invalid Coupon Code. Try 'VNATURAL15' or 'ORGANIC100'.");
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "VNatural Wallet") {
      const balance = currentUser.walletBalance !== undefined ? currentUser.walletBalance : 250;
      if (balance < finalTotal) {
        alert("Insufficient wallet balance. Please add funds in your Profile page or choose a different payment method.");
        return;
      }
      updateProfile({
        ...currentUser,
        walletBalance: balance - finalTotal
      });
    } else if (paymentMethod !== "Cash on Delivery" && !isSimulatingPayment) {
      // Show simulated payment screen first
      setIsSimulatingPayment(true);
      return;
    }

    const addressObj = currentUser.addresses[selectedAddressIndex];
    const fullAddress = `${addressObj.street}, ${addressObj.area}, ${addressObj.city} - ${addressObj.pincode}`;

    const order = checkoutCart(paymentMethod, fullAddress, deliverySlot);
    if (order) {
      setPlacedOrder(order);
      setStep(4); // Order Success Page
    }
  };

  const handleSimulatedPaymentSuccess = () => {
    setIsSimulatingPayment(false);
    const addressObj = currentUser.addresses[selectedAddressIndex];
    const fullAddress = `${addressObj.street}, ${addressObj.area}, ${addressObj.city} - ${addressObj.pincode}`;

    const order = checkoutCart(paymentMethod, fullAddress, deliverySlot);
    if (order) {
      setPlacedOrder(order);
      setStep(4);
    }
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <h3>Your cart is empty.</h3>
        <button className="btn-primary" onClick={() => setPage("catalog")}>Go Shopping</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 16px", animation: "fadeIn 0.3s ease-out" }}>
      {step < 4 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "30px", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase" }}>
          <span style={{ color: step === 1 ? "var(--c-primary)" : "var(--c-text-muted)" }}>1. {t("Address", "చిరునామా")}</span>
          <span style={{ color: "var(--c-border)" }}>&gt;</span>
          <span style={{ color: step === 2 ? "var(--c-primary)" : "var(--c-text-muted)" }}>2. {t("Delivery Slot", "డెలివరీ సమయం")}</span>
          <span style={{ color: "var(--c-border)" }}>&gt;</span>
          <span style={{ color: step === 3 ? "var(--c-primary)" : "var(--c-text-muted)" }}>3. {t("Payment", "చెల్లింపు")}</span>
        </div>
      )}

      {/* Main step forms */}
      {step < 4 && (
        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "30px" }}>
          <div>
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="portal-card">
                <h3 className="portal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin size={20} /> {t("Select Delivery Address", "డెలివరీ చిరునామా ఎంచుకోండి")}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {currentUser.addresses.map((addr, idx) => (
                    <label key={addr.id} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      border: `1.5px solid ${selectedAddressIndex === idx ? "var(--c-primary)" : "var(--c-border)"}`,
                      padding: "16px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      backgroundColor: selectedAddressIndex === idx ? "var(--c-primary-light)" : "#fff",
                      transition: "all 0.2s"
                    }}>
                      <input
                        type="radio"
                        name="address_select"
                        checked={selectedAddressIndex === idx}
                        onChange={() => setSelectedAddressIndex(idx)}
                        style={{ accentColor: "var(--c-primary)" }}
                      />
                      <div>
                        <strong style={{ display: "block" }}>{addr.type}</strong>
                        <span style={{ fontSize: "0.85rem", color: "var(--c-text-muted)" }}>
                          {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                <button className="btn-primary" onClick={() => setStep(2)} style={{ marginTop: "20px", width: "100%", justifyContent: "center" }}>
                  {t("Continue to Delivery Schedule", "డెలివరీ షెడ్యూల్ చూడండి")} <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Step 2: Delivery Slot */}
            {step === 2 && (
              <div className="portal-card">
                <h3 className="portal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Calendar size={20} /> {t("Select Delivery Time Slot", "డెలివరీ సమయాన్ని ఎంచుకోండి")}
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--c-text-muted)", marginBottom: "16px" }}>
                  {t("We offer local eco-friendly deliveries twice daily to ensure harvest freshness.", "తాజా కూరగాయల కోసం మేము రోజుకు రెండుసార్లు డెలివరీ సదుపాయం అందిస్తాము.")}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { slot: "Morning (6 AM - 9 AM)", desc: t("Recommended for milk, country eggs & fresh leafy greens", "పాలు, గుడ్లు, తాజా కూరగాయల కొరకు") },
                    { slot: "Evening (5 PM - 8 PM)", desc: t("Great for pantry staples and grains replenishments", "నిత్యావసర సరుకుల కొరకు") }
                  ].map((s) => (
                    <label key={s.slot} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      border: `1.5px solid ${deliverySlot === s.slot ? "var(--c-primary)" : "var(--c-border)"}`,
                      padding: "16px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      backgroundColor: deliverySlot === s.slot ? "var(--c-primary-light)" : "#fff"
                    }}>
                      <input
                        type="radio"
                        name="slot_select"
                        checked={deliverySlot === s.slot}
                        onChange={() => setDeliverySlot(s.slot)}
                        style={{ accentColor: "var(--c-primary)" }}
                      />
                      <div>
                        <strong>{s.slot}</strong>
                        <span style={{ display: "block", fontSize: "0.8rem", color: "var(--c-text-muted)" }}>{s.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button className="btn-secondary" onClick={() => setStep(1)}>{t("Back", "వెనుకకు")}</button>
                  <button className="btn-primary" onClick={() => setStep(3)} style={{ flexGrow: 1, justifyContent: "center" }}>
                    {t("Continue to Payment", "చెల్లింపులకు వెళ్ళండి")} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="portal-card">
                <h3 className="portal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CreditCard size={20} /> {t("Select Payment Method", "చెల్లింపు పద్ధతిని ఎంచుకోండి")}
                </h3>

                {!isSimulatingPayment ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { id: "UPI", title: "UPI (Paytm, PhonePe, Google Pay)", subtitle: "Scan dynamic QR or enter UPI ID" },
                      { id: "PhonePe", title: "PhonePe Wallet", subtitle: "Direct wallet link with OTP confirmation" },
                      { id: "Paytm", title: "Paytm Wallet", subtitle: "Instant secure link" },
                      { id: "VNatural Wallet", title: "VNatural Digital Wallet", subtitle: `Available Balance: ₹${currentUser.walletBalance !== undefined ? currentUser.walletBalance : 250}` },
                      { id: "Cash on Delivery", title: t("Cash on Delivery (COD)", "క్యాష్ ఆన్ డెలివరీ"), subtitle: "Pay at door via cash/UPI" }
                    ].map((p) => (
                      <label key={p.id} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        border: `1.5px solid ${paymentMethod === p.id ? "var(--c-primary)" : "var(--c-border)"}`,
                        padding: "16px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        backgroundColor: paymentMethod === p.id ? "var(--c-primary-light)" : "#fff"
                      }}>
                        <input
                          type="radio"
                          name="payment_select"
                          checked={paymentMethod === p.id}
                          onChange={() => setPaymentMethod(p.id)}
                          style={{ accentColor: "var(--c-primary)" }}
                        />
                        <div>
                          <strong>{p.title}</strong>
                          <span style={{ display: "block", fontSize: "0.8rem", color: "var(--c-text-muted)" }}>{p.subtitle}</span>
                        </div>
                      </label>
                    ))}

                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                      <button className="btn-secondary" onClick={() => setStep(2)}>{t("Back", "వెనుకకు")}</button>
                      <button className="btn-accent" onClick={handlePlaceOrder} style={{ flexGrow: 1, justifyContent: "center" }}>
                        {paymentMethod === "Cash on Delivery" ? t("Place Order (COD)", "ఆర్డర్ ప్లేస్ చేయి (COD)") : t("Simulate Digital Payment", "ఆన్‌లైన్ పేమెంట్ చేయి")}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* SIMULATED ONLINE PAYMENT GATEWAY PANEL */
                  <div style={{ padding: "20px", border: "1.5px solid var(--c-accent)", borderRadius: "12px", backgroundColor: "#fff", textAlign: "center" }}>
                    
                    {/* A. PhonePe Screen */}
                    {paymentMethod === "PhonePe" && (
                      <div style={{ animation: "fadeIn 0.2s" }}>
                        <div style={{ backgroundColor: "#5f259f", color: "#fff", padding: "12px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                          <strong>PhonePe Secure Wallet</strong>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "var(--c-text-muted)", marginBottom: "16px" }}>
                          {t(`Link and authorize wallet deduction of ₹${finalTotal}`, `PhonePe వాలెట్ నుండి ₹${finalTotal} చెల్లించండి`)}
                        </p>

                        {!phonePeOtpSent ? (
                          <div style={{ maxWidth: "280px", margin: "0 auto 16px", textAlign: "left" }}>
                            <div className="portal-form-group">
                              <label className="portal-label">Linked Mobile Number</label>
                              <input type="text" className="portal-input" value={phonePeMobile} onChange={(e) => setPhonePeMobile(e.target.value)} style={{ textAlign: "center" }} />
                            </div>
                            <button className="btn-portal" onClick={() => setPhonePeOtpSent(true)} style={{ width: "100%", backgroundColor: "#5f259f", color: "#fff", cursor: "pointer" }}>
                              Send Verification OTP
                            </button>
                          </div>
                        ) : (
                          <div style={{ maxWidth: "280px", margin: "0 auto 16px", textAlign: "left" }}>
                            <div className="portal-form-group">
                              <label className="portal-label">Enter 4-Digit SMS Code (hint: 1234)</label>
                              <input type="text" className="portal-input" placeholder="1234" value={phonePeOtp} onChange={(e) => setPhonePeOtp(e.target.value)} style={{ textAlign: "center", letterSpacing: "8px", fontWeight: "bold" }} />
                            </div>
                            <button 
                              className="btn-portal" 
                              onClick={() => {
                                if (phonePeOtp === "1234") {
                                  handleSimulatedPaymentSuccess();
                                } else {
                                  alert("Incorrect SMS OTP code. Type 1234 for testing.");
                                }
                              }} 
                              style={{ width: "100%", backgroundColor: "#5f259f", color: "#fff", cursor: "pointer" }}
                            >
                              Verify & Pay ₹{finalTotal}
                            </button>
                            <button style={{ fontSize: "0.75rem", display: "block", margin: "8px auto 0", color: "#5f259f", textDecoration: "underline", cursor: "pointer" }} onClick={() => setPhonePeOtpSent(false)}>
                              Back
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* B. Paytm Screen */}
                    {paymentMethod === "Paytm" && (
                      <div style={{ animation: "fadeIn 0.2s" }}>
                        <div style={{ backgroundColor: "#00baf2", color: "#fff", padding: "12px", borderRadius: "8px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                          <strong>Paytm Wallet Gateway</strong>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "var(--c-text-muted)", marginBottom: "16px" }}>
                          {t(`Confirm payment of ₹${finalTotal} from linked Paytm Account`, `Paytm వాలెట్ నుండి ₹${finalTotal} బదిలీ చేయండి`)}
                        </p>
                        
                        <div style={{ maxWidth: "280px", margin: "0 auto 16px", textAlign: "left" }}>
                          <div className="portal-form-group">
                            <label className="portal-label">Paytm Mobile</label>
                            <input type="text" className="portal-input" value={paytmMobile} onChange={(e) => setPaytmMobile(e.target.value)} style={{ textAlign: "center" }} />
                          </div>
                          <div className="portal-form-group">
                            <label className="portal-label">Enter 4-Digit Wallet PIN (hint: 0000)</label>
                            <input type="password" placeholder="0000" className="portal-input" value={paytmPin} onChange={(e) => setPaytmPin(e.target.value)} style={{ textAlign: "center", letterSpacing: "8px", fontWeight: "bold" }} />
                          </div>
                          <button 
                            className="btn-portal" 
                            onClick={() => {
                              if (paytmPin === "0000") {
                                handleSimulatedPaymentSuccess();
                              } else {
                                alert("Incorrect Wallet PIN. Enter 0000 for testing.");
                              }
                            }} 
                            style={{ width: "100%", backgroundColor: "#00baf2", color: "#fff", cursor: "pointer" }}
                          >
                            Pay from Paytm Wallet (₹1,500 Bal)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* C. UPI Screen */}
                    {paymentMethod === "UPI" && (
                      <div style={{ animation: "fadeIn 0.2s" }}>
                        <div className="flex align-center justify-center gap-sm" style={{ marginBottom: "12px", color: "var(--c-primary)" }}>
                          <QrCode size={36} />
                          <h4 style={{ fontSize: "1.2rem", fontWeight: "800" }}>VNatural UPI Payment Portal</h4>
                        </div>
                        <p style={{ fontSize: "0.85rem", color: "var(--c-text-muted)", marginBottom: "16px" }}>
                          {t("Simulating payment via UPI", "UPI ద్వారా సురక్షితమైన చెల్లింపు")}
                        </p>

                        <div style={{ display: "inline-block", padding: "16px", backgroundColor: "#f1f5f9", borderRadius: "12px", marginBottom: "16px" }}>
                          <div style={{ width: "160px", height: "160px", backgroundColor: "#334155", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", borderRadius: "8px", position: "relative" }}>
                            <span style={{ color: "#fff", fontSize: "0.85rem", padding: "10px", fontWeight: "700" }}>DYNAMIC UPI QR CODE FOR ₹{finalTotal}</span>
                          </div>
                          <span style={{ fontSize: "0.75rem", color: "var(--c-text-muted)", fontWeight: "600" }}>merchant: vnatural@upi</span>
                        </div>

                        <div className="portal-form-group" style={{ maxWidth: "250px", margin: "0 auto 16px", textAlign: "left" }}>
                          <label className="portal-label">Enter UPI ID</label>
                          <input 
                            type="text" 
                            className="portal-input" 
                            value={upiId} 
                            onChange={(e) => setUpiId(e.target.value)} 
                            style={{ textAlign: "center" }}
                          />
                        </div>

                        <button className="btn-portal" onClick={handleSimulatedPaymentSuccess} style={{ width: "100%", maxWidth: "250px", color: "#fff", cursor: "pointer" }}>
                          {t("Confirm Paid (Success)", "ధృవీకరించు (సక్సెస్)")}
                        </button>
                      </div>
                    )}

                    {/* General Cancel button */}
                    <div style={{ marginTop: "16px", borderTop: "1px solid var(--p-border)", paddingTop: "12px" }}>
                      <button className="btn-portal-secondary" onClick={() => setIsSimulatingPayment(false)} style={{ padding: "4px 12px", fontSize: "0.8rem", cursor: "pointer" }}>
                        {t("Cancel Payment", "చెల్లింపు రద్దు")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart summary panel */}
          <div>
            <div style={{ backgroundColor: "#fff", border: "1px solid var(--c-border)", borderRadius: "16px", padding: "20px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", borderBottom: "1.5px solid var(--c-border)", paddingBottom: "10px", marginBottom: "16px" }}>
                {t("Review Your Order", "మీ ఆర్డర్ సరుకులు")}
              </h3>

              {/* Items List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", borderBottom: "1px solid var(--c-border)", paddingBottom: "16px" }}>
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.isSubscribed}`} className="flex justify-between" style={{ fontSize: "0.85rem" }}>
                    <span>{item.quantity}x {t(item.name, item.teluguName)}</span>
                    <strong>₹{(item.isSubscribed ? Math.round(item.price * 0.85) : item.price) * item.quantity}</strong>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Form */}
              <div className="portal-form-group" style={{ marginBottom: "20px" }}>
                <label className="portal-label flex align-center gap-xs"><Ticket size={14} /> {t("Promo Coupon Code", "కూపన్ కోడ్")}</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  <input
                    type="text"
                    className="portal-input"
                    placeholder="e.g. VNATURAL15"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{ flexGrow: 1, textTransform: "uppercase" }}
                  />
                  <button className="btn-accent" onClick={handleApplyCoupon} style={{ padding: "4px 12px" }}>
                    {t("Apply", "వర్తింపజేయి")}
                  </button>
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--c-text-muted)", marginTop: "4px" }}>
                  {t("Use VNATURAL15 for 15% off basket total or ORGANIC100.", "VNATURAL15 తో 15% మరియు ORGANIC100 తో ₹100 రాయితీ పొందండి.")}
                </span>
              </div>

              {/* Subtotals */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem" }}>
                <div className="flex justify-between">
                  <span>{t("Items total", "సరుకుల మొత్తం")}</span>
                  <span>₹{cartTotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between" style={{ color: "var(--error)" }}>
                    <span>{t("Coupon Discount", "కూపన్ రాయితీ")}</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between" style={{ borderTop: "1.5px solid var(--c-border)", paddingTop: "10px", fontSize: "1.1rem", color: "var(--c-primary)", fontWeight: "800" }}>
                  <span>{t("Total Amount Due", "మొత్తం బిల్లు")}</span>
                  <span>₹{finalTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: SUCCESS PAGE / INVOICE */}
      {step === 4 && placedOrder && (
        <div style={{ maxWidth: "650px", margin: "0 auto", textAlign: "center", animation: "slideUp 0.4s ease-out" }}>
          <CheckCircle2 size={64} color="var(--success)" style={{ margin: "0 auto 16px" }} />
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", color: "var(--c-primary)", marginBottom: "8px" }}>
            {t("Order Placed Successfully!", "ఆర్డర్ విజయవంతంగా పూర్తయింది!")}
          </h1>
          <p style={{ color: "var(--c-text-muted)", marginBottom: "30px" }}>
            {t(`Thank you, ${currentUser.name}! Your order has been registered in the system. Our warehouse team is already packing it.`, 
               `ధన్యవాదాలు, ${currentUser.name}! మీ ఆర్డర్ విజయవంతంగా సిస్టమ్‌లో చేరింది.`)}
          </p>

          {/* Premium Invoice Receipt */}
          <div style={{
            backgroundColor: "#fff",
            border: "1.5px solid var(--c-border)",
            borderRadius: "16px",
            padding: "24px",
            textAlign: "left",
            boxShadow: "var(--shadow-md)",
            marginBottom: "30px"
          }}>
            <div className="flex justify-between" style={{ borderBottom: "1.5px solid var(--c-border)", paddingBottom: "12px", marginBottom: "16px" }}>
              <div>
                <h3 style={{ color: "var(--c-primary)", fontWeight: "800" }}>VNATURAL ORGANICS</h3>
                <span style={{ fontSize: "0.8rem", color: "var(--c-text-muted)" }}>www.vnatural.com</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <strong style={{ display: "block" }}>{t("INVOICE RECEIPT", "రసీదు పత్రం")}</strong>
                <span style={{ fontSize: "0.8rem", color: "var(--c-text-muted)" }}>ID: {placedOrder.id}</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "0.85rem", marginBottom: "20px" }}>
              <div>
                <span style={{ color: "var(--c-text-muted)" }}>{t("Delivered To", "డెలివరీ అడ్రస్")}:</span>
                <strong style={{ display: "block", marginTop: "2px" }}>{placedOrder.customerName}</strong>
                <span style={{ display: "block", color: "var(--c-text-muted)" }}>{placedOrder.address}</span>
              </div>
              <div>
                <span style={{ color: "var(--c-text-muted)" }}>{t("Delivery Slot & OTP", "డెలివరీ సమయం & OTP")}:</span>
                <strong style={{ display: "block", marginTop: "2px", color: "var(--c-primary)" }}>{placedOrder.deliverySlot}</strong>
                <div style={{ marginTop: "6px", backgroundColor: "var(--c-primary-light)", padding: "4px 8px", borderRadius: "4px", display: "inline-block" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--c-primary)" }}>{t("SECURITY OTP", "సెక్యూరిటీ OTP")}: </span>
                  <strong style={{ color: "var(--c-primary)", fontSize: "0.95rem" }}>{placedOrder.otp}</strong>
                </div>
                <span style={{ display: "block", fontSize: "0.7rem", color: "var(--c-text-muted)", marginTop: "4px" }}>
                  * {t("Provide this OTP to the delivery agent to confirm drop-off.", "సరుకులు అందిన తరువాత డెలివరీ బాయ్‌కి ఈ OTP చెప్పండి.")}
                </span>
              </div>
            </div>

            {/* Items */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", marginBottom: "20px" }}>
              <thead>
                <tr style={{ borderBottom: "1.5px solid var(--c-border)" }}>
                  <th style={{ textAlign: "left", padding: "8px 0" }}>{t("Product Description", "ఉత్పత్తి")}</th>
                  <th style={{ textAlign: "center", padding: "8px 0" }}>{t("Qty", "క్వాంటిటీ")}</th>
                  <th style={{ textAlign: "right", padding: "8px 0" }}>{t("Total Price", "ధర")}</th>
                </tr>
              </thead>
              <tbody>
                {placedOrder.items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--c-border)" }}>
                    <td style={{ padding: "8px 0" }}>{item.name} {item.isSubscribed && `(Sub)`}</td>
                    <td style={{ textAlign: "center", padding: "8px 0" }}>{item.quantity}</td>
                    <td style={{ textAlign: "right", padding: "8px 0" }}>₹{item.price * item.quantity}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2" style={{ textAlign: "right", fontWeight: "bold", padding: "12px 0 0" }}>{t("Net Bill Paid", "చెల్లించిన మొత్తం")}:</td>
                  <td style={{ textAlign: "right", fontWeight: "bold", padding: "12px 0 0", color: "var(--c-primary)", fontSize: "1.1rem" }}>
                    ₹{placedOrder.total}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex align-center justify-between" style={{ borderTop: "1px solid var(--c-border)", paddingTop: "12px", fontSize: "0.75rem", color: "var(--c-text-muted)" }}>
              <span>Payment Mode: {placedOrder.paymentMethod}</span>
              <span>Status: {placedOrder.paymentStatus}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => setPage("catalog")}>
              {t("Continue Shopping", "మరిన్ని వస్తువులు కొనుగోలు చేయి")}
            </button>
            <button className="btn-secondary" onClick={() => setPage("profile")}>
              {t("Track Subscriptions", "జాబితా చూడండి")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
