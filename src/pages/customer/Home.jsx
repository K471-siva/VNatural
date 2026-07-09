import React, { useState } from "react";
import { useDb } from "../../context/DbContext";
import { Stars } from "../../components/common/Stars";
import {
  Leaf, Award, ShieldCheck, Clock, ArrowRight, Star, Quote,
  ShoppingCart, Play, CheckCircle, Mail, ChevronRight, Zap,
  Truck, Lock, BadgeCheck, Users
} from "lucide-react";

/* ─────────────── CATEGORY DATA ─────────────── */
const CATEGORIES = [
  {
    key: "rice",
    label: "Organic Rice",
    count: "12 Items",
    img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&auto=format&fit=crop",
    emoji: "🌾",
  },
  {
    key: "vegetables",
    label: "Vegetables",
    count: "45 Items",
    img: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=200&auto=format&fit=crop",
    emoji: "🥦",
  },
  {
    key: "fruits",
    label: "Fresh Fruits",
    count: "32 Items",
    img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=200&auto=format&fit=crop",
    emoji: "🍎",
  },
  {
    key: "dals",
    label: "Leafy & Dals",
    count: "18 Items",
    img: "https://images.unsplash.com/photo-1547058886-af77992d478c?q=80&w=200&auto=format&fit=crop",
    emoji: "🌿",
  },
  {
    key: "oils-ghee",
    label: "Oils & Ghee",
    count: "20 Items",
    img: "https://images.unsplash.com/photo-1627915558017-68c0780d6599?q=80&w=200&auto=format&fit=crop",
    emoji: "🫒",
  },
  {
    key: "spices",
    label: "Herbs & Spices",
    count: "25 Items",
    img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=200&auto=format&fit=crop",
    emoji: "🌶️",
  },
];

/* ─────────────── PRODUCT BADGE HELPER ─────────────── */
const getBadgeClass = (idx) => {
  const badges = ["badge-organic", "badge-fresh", "badge-popular", "badge-fresh", "badge-organic", "badge-new"];
  return badges[idx % badges.length];
};

const getBadgeLabel = (idx) => {
  const labels = ["Organic", "Fresh", "Popular", "Fresh", "Organic", "New"];
  return labels[idx % labels.length];
};

/* ─────────────── TRUST BAR ITEMS ─────────────── */
const TRUST_ITEMS = [
  { icon: "🌿", title: "100% Natural", desc: "Fresh & organic products" },
  { icon: "🚚", title: "Fast Delivery", desc: "At your doorstep" },
  { icon: "🔒", title: "Secure Payment", desc: "100% secure payment" },
  { icon: "⭐", title: "Best Quality", desc: "Premium quality products" },
];

/* ═══════════════════════════════════════════════ */
export const Home = ({ setPage, setSelectedProductId }) => {
  const { products, t, addToCart } = useDb();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featuredProducts = products.slice(0, 6);

  const viewProduct = (id) => {
    setSelectedProductId(id);
    setPage("product-detail");
    window.scrollTo(0, 0);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.35s ease-out" }}>

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="hero-section">
        <div className="container hero-grid">
          {/* Left: Content */}
          <div className="hero-content">
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              {t("100% Certified Organic & Traceable", "100% సర్టిఫైడ్ ఆర్గానిక్")}
            </span>

            <h1>
              {t("Fresh Choices,", "తాజా ఎంపిక,")}{" "}
              <br />
              <span className="hero-highlight">
                {t("Better Life", "మెరుగైన జీవితం")}
              </span>
            </h1>

            <p>
              {t(
                "VNatural connects you to local farmers in Nalgonda & Guntur. Premium quality fruits and vegetables, delivered fresh to your doorstep.",
                "వి.నేచురల్ మిమ్మల్ని స్థానిక రైతులతో అనుసంధానిస్తుంది. రసాయనాలు లేని స్వచ్ఛమైన ఆహారం నేరుగా మీ ఇంటికి."
              )}
            </p>

            <div className="hero-cta-group">
              <button className="btn-primary" onClick={() => setPage("catalog")}>
                {t("Shop Now", "ఇప్పుడే కొనండి")} <ArrowRight size={16} />
              </button>
              <button className="btn-secondary" onClick={() => setPage("catalog")}>
                {t("Explore Categories", "వర్గాలు చూడండి")}
              </button>
            </div>

            {/* Trust Row */}
            <div className="hero-trust-row">
              <div className="hero-avatars">
                {[
                  "https://images.unsplash.com/photo-1494790108755-2616b612b8c5?q=80&w=60",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=60",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=60",
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=60",
                ].map((src, i) => (
                  <img key={i} src={src} alt={`Customer ${i + 1}`} />
                ))}
              </div>
              <div>
                <div className="hero-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#FBBF24" stroke="none" />
                  ))}
                </div>
                <div className="hero-trust-text">
                  <strong>4.8k+</strong>{" "}
                  {t("Happy Customers", "సంతోషిత కస్టమర్లు")}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Hero Image + Float Badges */}
          <div className="hero-image-container">
            <div className="hero-img-ring" />
            <div className="hero-img-ring-2" />
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=700&auto=format&fit=crop"
              alt="Organic Fresh Vegetables"
              className="hero-image"
            />
            {/* Left badge */}
            <div className="hero-float-badge left">
              <div className="hero-float-badge-icon">🌱</div>
              <div className="hero-float-badge-text">
                <span className="hero-float-badge-title">
                  {t("Zero Pesticides", "పెస్టిసైడ్ లేదు")}
                </span>
                <span className="hero-float-badge-sub">
                  {t("Lab Verified", "ల్యాబ్ ధృవీకరించబడింది")}
                </span>
              </div>
            </div>
            {/* Right badge */}
            <div className="hero-float-badge right">
              <div className="hero-float-badge-icon">🚚</div>
              <div className="hero-float-badge-text">
                <span className="hero-float-badge-title">
                  {t("Same Day Delivery", "అదే రోజు డెలివరీ")}
                </span>
                <span className="hero-float-badge-sub">
                  {t("Order before 10 AM", "ఉదయం 10కు ముందు")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ TRUST BAR ══════════════════ */}
      <div className="trust-bar">
        <div className="container trust-bar-grid">
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} className="trust-bar-item">
              <div className="trust-bar-icon">{item.icon}</div>
              <div className="trust-bar-text">
                <h4>{t(item.title, item.title)}</h4>
                <p>{t(item.desc, item.desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════ SHOP BY CATEGORY ══════════════════ */}
      <section className="category-section">
        <div className="container">
          <div className="section-header">
            <div className="section-header-left">
              <span className="section-eyebrow">
                {t("Browse by Category", "వర్గం ప్రకారం చూడండి")}
              </span>
              <h2>{t("Shop by Category", "వర్గం ప్రకారం కొనండి")}</h2>
            </div>
            <button className="section-view-all" onClick={() => setPage("catalog")}>
              {t("View All Categories", "అన్ని వర్గాలు")} <ArrowRight size={14} />
            </button>
          </div>

          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.key}
                className="category-card"
                onClick={() => setPage("catalog")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setPage("catalog")}
              >
                <div className="category-img-wrapper">
                  <img
                    src={cat.img}
                    alt={cat.label}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.querySelector(".category-emoji").style.display = "flex";
                    }}
                  />
                  <span
                    className="category-emoji"
                    style={{ display: "none", position: "absolute", inset: 0 }}
                  >
                    {cat.emoji}
                  </span>
                </div>
                <div className="category-card-title">
                  {t(cat.label, cat.label)}
                </div>
                <div className="category-card-count">{cat.count}</div>
                <div className="category-card-arrow">
                  {t("Shop", "కొనండి")} <ChevronRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ FARM FRESHNESS BANNER ══════════════════ */}
      <section className="farm-banner">
        <div className="container farm-banner-grid">
          {/* Left: Text + Stats */}
          <div>
            <div className="farm-banner-eyebrow">
              <Leaf size={12} /> {t("Farm Fresh", "ఫార్మ్ ఫ్రెష్")}
            </div>
            <h2 className="farm-banner-title">
              {t("From Our Farm", "మా ఫార్మ్ నుండి")}
              <br />
              {t("To Your Home.", "మీ ఇంటికి.")}
            </h2>
            <p className="farm-banner-desc">
              {t(
                "We ensure the highest quality and freshness in every product we deliver. Sourced directly from certified organic farms.",
                "మేము డెలివరీ చేసే ప్రతి ఉత్పత్తిలో అత్యధిక నాణ్యత మరియు తాజాదనాన్ని నిర్ధారిస్తాము."
              )}
            </p>

            {/* Stats */}
            <div className="farm-stats-row">
              {[
                { value: "50+", label: t("Local Farms", "స్థానిక ఫార్మ్లు") },
                { value: "100%", label: t("Pesticide Free", "పెస్టిసైడ్ లేదు") },
                { value: "4.8k+", label: t("Happy Customers", "సంతోషిత కస్టమర్లు") },
              ].map((stat, i) => (
                <div key={i} className="farm-stat-item">
                  <span className="farm-stat-value">{stat.value}</span>
                  <span className="farm-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "28px" }}>
              <button className="btn-primary" onClick={() => setPage("catalog")}>
                {t("Learn More", "మరింత తెలుసుకోండి")} <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right: Farm Image */}
          <div className="farm-img-panel">
            <div className="farm-img-frame">
              <img
                src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4e6?q=80&w=800&auto=format&fit=crop"
                alt="Farmer harvesting organic vegetables"
              />
              <div className="farm-img-overlay" />
              <div className="farm-play-btn" role="button" aria-label="Play video">
                <Play size={22} fill="currentColor" />
              </div>
            </div>
            {/* Floating card */}
            <div className="farm-float-card">
              <div className="farm-float-card-icon">🌿</div>
              <div className="farm-float-card-text">
                <strong>{t("Certified Organic", "సేంద్రీయ సర్టిఫైడ్")}</strong>
                <span>{t("USDA & Jaivik Bharat", "USDA & జైవిక్ భారత్")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ BEST SELLING PRODUCTS ══════════════════ */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <div className="section-header-left">
              <span className="section-eyebrow">
                {t("Top Picks", "టాప్ పిక్స్")}
              </span>
              <h2>{t("Best Selling Products", "అత్యధికంగా అమ్ముడవుతున్న ఉత్పత్తులు")}</h2>
            </div>
            <button className="section-view-all" onClick={() => setPage("catalog")}>
              {t("View All Products", "అన్ని ఉత్పత్తులు")} <ArrowRight size={14} />
            </button>
          </div>

          <div className="product-grid">
            {featuredProducts.map((prod, idx) => (
              <div key={prod.id} className="product-card">
                {/* Image */}
                <div
                  className="product-card-image"
                  onClick={() => viewProduct(prod.id)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={prod.image} alt={prod.name} loading="lazy" />
                  <span className={`product-label-badge ${getBadgeClass(idx)}`}>
                    {getBadgeLabel(idx)}
                  </span>
                </div>

                {/* Info */}
                <div className="product-card-info">
                  <span className="product-card-category">
                    {prod.category.replace("-", " ")}
                  </span>
                  <h3
                    className="product-card-title"
                    onClick={() => viewProduct(prod.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {t(prod.name, prod.teluguName)}
                  </h3>
                  <div style={{ marginBottom: "4px" }}>
                    <Stars rating={prod.rating} />
                  </div>
                  <div className="product-card-bottom">
                    <div className="product-card-pricing">
                      <span className="product-card-price">₹{prod.price}</span>
                      {prod.compareAtPrice > prod.price && (
                        <span className="product-card-compare">₹{prod.compareAtPrice}</span>
                      )}
                    </div>
                    <button
                      className="product-card-cart-btn"
                      onClick={() => addToCart(prod, 1)}
                      title={t("Add to Cart", "కార్ట్‌కి చేర్చు")}
                      aria-label={t("Add to Cart", "కార్ట్‌కి చేర్చు")}
                    >
                      <ShoppingCart size={15} />
                    </button>
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--c-text-subtle)", marginTop: "2px" }}>
                    {prod.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ SOURCING STORY ══════════════════ */}
      <section className="sourcing-section">
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "56px",
            alignItems: "center",
          }}
        >
          {/* Steps */}
          <div>
            <span className="section-eyebrow">
              {t("Our Process", "మా ప్రక్రియ")}
            </span>
            <h2
              style={{
                fontFamily: "'Outfit', var(--font-display)",
                fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
                fontWeight: 800,
                color: "var(--c-text)",
                letterSpacing: "-0.025em",
                marginBottom: "30px",
              }}
            >
              {t("The VNatural Sourcing Model", "వి.నేచురల్ సేంద్రీయ ప్రస్థానం")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              {[
                {
                  num: "01",
                  title: t("Direct Procurement", "రైతుల నుండి సేకరణ"),
                  desc: t(
                    "Farmers submit their upcoming harvest availability and organic documents through our dedicated Farmer Portal.",
                    "రైతులు తమ పంటల వివరాలను నేరుగా ఫార్మర్ పోర్టల్ ద్వారా నమోదు చేస్తారు."
                  ),
                  accent: false,
                },
                {
                  num: "02",
                  title: t("Quality Inspection", "నాణ్యత పరీక్ష"),
                  desc: t(
                    "Our quality inspector verifies batch codes, organic certifications, and moisture content before warehouse sorting.",
                    "బ్యాచ్ కోడ్లు, సేంద్రీయ సర్టిఫికేషన్లు మరియు తేమ శాతాన్ని పరీక్షిస్తాము."
                  ),
                  accent: true,
                },
                {
                  num: "03",
                  title: t("Safe Logistics", "సురక్షిత డెలివరీ"),
                  desc: t(
                    "Packaged in eco-friendly organic bags and assigned to local delivery partners with OTP confirmation.",
                    "పర్యావరణ అనుకూల సంచులలో ప్యాక్ చేసి, OTP ధృవీకరణతో మీ ఇంటికి పంపుతాము."
                  ),
                  accent: false,
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className={`sourcing-step ${step.accent ? "accent" : ""}`}
                  style={{ display: "flex", gap: "16px" }}
                >
                  <span
                    style={{
                      fontFamily: "'Outfit', monospace",
                      fontSize: "1.6rem",
                      fontWeight: 900,
                      color: step.accent ? "var(--c-accent)" : "var(--c-primary)",
                      opacity: 0.3,
                      lineHeight: 1,
                      minWidth: "36px",
                    }}
                  >
                    {step.num}
                  </span>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Farmer Spotlight */}
          <div className="farmer-card">
            <div className="farmer-card-title">
              <BadgeCheck
                size={16}
                style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }}
              />
              {t("Featured Farmer Spotlight", "ఈ నెల ప్రత్యేక రైతు పరిచయం")}
            </div>
            <div className="farmer-profile">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                alt="Farmer Keshav"
                className="farmer-avatar"
              />
              <div>
                <div className="farmer-name">Keshav Reddy</div>
                <div className="farmer-location">Miryalaguda, Nalgonda, TS</div>
                <div className="farmer-cert">
                  {t("PGS-India Green certified grower", "PGS-ఇండియా గ్రీన్ సేంద్రీయ రైతు")}
                </div>
              </div>
            </div>
            <p className="farmer-quote">
              "
              {t(
                "VNatural has cut out middle-men completely. I upload my harvest dates and receive fair payments directly in my bank account. They sell exactly what I grow.",
                "వి.నేచురల్ దళారీ వ్యవస్థను పూర్తిగా తొలగించింది. నా పంట దిగుబడి వివరాలను నేరుగా వెబ్‌సైట్‌లో ఉంచి, న్యాయమైన ధర పొందుతున్నాను."
              )}
              "
            </p>
            <Quote
              size={70}
              className="farmer-card-bg-icon"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════ SUBSCRIPTION BANNER ══════════════════ */}
      <section className="subscription-banner">
        <div className="container subscription-banner-grid">
          {/* Left text */}
          <div>
            <h2>
              {t("VNatural Family Pantry Subscription", "వి.నేచురల్ ఫ్యామిలీ సబ్‌స్క్రిప్షన్")}
            </h2>
            <p>
              {t(
                "Unlock monthly organic grains, cold-pressed oils, unpolished dals, and immunity packs delivered automatically. Pause, skip, or modify items anytime.",
                "నెలవారీ ఆర్గానిక్ బియ్యం, పప్పులు, మరియు ఆవు నెయ్యిని సబ్‌స్క్రిప్షన్ ద్వారా పొందండి."
              )}
            </p>
            <div className="subscription-perks">
              {[
                t("15% Off Always", "ఎల్లప్పుడూ 15% తగ్గింపు"),
                t("Free Local Shipping", "ఉచిత హోమ్ డెలివరీ"),
                t("Zero Cancellation Fees", "ఎప్పుడైనా రద్దు చేసుకోవచ్చు"),
                t("Priority Fresh Stock", "ప్రాధాన్యత తాజా స్టాక్"),
              ].map((perk, i) => (
                <div key={i} className="subscription-perk">
                  <CheckCircle
                    size={16}
                    className="subscription-perk-icon"
                    style={{ color: "var(--c-primary)" }}
                  />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right box card */}
          <div style={{ textAlign: "center" }}>
            <div className="subscription-box-card">
              <div className="subscription-box-title">
                {t("Essential Pantry Box", "నిత్యావసర సరుకుల బాక్స్")}
              </div>
              <div className="subscription-box-price">
                ₹1,499{" "}
                <span>/ {t("Month", "నెలకి")}</span>
              </div>
              <p className="subscription-box-desc">
                {t(
                  "Includes 5kg Sonamasuri, 2kg Spelt Atta, 1L Mustard Oil, 1kg Moong Dal",
                  "5 కిలోల బియ్యం, 2 కిలోల గోధుమ పిండి, ఆవ నూనె, పెసరపప్పు ఉంటాయి"
                )}
              </p>
              <button
                className="btn-primary"
                onClick={() => setPage("catalog")}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {t("Subscribe Now", "సబ్‌స్క్రిప్షన్ ప్రారంభించు")} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="testimonials-section">
        <div className="container">
          <div
            className="section-header"
            style={{ justifyContent: "center", textAlign: "center", display: "block", marginBottom: "36px" }}
          >
            <span className="section-eyebrow">
              {t("Customer Reviews", "కస్టమర్ సమీక్షలు")}
            </span>
            <h2>{t("Loved by Healthy Families", "ఆరోగ్యవంతమైన కుటుంబాల నమ్మకం")}</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "22px",
            }}
          >
            {[
              {
                initial: "A",
                name: "Anitha Rao",
                location: "Kondapur, Hyderabad",
                comment: t(
                  "Finding unpolished rice and real ghee in the city is so hard. VNatural has solved this! Sourced straight from local farmers, you can taste the difference.",
                  "హైదరాబాద్‌లో పాలిష్ లేని దంపుడు బియ్యం, స్వచ్ఛమైన నెయ్యి దొరకడం చాలా కష్టం. వి.నేచురల్ ఆ సమస్యను తీర్చింది."
                ),
              },
              {
                initial: "S",
                name: "Suresh Reddy",
                location: "Gachibowli, Hyderabad",
                comment: t(
                  "I subscribe to the Country Eggs weekly and Moong Dal monthly. Delivery is prompt and packed hygiene-sealed. Highly recommend VNatural to everyone.",
                  "నేను ప్రతి వారం నాటు కోడి గుడ్లను సబ్‌స్క్రిప్షన్ ద్వారా పొందుతున్నాను. ప్యాకింగ్ చాలా పరిశుభ్రంగా ఉంటుంది."
                ),
              },
              {
                initial: "P",
                name: "Padmini K.",
                location: "Begumpet, Hyderabad",
                comment: t(
                  "I love using the AI chat tool to search for diabetic-friendly groceries. It automatically shows nutrition counts and recipe lists in Telugu! Excellent.",
                  "తెలుగులో కూడా సేంద్రీయ ఆహార పదార్థాలను వెతికేందుకు మరియు ఆరోగ్యకరమైన వంటకాలను తెలుసుకోవడానికి ఈ సైట్ చాలా బాగుంది."
                ),
              },
            ].map((rev, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#FBBF24" stroke="none" />
                  ))}
                </div>
                <p className="testimonial-text">"{rev.comment}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{rev.initial}</div>
                  <div>
                    <div className="testimonial-author-name">{rev.name}</div>
                    <div className="testimonial-author-loc">{rev.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ NEWSLETTER ══════════════════ */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-icon-wrap">
              <Mail size={24} />
            </div>
            <div className="newsletter-text">
              <h3>{t("Subscribe to our newsletter", "మా వార్తాలేఖకు సభ్యత్వం")}</h3>
              <p>
                {t(
                  "Get the latest updates on new products and special offers.",
                  "కొత్త ఉత్పత్తులు మరియు ప్రత్యేక ఆఫర్లపై తాజా అప్‌డేట్‌లు పొందండి."
                )}
              </p>
            </div>

            {subscribed ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 24px",
                  background: "var(--c-primary-dim)",
                  border: "1px solid var(--c-border)",
                  borderRadius: "var(--radius-full)",
                  color: "var(--c-primary)",
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  animation: "zoomIn 0.3s ease",
                  flex: 1,
                  maxWidth: "480px",
                }}
              >
                <CheckCircle size={18} />
                {t("Thanks! You're subscribed! 🎉", "ధన్యవాదాలు! మీరు సభ్యులయ్యారు! 🎉")}
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  className="newsletter-input"
                  placeholder={t("Enter your email", "మీ ఈమెయిల్ నమోదు చేయండి")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary" style={{ whiteSpace: "nowrap" }}>
                  {t("Subscribe", "సభ్యత్వం")} <ArrowRight size={15} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
