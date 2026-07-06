import React from "react";
import { useDb } from "../../context/DbContext";
import { Stars } from "../../components/common/Stars";
import { Leaf, Award, ShieldCheck, Clock, ArrowRight, Star, Quote } from "lucide-react";

export const Home = ({ setPage, setSelectedProductId }) => {
  const { products, t, addToCart } = useDb();

  // Filter 4 featured best sellers
  const featuredProducts = products.slice(0, 4);

  const viewProduct = (id) => {
    setSelectedProductId(id);
    setPage("product-detail");
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease-out" }}>
      {/* Hero Banner */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 12px",
              borderRadius: "20px",
              backgroundColor: "rgba(45, 90, 39, 0.08)",
              color: "var(--c-primary)",
              fontWeight: "700",
              fontSize: "0.85rem",
              marginBottom: "16px",
              textTransform: "uppercase"
            }}>
              <Leaf size={14} /> 100% Certified Organic & Traceable
            </span>
            <h1>
              {t("Purity on Your Plate, Direct from Farms", "పొలం నుండి నేరుగా స్వచ్ఛమైన సేంద్రీయ ఆహారం")}
            </h1>
            <p>
              {t("VNatural connects you to local farmers in Nalgonda and Guntur. Sourced sustainably, verified for zero pesticides, packed under sterile warehouse conditions, and delivered locally to your doorstep.",
                 "వి.నేచురల్ మిమ్మల్ని నల్గొండ మరియు గుంటూరు ప్రాంత సేంద్రీయ రైతులతో అనుసంధానిస్తుంది. రసాయనాలు లేని స్వచ్ఛమైన ఆహారాన్ని నేరుగా మీ ఇంటికి చేరవేస్తాము.")}
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => setPage("catalog")}>
                {t("Shop Fresh Catalog", "సేంద్రీయ ఉత్పత్తులు")} <ArrowRight size={16} />
              </button>
              <button className="btn-secondary" onClick={() => setPage("profile")}>
                {t("Subscribe & Save 15%", "సబ్స్క్రైబ్ చేసుకోండి")}
              </button>
            </div>
          </div>
          <div className="hero-image-container">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop" 
              alt="Organic Fresh Veggies" 
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ backgroundColor: "#fff", padding: "30px 0", borderBottom: "1px solid var(--c-border)" }}>
        <div className="container grid grid-4" style={{ gap: "24px" }}>
          {[
            { icon: <Award size={28} color="var(--c-accent)" />, title: t("USDA Certified", "USDA సర్టిఫైడ్"), desc: t("Verified pure organic standards", "ప్రమాణాల ప్రకారం ధృవీకరించబడినది") },
            { icon: <ShieldCheck size={28} color="var(--c-primary)" />, title: t("100% Traceable", "ట్రేసబుల్ సోర్స్"), desc: t("Scan batch to view farmer origin", "పండించిన రైతు వివరాలు చూడవచ్చు") },
            { icon: <Clock size={28} color="var(--c-accent)" />, title: t("Fresh Harvested", "తాజా కోత"), desc: t("Delivered within 24 hours of packing", "ప్యాకింగ్ చేసిన 24 గంటలలో డెలివరీ") },
            { icon: <Leaf size={28} color="var(--c-primary)" />, title: t("Support Farmers", "రైతులకు ప్రోత్సాహం"), desc: t("Fair margins paid directly to growers", "న్యాయమైన ధరలు రైతులకు నేరుగా చెల్లింపు") }
          ].map((item, idx) => (
            <div key={idx} style={{ display: "flex", gap: "12px" }}>
              <div>{item.icon}</div>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: "700" }}>{item.title}</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--c-text-muted)" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sourcing Story (Farm to Table) */}
      <section style={{ padding: "60px 0" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "50px", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", color: "var(--c-primary)", marginBottom: "20px" }}>
              {t("The VNatural Sourcing Model", "వి.నేచురల్ సేంద్రీయ ప్రస్థానం")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ borderLeft: "3px solid var(--c-accent)", paddingLeft: "15px" }}>
                <h4 style={{ fontWeight: "700" }}>{t("Step 1: Direct Procurement", "దశ 1: రైతుల నుండి సేకరణ")}</h4>
                <p style={{ fontSize: "0.9rem", color: "var(--c-text-muted)" }}>
                  {t("Farmers submit their upcoming harvest availability and biological documents through our dedicated Farmer Portal.", 
                     "రైతులు తమ పంటల వివరాలను నేరుగా ఫార్మర్ పోర్టల్ ద్వారా సిస్టమ్‌లో నమోదు చేస్తారు.")}
                </p>
              </div>
              <div style={{ borderLeft: "3px solid var(--c-primary)", paddingLeft: "15px" }}>
                <h4 style={{ fontWeight: "700" }}>{t("Step 2: Quality Inspection", "దశ 2: నాణ్యత పరీక్ష")}</h4>
                <p style={{ fontSize: "0.9rem", color: "var(--c-text-muted)" }}>
                  {t("Our quality inspector verifies batch codes, organic certifications, and moisture contents before warehouse sorting.", 
                     "సేకరించిన ధాన్యాలను మా గిడ్డంగిలో తేమ శాతం మరియు సేంద్రీయ ప్రమాణాలను పరీక్షించిన పిదప నిల్వ చేస్తాము.")}
                </p>
              </div>
              <div style={{ borderLeft: "3px solid var(--c-accent)", paddingLeft: "15px" }}>
                <h4 style={{ fontWeight: "700" }}>{t("Step 3: Safe Logistics", "దశ 3: వేగవంతమైన డెలివరీ")}</h4>
                <p style={{ fontSize: "0.9rem", color: "var(--c-text-muted)" }}>
                  {t("Packaged in recyclable organic bags and assigned to our local delivery partners with OTP confirmation for high security.", 
                     "పర్యావరణానికి హాని చేయని సంచులలో ప్యాక్ చేసి, డెలివరీ భాగస్వాముల ద్వారా సురక్షితంగా మీ ఇంటికి పంపుతాము.")}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div style={{ position: "relative", backgroundColor: "#fff", padding: "20px", borderRadius: "16px", boxShadow: "var(--shadow-md)", border: "1px solid var(--c-border)" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: "800", color: "var(--c-primary)", marginBottom: "12px", fontSize: "1.3rem" }}>
                {t("Featured Farmer Spotlight", "ఈ నెల ప్రత్యేక రైతు పరిచయం")}
              </h3>
              <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" 
                  alt="Farmer Keshav" 
                  style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2.5px solid var(--c-accent)" }}
                />
                <div>
                  <h4 style={{ fontWeight: "700", fontSize: "1.1rem" }}>Keshav Reddy</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--c-accent)", fontWeight: "600" }}>Miryalaguda, Nalgonda, TS</p>
                  <p style={{ fontSize: "0.8rem", color: "var(--c-text-muted)" }}>{t("PGS-India Green certified grower", "PGS-ఇండియా గ్రీన్ సేంద్రీయ రైతు")}</p>
                </div>
              </div>
              <p style={{ fontStyle: "italic", fontSize: "0.9rem", color: "var(--c-text-muted)", position: "relative", zIndex: 2 }}>
                "{t("VNatural has cut out middle-men completely. I upload my harvest dates and receive fair payments directly in my bank account. They sell exactly what I grow.", 
                    "వి.నేచురల్ దళారీ వ్యవస్థను పూర్తిగా తొలగించింది. నా పంట దిగుబడి వివరాలను నేరుగా వెబ్‌సైట్‌లో ఉంచి, న్యాయమైన ధర పొందుతున్నాను.")}"
              </p>
              <div style={{ position: "absolute", bottom: "10px", right: "20px", opacity: 0.1, color: "var(--c-primary)" }}>
                <Quote size={80} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ backgroundColor: "#faf8f5", padding: "60px 0" }}>
        <div className="container">
          <div className="flex align-center justify-between" style={{ marginBottom: "30px" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--c-primary)" }}>
                {t("Featured Fresh Harvest", "ఈ వారపు తాజా దిగుబడులు")}
              </h2>
              <p style={{ color: "var(--c-text-muted)", fontSize: "0.9rem" }}>{t("Pesticide-free food staples and immunity wellness selections", "కెమికల్స్ లేని నిత్యావసరాలు మరియు రోగనిరోధక శక్తిని పెంచే ఉత్పత్తులు")}</p>
            </div>
            <button className="btn-secondary" onClick={() => setPage("catalog")}>
              {t("View All Products", "మొత్తం కేటలాగ్")}
            </button>
          </div>

          <div className="grid grid-4" style={{ gap: "24px" }}>
            {featuredProducts.map((prod) => (
              <div key={prod.id} className="product-card">
                <div className="product-card-image" onClick={() => viewProduct(prod.id)} style={{ cursor: "pointer" }}>
                  <img src={prod.image} alt={prod.name} />
                  {prod.compareAtPrice > prod.price && (
                    <span className="product-card-badge">
                      {Math.round(((prod.compareAtPrice - prod.price) / prod.compareAtPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <div className="product-card-info">
                  <span className="product-card-category">{prod.category.replace("-", " ")}</span>
                  <h3 className="product-card-title" onClick={() => viewProduct(prod.id)} style={{ cursor: "pointer" }}>
                    {t(prod.name, prod.teluguName)}
                  </h3>
                  <div style={{ marginBottom: "8px" }}>
                    <Stars rating={prod.rating} />
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
                      {t("Add to Cart", "కార్ట్‌కి చేర్చు")}
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Callout Banner */}
      <section style={{ backgroundColor: "var(--c-primary)", color: "#fff", padding: "60px 0" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", marginBottom: "15px", color: "var(--c-accent)" }}>
              {t("VNatural Family Pantry Subscription", "వి.నేచురల్ ఫ్యామిలీ నెలవారీ సబ్‌స్క్రిప్షన్")}
            </h2>
            <p style={{ opacity: 0.9, fontSize: "1.05rem", marginBottom: "24px" }}>
              {t("Unlock monthly organic grains, cold-pressed oils, unpolished dals, and immunity packs delivered automatically. Pause, skip, or modify items anytime via your dashboard.", 
                 "నెలవారీ ఆర్గానిక్ బియ్యం, పప్పులు, మరియు ఆవు నెయ్యిని సబ్‌స్క్రిప్షన్ ద్వారా పొందండి. 15% అదనపు తగ్గింపుతో పాటు ఉచిత హోమ్ డెలివరీ సదుపాయం.")}
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Star size={16} fill="var(--c-accent)" color="var(--c-accent)" /> <span>{t("15% Off Always", "ఎల్లప్పుడూ 15% తగ్గింపు")}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Star size={16} fill="var(--c-accent)" color="var(--c-accent)" /> <span>{t("Free Local Shipping", "ఉచిత హోమ్ డెలివరీ")}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Star size={16} fill="var(--c-accent)" color="var(--c-accent)" /> <span>{t("Zero Cancel Fees", "ఎప్పుడైనా రద్దు చేసుకోవచ్చు")}</span>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              padding: "30px",
              borderRadius: "16px",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "10px" }}>{t("Essential Pantry Box", "నిత్యావసర సరుకుల బాక్స్")}</h3>
              <p style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--c-accent)", margin: "10px 0" }}>₹1,499 <span style={{ fontSize: "1rem", opacity: 0.8, fontWeight: "normal" }}>/ {t("Month", "నెలకి")}</span></p>
              <p style={{ fontSize: "0.8rem", opacity: 0.8, marginBottom: "20px" }}>{t("Includes 5kg Sonamasuri, 2kg Spelt Atta, 1L Mustard Oil, 1kg Moong Dal", "5 కిలోల బియ్యం, 2 కిలోల గోధుమ పిండి, ఆవ నూనె, పెసరపప్పు ఉంటాయి")}</p>
              <button className="btn-accent" onClick={() => setPage("catalog")} style={{ width: "100%", justifyContent: "center" }}>
                {t("Subscribe Now", "సబ్‌స్క్రిప్షన్ ప్రారంభించు")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews & Testimonials */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--c-primary)", textAlign: "center", marginBottom: "40px" }}>
            {t("Loved by Healthy Families", "ఆరోగ్యవంతమైన కుటుంబాల నమ్మకం")}
          </h2>
          <div className="grid grid-3" style={{ gap: "24px" }}>
            {[
              {
                name: "Anitha Rao",
                location: "Kondapur, Hyderabad",
                comment: t("Finding unpolished rice and real ghee in the city is so hard. VNatural has solved this! Sourced straight from local farmers, you can taste the difference.",
                           "హైదరాబాద్‌లో పాలిష్ లేని దంపుడు బియ్యం, స్వచ్ఛమైన నెయ్యి దొరకడం చాలా కష్టం. వి.నేచురల్ ఆ సమస్యను తీర్చింది.")
              },
              {
                name: "Suresh Reddy",
                location: "Gachibowli, Hyderabad",
                comment: t("I subscribe to the Country Eggs weekly and Moong Dal monthly. Delivery is prompt and packed hygiene-sealed. Highly recommend VNatural to everyone.",
                           "నేను ప్రతి వారం నాటు కోడి గుడ్లను సబ్‌స్క్రిప్షన్ ద్వారా పొందుతున్నాను. ప్యాకింగ్ చాలా పరిశుభ్రంగా ఉంటుంది.")
              },
              {
                name: "Padmini K.",
                location: "Begumpet, Hyderabad",
                comment: t("I love using the AI chat tool to search for diabetic-friendly groceries. It automatically shows nutrition counts and recipe lists in Telugu! Excellent feature.",
                           "తెలుగులో కూడా సేంద్రీయ ఆహార పదార్థాలను వెతికేందుకు మరియు ఆరోగ్యకరమైన వంటకాలను తెలుసుకోవడానికి ఈ సైట్ చాలా బాగుంది.")
              }
            ].map((rev, idx) => (
              <div key={idx} style={{ backgroundColor: "#fff", border: "1px solid var(--c-border)", padding: "24px", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ display: "flex", gap: "2px", color: "#fbbf24", marginBottom: "12px" }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#fbbf24" stroke="none" />)}
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--c-text-muted)", fontStyle: "italic", marginBottom: "16px" }}>"{rev.comment}"</p>
                <div>
                  <h4 style={{ fontWeight: "700", fontSize: "0.95rem" }}>{rev.name}</h4>
                  <span style={{ fontSize: "0.8rem", color: "var(--c-accent)", fontWeight: "500" }}>{rev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
