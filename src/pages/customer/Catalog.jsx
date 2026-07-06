import React, { useState } from "react";
import { useDb } from "../../context/DbContext";
import { Stars } from "../../components/common/Stars";
import { Search, SlidersHorizontal, ShoppingCart, Heart, RefreshCw, X, HelpCircle } from "lucide-react";

export const Catalog = ({ setPage, setSelectedProductId }) => {
  const { products, language, t, addToCart, wishlist, toggleWishlistState } = useDb();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [diabeticOnly, setDiabeticOnly] = useState(false);
  const [highProteinOnly, setHighProteinOnly] = useState(false);
  const [subOnly, setSubOnly] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [priceRange, setPriceRange] = useState(600);

  // Product comparison state
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // List of categories for tabs/filters
  const categories = [
    { id: "all", en: "All Products", te: "అన్ని రకాలు" },
    { id: "rice", en: "Organic Rice", te: "బియ్యం" },
    { id: "dals", en: "Unpolished Dals", te: "పప్పుధాన్యాలు" },
    { id: "ancient-grains", en: "Ancient Grains", te: "చిరుధాన్యాలు & పిండి" },
    { id: "oils-ghee", en: "Oils & A2 Ghee", te: "నూనెలు & నెయ్యి" },
    { id: "vegetables", en: "Fresh Produce", te: "కూరగాయలు" },
    { id: "fruits", en: "Fresh Fruits", te: "తాజా పండ్లు" },
    { id: "daily-essentials", en: "Daily Essentials", te: "నిత్యావసరాలు" },
    { id: "herbal-wellness", en: "Wellness & Herbs", te: "ఆరోగ్య ఉత్పత్తులు" }
  ];

  const handleProductClick = (id) => {
    setSelectedProductId(id);
    setPage("product-detail");
    window.scrollTo(0, 0);
  };

  const handleCompareToggle = (product) => {
    setCompareList((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 products at a time.");
        return prev;
      }
      return [...prev, product];
    });
  };

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((prod) => {
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.teluguName.includes(searchQuery) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || prod.category === selectedCategory;
      const matchesDiabetic = !diabeticOnly || prod.diabeticSafe;
      const matchesProtein = !highProteinOnly || prod.highProtein;
      const matchesSub = !subOnly || prod.isSubscriptionEligible;
      const matchesPrice = prod.price <= priceRange;

      return matchesSearch && matchesCategory && matchesDiabetic && matchesProtein && matchesSub && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="container" style={{ padding: "40px 16px", animation: "fadeIn 0.3s ease-out" }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", color: "var(--c-primary)", marginBottom: "8px" }}>
          {t("VNatural Organic Catalog", "వి.నేచురల్ సేంద్రీయ కేటలాగ్")}
        </h1>
        <p style={{ color: "var(--c-text-muted)" }}>
          {t("100% Pesticide-Free, Chemical-Free Sourced Raw Ingredients", "ఎలాంటి కెమికల్స్ లేని స్వచ్ఛమైన సేంద్రీయ పదార్థాలు")}
        </p>
      </div>

      {/* Catalog Layout Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "30px" }}>
        {/* Sidebar Filters */}
        <aside style={{
          backgroundColor: "#fff",
          border: "1px solid var(--c-border)",
          borderRadius: "16px",
          padding: "20px",
          height: "fit-content",
          position: "sticky",
          top: "100px"
        }}>
          <div className="flex align-center justify-between" style={{ marginBottom: "20px", borderBottom: "1.5px solid var(--c-border)", paddingBottom: "10px" }}>
            <h3 style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <SlidersHorizontal size={18} color="var(--c-primary)" /> {t("Filters", "ఫిల్టర్లు")}
            </h3>
            {(diabeticOnly || highProteinOnly || subOnly || searchQuery || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setDiabeticOnly(false);
                  setHighProteinOnly(false);
                  setSubOnly(false);
                  setPriceRange(600);
                }}
                style={{ fontSize: "0.75rem", color: "var(--c-accent)", fontWeight: "600", cursor: "pointer" }}
              >
                {t("Clear All", "అన్నీ క్లియర్ చేయి")}
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="portal-form-group" style={{ marginBottom: "20px" }}>
            <label className="portal-label">{t("Search Products", "శోధించండి")}</label>
            <div className="search-input-wrapper">
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--c-text-muted)" }}>
                <Search size={16} />
              </span>
              <input
                type="text"
                className="search-input"
                style={{ paddingLeft: "2.2rem", borderRadius: "8px" }}
                placeholder={t("Rice, dal, ghee...", "బియ్యం, పప్పు...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories select list */}
          <div className="portal-form-group" style={{ marginBottom: "20px" }}>
            <label className="portal-label">{t("Categories", "రకాలు")}</label>
            <select
              className="portal-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: "100%" }}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {language === "te" ? cat.te : cat.en}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="portal-form-group" style={{ marginBottom: "20px" }}>
            <label className="portal-label flex justify-between">
              <span>{t("Max Price", "గరిష్ట ధర")}:</span>
              <strong style={{ color: "var(--c-primary)" }}>₹{priceRange}</strong>
            </label>
            <input
              type="range"
              min="30"
              max="1000"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              style={{ accentColor: "var(--c-primary)", cursor: "pointer" }}
            />
          </div>

          {/* Dietary Filters */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.9rem" }}>
              <input
                type="checkbox"
                checked={diabeticOnly}
                onChange={(e) => setDiabeticOnly(e.target.checked)}
                className="checklist-checkbox"
                style={{ width: "16px", height: "16px" }}
              />
              <span>{t("Diabetic Safe", "డయాబెటిక్ సురక్షితం")}</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.9rem" }}>
              <input
                type="checkbox"
                checked={highProteinOnly}
                onChange={(e) => setHighProteinOnly(e.target.checked)}
                className="checklist-checkbox"
                style={{ width: "16px", height: "16px" }}
              />
              <span>{t("High Protein", "అధిక ప్రోటీన్")}</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.9rem" }}>
              <input
                type="checkbox"
                checked={subOnly}
                onChange={(e) => setSubOnly(e.target.checked)}
                className="checklist-checkbox"
                style={{ width: "16px", height: "16px" }}
              />
              <span>{t("Subscription Eligible", "సబ్‌స్క్రిప్షన్ లభించేవి")}</span>
            </label>
          </div>
        </aside>

        {/* Main Column Product Grid */}
        <div>
          {/* Toolbar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fff",
            border: "1px solid var(--c-border)",
            borderRadius: "12px",
            padding: "12px 20px",
            marginBottom: "20px"
          }}>
            <span style={{ fontSize: "0.9rem", color: "var(--c-text-muted)", fontWeight: "500" }}>
              {t(`Showing ${filteredProducts.length} organic products`, `మొత్తం ${filteredProducts.length} సేంద్రీయ ఉత్పత్తులు`)}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--c-text-muted)" }}>{t("Sort By:", "వరుస క్రమం:")}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ border: "1px solid var(--c-border)", padding: "4px 8px", borderRadius: "6px", backgroundColor: "#fff", fontSize: "0.85rem" }}
              >
                <option value="rating">{t("Highest Rated", "రేటింగ్ ఆధారంగా")}</option>
                <option value="price-low">{t("Price: Low to High", "ధర: తక్కువ నుండి ఎక్కువ")}</option>
                <option value="price-high">{t("Price: High to Low", "ధర: ఎక్కువ నుండి తక్కువ")}</option>
              </select>
            </div>
          </div>

          {/* Product grid list */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-3" style={{ gap: "20px" }}>
              {filteredProducts.map((prod) => {
                const isWishlisted = wishlist.includes(prod.id);
                const isComparing = compareList.some((p) => p.id === prod.id);

                return (
                  <div key={prod.id} className="product-card">
                    <div className="product-card-image">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        onClick={() => handleProductClick(prod.id)}
                        style={{ cursor: "pointer" }}
                      />
                      {prod.compareAtPrice > prod.price && (
                        <span className="product-card-badge">SALE</span>
                      )}
                      <button
                        className={`product-card-wishlist ${isWishlisted ? "active" : ""}`}
                        onClick={() => toggleWishlistState(prod.id)}
                      >
                        <Heart size={16} fill={isWishlisted ? "#ef4444" : "none"} />
                      </button>
                    </div>

                    <div className="product-card-info">
                      <span className="product-card-category">{prod.category.replace("-", " ")}</span>
                      <h3 className="product-card-title" onClick={() => handleProductClick(prod.id)} style={{ cursor: "pointer" }}>
                        {t(prod.name, prod.teluguName)}
                      </h3>
                      <div style={{ display: "flex", alignSelf: "flex-start", marginBottom: "8px" }}>
                        <Stars rating={prod.rating} />
                      </div>
                      
                      <div style={{ fontSize: "0.75rem", color: "var(--c-text-muted)", marginBottom: "8px" }}>
                        {t(`Origin: ${prod.origin}`, `మూలం: ${prod.origin}`)}
                      </div>

                      <div className="product-card-pricing">
                        <span className="product-card-price">₹{prod.price}</span>
                        {prod.compareAtPrice > prod.price && (
                          <span className="product-card-compare">₹{prod.compareAtPrice}</span>
                        )}
                        <span style={{ fontSize: "0.75rem", color: "var(--c-text-muted)", marginLeft: "auto" }}>{prod.unit}</span>
                      </div>

                      <div className="product-card-actions">
                        <button className="btn-primary" onClick={() => addToCart(prod, 1)} style={{ padding: "0.5rem" }}>
                          {t("Add to Cart", "కొనుగోలు")}
                        </button>
                        {prod.isSubscriptionEligible && (
                          <button 
                            className="btn-accent" 
                            onClick={() => {
                              addToCart(prod, 1, true);
                              setPage("cart");
                            }}
                            style={{ padding: "0.5rem" }}
                          >
                            {t("Subscribe", "చందా")}
                          </button>
                        )}
                      </div>

                      {/* Compare toggle */}
                      <button
                        onClick={() => handleCompareToggle(prod)}
                        style={{
                          marginTop: "8px",
                          fontSize: "0.75rem",
                          color: isComparing ? "var(--c-accent)" : "var(--c-text-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "4px",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                      >
                        <RefreshCw size={10} /> {isComparing ? t("Comparing", "పోలికలో ఉంది") : t("Compare", "పోల్చి చూడండి")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#fff", borderRadius: "16px", border: "1px solid var(--c-border)" }}>
              <HelpCircle size={40} color="var(--c-text-muted)" style={{ marginBottom: "12px" }} />
              <h3>{t("No products match your filters", "ఎలాంటి ఫలితాలు లభించలేదు")}</h3>
              <p style={{ color: "var(--c-text-muted)", fontSize: "0.9rem" }}>{t("Try clearing some active filters or modifying search query.", "కొన్ని ఫిల్టర్లను తొలగించి మళ్లీ ప్రయత్నించండి.")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Compare Floating Tray */}
      {compareList.length > 0 && (
        <div style={{
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#fff",
          borderRadius: "16px",
          border: "1.5px solid var(--c-accent)",
          boxShadow: "var(--shadow-lg)",
          padding: "16px 24px",
          zIndex: 900,
          display: "flex",
          alignItems: "center",
          gap: "24px",
          width: "90%",
          maxWidth: "600px",
          animation: "slideUp 0.3s ease-out"
        }}>
          <div style={{ flexGrow: 1 }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "var(--c-primary)" }}>
              {t(`Comparing (${compareList.length}/3) Items`, `వస్తువుల పోలిక (${compareList.length}/3)`)}
            </h4>
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              {compareList.map((item) => (
                <div key={item.id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  backgroundColor: "var(--c-primary-light)",
                  fontSize: "0.75rem"
                }}>
                  <span>{t(item.name.substring(0, 15), item.teluguName.substring(0, 15))}...</span>
                  <button onClick={() => handleCompareToggle(item)} style={{ color: "var(--error)", cursor: "pointer" }}><X size={10} /></button>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn-accent" onClick={() => setShowCompareModal(true)}>
              {t("Compare Now", "పోల్చి చూడు")}
            </button>
            <button style={{ color: "var(--c-text-muted)", fontSize: "0.85rem", cursor: "pointer" }} onClick={() => setCompareList([])}>
              {t("Cancel", "రద్దు")}
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showCompareModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "800px" }}>
            <div className="flex align-center justify-between" style={{ borderBottom: "1.5px solid var(--c-border)", paddingBottom: "12px", marginBottom: "20px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: "800", color: "var(--c-primary)" }}>
                {t("Product Comparison", "ఉత్పత్తుల పోలిక పట్టిక")}
              </h3>
              <button onClick={() => setShowCompareModal(false)}><X size={20} /></button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${compareList.length + 1}, 1fr)`, gap: "12px", textAlign: "center" }}>
              {/* Labels Column */}
              <div style={{ textAlign: "left", fontWeight: "600", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "16px", color: "var(--c-text-muted)", paddingTop: "110px" }}>
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px" }}>{t("Price", "ధర")}</div>
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px" }}>{t("Rating", "రేటింగ్")}</div>
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px" }}>{t("Origin", "మూలం")}</div>
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px" }}>{t("Protein", "ప్రోటీన్")}</div>
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px" }}>{t("Carbs", "కార్బోహైడ్రేట్లు")}</div>
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px" }}>{t("Fats", "కొవ్వులు")}</div>
                <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px" }}>{t("Certifications", "సర్టిఫికెట్లు")}</div>
              </div>

              {/* Product Columns */}
              {compareList.map((prod) => (
                <div key={prod.id} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ height: "110px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
                    <img src={prod.image} alt={prod.name} style={{ width: "50px", height: "50px", borderRadius: "6px", objectFit: "cover" }} />
                    <span style={{ fontSize: "0.8rem", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>
                      {t(prod.name, prod.teluguName)}
                    </span>
                  </div>
                  
                  <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px", fontWeight: "700" }}>₹{prod.price} / {prod.unit}</div>
                  <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px" }}>{prod.rating} / 5.0</div>
                  <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px", fontSize: "0.8rem" }}>{prod.origin}</div>
                  <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px" }}>{prod.nutrition.protein}</div>
                  <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px" }}>{prod.nutrition.carbs}</div>
                  <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px" }}>{prod.nutrition.fats}</div>
                  <div style={{ borderBottom: "1px solid var(--c-border)", paddingBottom: "8px", fontSize: "0.75rem", color: "var(--c-primary)" }}>
                    {prod.certifications.join(", ")}
                  </div>
                  <button className="btn-primary" onClick={() => addToCart(prod, 1)} style={{ padding: "4px 8px", fontSize: "0.8rem", margin: "0 auto" }}>
                    {t("Add to Cart", "కొనుగోలు")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
