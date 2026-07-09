import React, { useState, useEffect } from "react";
import { useDb } from "../../context/DbContext";
import { Stars } from "../../components/common/Stars";
import { ChevronLeft, ShieldCheck, Leaf, Calendar, Info, Star, MessageSquare } from "lucide-react";

export const ProductDetail = ({ productId, setPage, setSelectedProductId }) => {
  const { products, reviews, submitReview, addToCart, t } = useDb();
  const [activeTab, setActiveTab] = useState("desc");
  const [quantity, setQuantity] = useState(1);
  const [purchaseMode, setPurchaseMode] = useState("once"); // "once" or "sub"

  // Form review states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const product = products.find((p) => p.id === productId);
  const [recentIds, setRecentIds] = useState([]);

  useEffect(() => {
    if (!product) return;
    const stored = JSON.parse(sessionStorage.getItem("vnatural_recent_viewed")) || [];
    const updated = [product.id, ...stored.filter(id => id !== product.id)].slice(0, 5);
    sessionStorage.setItem("vnatural_recent_viewed", JSON.stringify(updated));
    setRecentIds(updated);
  }, [productId, product]);

  const bundleProduct = products.find(p => p.id !== product.id) || null;
  const handleBuyBundle = () => {
    if (!bundleProduct) return;
    addToCart(product, 1);
    addToCart(bundleProduct, 1);
    alert(`Bundle added! ${product.name} and ${bundleProduct.name} are in your cart with a discount!`);
  };

  if (!product) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
        <h3>Product not found.</h3>
        <button className="btn-primary" onClick={() => setPage("catalog")}>Back to Catalog</button>
      </div>
    );
  }

  // Get matching product reviews
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, purchaseMode === "sub");
    alert(`${product.name} (${quantity} qty) added to cart as ${purchaseMode === "sub" ? "Subscription" : "One-time Purchase"}!`);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    submitReview(product.id, newRating, newComment);
    setNewComment("");
    setNewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  // 15% discount for subscriptions
  const finalPrice = purchaseMode === "sub" ? Math.round(product.price * 0.85) : product.price;

  return (
    <div className="container" style={{ padding: "30px 16px", animation: "fadeIn 0.3s ease-out" }}>
      {/* Back button */}
      <button
        onClick={() => setPage("catalog")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: "var(--c-primary)",
          fontWeight: "600",
          marginBottom: "20px",
          cursor: "pointer"
        }}
      >
        <ChevronLeft size={18} /> {t("Back to Catalog", "కేటలాగ్‌కు తిరిగి వెళ్లు")}
      </button>

      {/* Grid Layout */}
      <div className="detail-grid">
        {/* Left Column: Image & Sourcing Info */}
        <div>
          <div className="detail-gallery">
            <img src={product.image} alt={product.name} />
          </div>

          {/* Sourcing Info Box */}
          <div style={{
            backgroundColor: "var(--c-bg-pure)",
            border: "1px solid var(--c-border)",
            borderRadius: "12px",
            padding: "20px",
            marginTop: "20px"
          }}>
            <h4 style={{ fontFamily: "var(--font-display)", fontWeight: "700", color: "var(--c-primary)", display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <ShieldCheck size={18} color="var(--c-accent)" /> {t("Farm Source Transparency", "రైతు మూలం వివరాలు")}
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.85rem" }}>
              <div>
                <span style={{ color: "var(--c-text-muted)" }}>{t("Cultivated By", "పండించిన రైతు")}:</span>
                <strong style={{ display: "block" }}>{product.farmerName}</strong>
              </div>
              <div>
                <span style={{ color: "var(--c-text-muted)" }}>{t("Origin", "ప్రాంతం")}:</span>
                <strong style={{ display: "block" }}>{product.origin}</strong>
              </div>
              <div>
                <span style={{ color: "var(--c-text-muted)" }}>{t("Harvest Date", "పంట కోత తేదీ")}:</span>
                <strong style={{ display: "block" }}><Calendar size={12} style={{ marginRight: "4px" }} /> {product.harvestDate}</strong>
              </div>
              <div>
                <span style={{ color: "var(--c-text-muted)" }}>{t("Expiry Period", "నిల్వ ఉంచే కాలం")}:</span>
                <strong style={{ display: "block" }}>{product.shelfLifeDays} {t("Days", "రోజులు")}</strong>
              </div>
            </div>
          </div>

          {/* Real-Time Interactive Traceability Timeline */}
          <div style={{
            backgroundColor: "#f8fafc",
            border: "1px dashed var(--c-border)",
            borderRadius: "12px",
            padding: "20px",
            marginTop: "20px"
          }}>
            <h5 style={{ fontFamily: "var(--font-display)", fontWeight: "700", color: "var(--c-primary)", display: "flex", alignItems: "center", gap: "8px", margin: "0 0 16px 0", fontSize: "0.95rem" }}>
              <Leaf size={16} color="var(--c-accent)" /> {t("Harvest Sourcing Journey", "పంట ప్రయాణ మార్గం")}
            </h5>
            
            <div style={{ position: "relative", paddingLeft: "24px" }}>
              {/* Vertical line connecting nodes */}
              <div style={{
                position: "absolute",
                left: "7px",
                top: "8px",
                bottom: "8px",
                width: "2px",
                backgroundColor: "var(--c-primary-light)"
              }} />

              {/* Node 1: Sown */}
              <div style={{ position: "relative", marginBottom: "18px" }}>
                <div style={{
                  position: "absolute",
                  left: "-23px",
                  top: "3px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "var(--c-primary)",
                  border: "2px solid #fff"
                }} />
                <strong style={{ display: "block", fontSize: "0.8rem", color: "var(--c-primary)" }}>
                  {t("1. Seed Sowing", "1. విత్తనాలు నాటడం")}
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--c-text-muted)" }}>
                  Sown in chemical-free organic soil at {product.origin}
                </span>
              </div>

              {/* Node 2: Harvesting */}
              <div style={{ position: "relative", marginBottom: "18px" }}>
                <div style={{
                  position: "absolute",
                  left: "-23px",
                  top: "3px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "var(--c-primary)",
                  border: "2px solid #fff"
                }} />
                <strong style={{ display: "block", fontSize: "0.8rem", color: "var(--c-primary)" }}>
                  {t("2. Harvesting", "2. పంట కోత")}
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--c-text-muted)" }}>
                  Harvested on {product.harvestDate} by {product.farmerName}
                </span>
              </div>

              {/* Node 3: Quality Audited */}
              <div style={{ position: "relative", marginBottom: "18px" }}>
                <div style={{
                  position: "absolute",
                  left: "-23px",
                  top: "3px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "var(--c-accent)",
                  border: "2px solid #fff",
                  boxShadow: "0 0 8px var(--c-accent)"
                }} />
                <strong style={{ display: "block", fontSize: "0.8rem", color: "var(--c-accent)" }}>
                  {t("3. Lab Audit & Quality Check", "3. ప్రయోగశాల పరీక్ష మరియు నాణ్యత తనిఖీ")}
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--c-text-muted)" }}>
                  Audited & certified under "{product.certifications?.join(', ') || 'Jaivik Bharat'}" standards
                </span>
              </div>

              {/* Node 4: Warehoused */}
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute",
                  left: "-23px",
                  top: "3px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  border: "2px solid #fff"
                }} />
                <strong style={{ display: "block", fontSize: "0.8rem", color: "#10b981" }}>
                  {t("4. Warehouse Sorting & Dispatch Ready", "4. గిడ్డంగి వర్గీకరణ & డెలివరీకి సిద్ధం")}
                </strong>
                <span style={{ fontSize: "0.75rem", color: "var(--c-text-muted)" }}>
                  Stored safely under shelf-life cycle ({product.shelfLifeDays} days left)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Buying options, Nutrition */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ textTransform: "uppercase", fontSize: "0.8rem", color: "var(--c-accent)", fontWeight: "700", letterSpacing: "1px" }}>
            {product.category.replace("-", " ")}
          </span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", color: "var(--c-primary)", lineHeight: "1.2", margin: "6px 0 10px" }}>
            {t(product.name, product.teluguName)}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <Stars rating={product.rating} />
            <span style={{ fontSize: "0.85rem", color: "var(--c-text-muted)", fontWeight: "500" }}>
              ({productReviews.length} {t("Customer Reviews", "వినియోగదారుల అభిప్రాయాలు")})
            </span>
            <span style={{
              fontSize: "0.75rem",
              backgroundColor: "var(--c-primary-light)",
              color: "var(--c-primary)",
              padding: "2px 8px",
              borderRadius: "4px",
              fontWeight: "700"
            }}>
              {product.certifications[0]}
            </span>
          </div>

          <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "16px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "2rem", fontWeight: "800", color: "var(--c-primary)", fontFamily: "var(--font-display)" }}>
                ₹{finalPrice}
              </span>
              {product.compareAtPrice > product.price && purchaseMode === "once" && (
                <span style={{ fontSize: "1.2rem", textDecoration: "line-through", color: "var(--c-text-muted)" }}>
                  ₹{product.compareAtPrice}
                </span>
              )}
              <span style={{ fontSize: "0.95rem", color: "var(--c-text-muted)", alignSelf: "flex-end", marginBottom: "4px" }}>
                / {product.unit}
              </span>
            </div>
            {purchaseMode === "sub" && (
              <span style={{ color: "var(--success)", fontWeight: "700", fontSize: "0.85rem", display: "block", marginTop: "4px" }}>
                🎉 {t("Subscription Active: 15% discount applied", "చందా ధర: 15% రాయితీ వర్తించబడింది")}
              </span>
            )}
          </div>

          {/* Purchasing selector option */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              border: `2px solid ${purchaseMode === "once" ? "var(--c-primary)" : "var(--c-border)"}`,
              padding: "12px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              backgroundColor: purchaseMode === "once" ? "var(--c-primary-light)" : "#fff",
              transition: "all 0.2s"
            }}>
              <input
                type="radio"
                name="purchase_mode"
                checked={purchaseMode === "once"}
                onChange={() => setPurchaseMode("once")}
                style={{ accentColor: "var(--c-primary)" }}
              />
              <div>
                <strong style={{ display: "block" }}>{t("One-time Purchase", "ఒకసారి కొనుగోలు")}</strong>
                <span style={{ fontSize: "0.8rem", color: "var(--c-text-muted)" }}>{t("Pay standard retail price", "సాధారణ ధర వర్తిస్తుంది")}</span>
              </div>
            </label>

            {product.isSubscriptionEligible && (
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                border: `2px solid ${purchaseMode === "sub" ? "var(--c-primary)" : "var(--c-border)"}`,
                padding: "12px 16px",
                borderRadius: "10px",
                cursor: "pointer",
                backgroundColor: purchaseMode === "sub" ? "var(--c-primary-light)" : "#fff",
                transition: "all 0.2s"
              }}>
                <input
                  type="radio"
                  name="purchase_mode"
                  checked={purchaseMode === "sub"}
                  onChange={() => setPurchaseMode("sub")}
                  style={{ accentColor: "var(--c-primary)" }}
                />
                <div>
                  <strong style={{ display: "block", color: "var(--c-accent)" }}>
                    {t("Subscribe & Save 15%", "చందా చేసుకోండి (15% ఆదా)")}
                  </strong>
                  <span style={{ fontSize: "0.8rem", color: "var(--c-text-muted)" }}>
                    {t("Delivered automatically every month. Pause anytime.", "ప్రతి నెలా ఆటోమేటిక్‌గా డెలివరీ చేయబడుతుంది.")}
                  </span>
                </div>
              </label>
            )}
          </div>

          {/* Action Row */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "25px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              border: "1.5px solid var(--c-border)",
              borderRadius: "8px",
              backgroundColor: "var(--c-bg-pure)"
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: "8px 16px", fontWeight: "bold" }}
              >
                -
              </button>
              <span style={{ width: "30px", textAlign: "center", fontWeight: "600" }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: "8px 16px", fontWeight: "bold" }}
              >
                +
              </button>
            </div>
            
            <button className="btn-primary" onClick={handleAddToCart} style={{ flexGrow: 1, justifyContent: "center" }}>
              {purchaseMode === "sub" ? t("Start Subscription", "సబ్‌స్క్రిప్షన్ ప్రారంభించు") : t("Add to Shopping Cart", "కార్ట్‌లో చేర్చు")}
            </button>
          </div>

          {/* Nutrition Table */}
          <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--c-primary)", marginBottom: "8px" }}>
            {t("Nutritional Profile (Per 100g)", "పోషక విలువలు (ప్రతి 100 గ్రాములలో)")}
          </h4>
          <div className="nutrition-grid">
            <div className="nutrition-badge">
              <div className="nutrition-value">{product.nutrition.protein}</div>
              <div className="nutrition-label">{t("Protein", "ప్రోటీన్")}</div>
            </div>
            <div className="nutrition-badge">
              <div className="nutrition-value">{product.nutrition.carbs}</div>
              <div className="nutrition-label">{t("Carbs", "పిండి పదార్థం")}</div>
            </div>
            <div className="nutrition-badge">
              <div className="nutrition-value">{product.nutrition.fats}</div>
              <div className="nutrition-label">{t("Fats", "కొవ్వు")}</div>
            </div>
            <div className="nutrition-badge">
              <div className="nutrition-value">{product.nutrition.calories}</div>
              <div className="nutrition-label">{t("Energy", "శక్తి")}</div>
            </div>
          </div>
          
          {/* Frequently Bought Together Bundle */}
          {bundleProduct && (
            <div style={{
              backgroundColor: "var(--c-primary-light)",
              border: "1.5px dashed var(--c-primary)",
              borderRadius: "12px",
              padding: "16px",
              marginTop: "20px"
            }}>
              <h5 style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--c-primary)", marginBottom: "10px", textTransform: "uppercase" }}>
                {t("Frequently Bought Together", "తరచుగా కలిసి కొనుగోలు చేసేవి")}
              </h5>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <img src={product.image} alt={product.name} style={{ width: "45px", height: "45px", borderRadius: "6px", objectFit: "cover" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: "600", maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t(product.name, product.teluguName)}
                  </span>
                </div>
                <strong style={{ fontSize: "1.2rem", color: "var(--c-text-muted)" }}>+</strong>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <img src={bundleProduct.image} alt={bundleProduct.name} style={{ width: "45px", height: "45px", borderRadius: "6px", objectFit: "cover" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: "600", maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t(bundleProduct.name, bundleProduct.teluguName)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between align-center" style={{ flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--c-text-muted)", textDecoration: "line-through", marginRight: "6px" }}>
                    ₹{product.price + bundleProduct.price}
                  </span>
                  <strong style={{ fontSize: "1.2rem", color: "var(--c-primary)", fontFamily: "var(--font-display)" }}>
                    ₹{Math.round((product.price + bundleProduct.price) * 0.9)}
                  </strong>
                  <span style={{ fontSize: "0.7rem", color: "var(--success)", display: "block", fontWeight: "600" }}>{t("Save 10% on bundle!", "10% అదనపు తగ్గింపు!")}</span>
                </div>
                <button className="btn-accent" onClick={handleBuyBundle} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                  {t("Buy Bundle", "బండిల్ కొనుగోలు")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div style={{ marginTop: "40px", backgroundColor: "var(--c-bg-pure)", border: "1px solid var(--c-border)", borderRadius: "16px", padding: "24px" }}>
        <div style={{ display: "flex", gap: "16px", borderBottom: "1.5px solid var(--c-border)", paddingBottom: "10px", marginBottom: "20px" }}>
          <button 
            onClick={() => setActiveTab("desc")} 
            style={{ fontWeight: "700", color: activeTab === "desc" ? "var(--c-primary)" : "var(--c-text-muted)", cursor: "pointer" }}
          >
            {t("Description & Storage", "వివరణ & నిల్వ ఉంచే పద్ధతి")}
          </button>
          <button 
            onClick={() => setActiveTab("reviews")} 
            style={{ fontWeight: "700", color: activeTab === "reviews" ? "var(--c-primary)" : "var(--c-text-muted)", cursor: "pointer" }}
          >
            {t(`Reviews (${productReviews.length})`, `అభిప్రాయాలు (${productReviews.length})`)}
          </button>
        </div>

        {activeTab === "desc" ? (
          <div>
            <p style={{ color: "var(--c-text-muted)", marginBottom: "16px", fontSize: "0.95rem", lineHeight: "1.6" }}>
              {t(product.description, product.teluguDescription)}
            </p>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", backgroundColor: "var(--c-primary-light)", padding: "12px 16px", borderRadius: "8px" }}>
              <Info size={16} color="var(--c-primary)" />
              <span style={{ fontSize: "0.85rem", color: "var(--c-primary)", fontWeight: "600" }}>
                {t("Keep stored in an airtight clay or steel container in a cool, dry place. Avoid direct moisture.", 
                   "గాలి చొరబడని సీసా లేదా స్టీల్ డబ్బాలో పొడిగా ఉండే చోట భద్రపరచండి. తడి తగలనివ్వవద్దు.")}
              </span>
            </div>
          </div>
        ) : (
          <div>
            {/* Review List */}
            {productReviews.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "30px" }}>
                {productReviews.map((rev) => (
                  <div key={rev.id} style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <strong>{rev.userName}</strong>
                      <span style={{ fontSize: "0.8rem", color: "var(--c-text-muted)" }}>{rev.date}</span>
                    </div>
                    <Stars rating={rev.rating} size={12} />
                    <p style={{ color: "var(--c-text-muted)", fontSize: "0.9rem", marginTop: "6px" }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--c-text-muted)", marginBottom: "20px" }}>{t("No reviews yet. Be the first to review!", "ఇంకా ఎలాంటి రివ్యూస్ లేవు. మొదటి రివ్యూను మీరే ఇవ్వండి!")}</p>
            )}

            {/* Submit Review Form */}
            <form onSubmit={handleReviewSubmit} style={{ borderTop: "1.5px solid var(--c-border)", paddingTop: "20px" }}>
              <h4 style={{ fontFamily: "var(--font-display)", fontWeight: "700", marginBottom: "12px" }}>
                {t("Write a Product Review", "ఉత్పత్తి పై మీ అభిప్రాయం")}
              </h4>
              
              {reviewSuccess && (
                <div style={{ backgroundColor: "var(--c-primary-light)", color: "var(--c-primary)", padding: "10px", borderRadius: "6px", marginBottom: "12px", fontSize: "0.85rem", fontWeight: "600" }}>
                  {t("Thank you! Your review has been submitted successfully.", "ధన్యవాదాలు! మీ రివ్యూ విజయవంతంగా సమర్పించబడింది.")}
                </div>
              )}

              <div className="portal-form-group" style={{ marginBottom: "12px" }}>
                <label className="portal-label">{t("Rating Score", "రేటింగ్ మార్కులు")}</label>
                <select 
                  className="portal-select" 
                  value={newRating} 
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  style={{ maxWidth: "120px" }}
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Bad</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>

              <div className="portal-form-group" style={{ marginBottom: "16px" }}>
                <label className="portal-label">{t("Your Review Comment", "మీ సమీక్ష వ్యాఖ్య")}</label>
                <textarea
                  className="portal-textarea"
                  rows={4}
                  placeholder={t("Tell other families about your experience with this organic product...", "ఈ ఆర్గానిక్ ప్రొడక్ట్ పై మీ అభిప్రాయాలను రాయండి...")}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                <MessageSquare size={16} /> {t("Submit Review", "రివ్యూ పంపించు")}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Recently Viewed Products */}
      {recentIds.length > 1 && (
        <div style={{ marginTop: "40px", borderTop: "1px solid var(--c-border)", paddingTop: "30px" }}>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", color: "var(--c-primary)", marginBottom: "20px" }}>
            {t("Recently Viewed Products", "మీరు ఇటీవల వీక్షించిన ఉత్పత్తులు")}
          </h3>
          <div className="grid grid-4" style={{ gap: "20px" }}>
            {recentIds
              .filter(id => id !== product.id)
              .map(id => products.find(p => p.id === id))
              .filter(Boolean)
              .map(p => (
                <div 
                  key={p.id} 
                  className="product-card" 
                  onClick={() => {
                    setSelectedProductId(p.id);
                    window.scrollTo(0, 0);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-card-image" style={{ height: "130px" }}>
                    <img src={p.image} alt={p.name} />
                  </div>
                  <div className="product-card-info" style={{ padding: "10px" }}>
                    <h4 style={{ fontSize: "0.85rem", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t(p.name, p.teluguName)}
                    </h4>
                    <strong style={{ fontSize: "0.9rem", color: "var(--c-primary)", display: "block", marginTop: "4px" }}>₹{p.price}</strong>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
