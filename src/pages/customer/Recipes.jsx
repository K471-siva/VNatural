import React, { useState } from "react";
import { useDb } from "../../context/DbContext";
import { Clock, Users, BookOpen, ShoppingCart, Award, CheckCircle } from "lucide-react";

export const Recipes = () => {
  const { products, recipes, language, t, addToCart } = useDb();
  const [selectedRecipeId, setSelectedRecipeId] = useState(recipes[0]?.id || "");

  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);

  const handleBuyRecipeBundle = () => {
    if (!selectedRecipe) return;

    let itemsAdded = 0;
    selectedRecipe.relatedProductIds.forEach(pid => {
      const prod = products.find(p => p.id === pid);
      if (prod) {
        // Add 1 of each ingredient to cart with a slight bundle discount simulated
        addToCart(prod, 1);
        itemsAdded++;
      }
    });

    if (itemsAdded > 0) {
      alert(t(
        `Success! Added ${itemsAdded} recipe ingredients to your shopping cart.`,
        `విజయవంతం! ${itemsAdded} వంటకానికి కావలసిన సేంద్రీయ పదార్థాలు కార్ట్‌కి చేర్చబడ్డాయి.`
      ));
    }
  };

  return (
    <div className="container" style={{ padding: "40px 16px", animation: "fadeIn 0.3s ease-out" }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", color: "var(--c-primary)", marginBottom: "8px" }}>
          {t("Organic Kitchen Recipes", "సేంద్రీయ వంటకాల గది")}
        </h1>
        <p style={{ color: "var(--c-text-muted)" }}>
          {t("Cook healthy, nutritious Indian meals using VNatural 100% certified organic grains and ghee", 
             "వి.నేచురల్ ఆర్గానిక్ బియ్యం, పప్పులు మరియు నెయ్యి ఉపయోగించి ఆరోగ్యకరమైన వంటకాలు తయారు చేసుకోండి")}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "30px" }}>
        {/* Left Side: Recipes List Tabs */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h3 style={{ fontSize: "1.1rem", borderBottom: "1.5px solid var(--c-border)", paddingBottom: "8px", marginBottom: "10px", color: "var(--c-primary)" }}>
            {t("Browse Recipes", "వంటకాల జాబితా")}
          </h3>
          {recipes.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRecipeId(r.id)}
              style={{
                textAlign: "left",
                padding: "16px",
                borderRadius: "12px",
                border: "1.5px solid " + (selectedRecipeId === r.id ? "var(--c-primary)" : "var(--c-border)"),
                backgroundColor: selectedRecipeId === r.id ? "var(--c-primary-light)" : "#fff",
                transition: "all 0.2s",
                cursor: "pointer"
              }}
            >
              <span style={{ fontSize: "0.75rem", color: "var(--c-accent)", fontWeight: "700", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                {r.difficulty}
              </span>
              <strong style={{ fontSize: "0.95rem", color: "var(--c-text)", display: "block" }}>
                {t(r.name, r.teluguName)}
              </strong>
              <span style={{ fontSize: "0.8rem", color: "var(--c-text-muted)", display: "block", marginTop: "4px" }}>
                {r.prepTime} prep | {r.cookTime} cook
              </span>
            </button>
          ))}
        </aside>

        {/* Right Side: Selected Recipe Details */}
        {selectedRecipe ? (
          <div className="portal-card" style={{ padding: "24px", animation: "slideUp 0.3s ease-out" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
              {/* Recipe Info Column */}
              <div>
                <img 
                  src={selectedRecipe.image} 
                  alt={selectedRecipe.name} 
                  style={{ width: "100%", height: "240px", borderRadius: "12px", objectFit: "cover", marginBottom: "16px", border: "1px solid var(--c-border)" }} 
                />
                
                <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "var(--c-primary)", marginBottom: "8px" }}>
                  {t(selectedRecipe.name, selectedRecipe.teluguName)}
                </h2>

                <div style={{ display: "flex", gap: "16px", marginBottom: "20px", fontSize: "0.85rem", color: "var(--c-text-muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={14} /> {selectedRecipe.prepTime} Prep</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={14} /> {selectedRecipe.cookTime} Cook</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Users size={14} /> {selectedRecipe.servings} Servings</span>
                </div>

                {/* Ingredients Checklists */}
                <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--c-primary)", marginBottom: "10px", borderBottom: "1px solid var(--c-border)", paddingBottom: "4px" }}>
                  {t("Required Ingredients", "కావలసిన పదార్థాలు")}
                </h4>
                <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.9rem", marginBottom: "24px", color: "var(--c-text-muted)" }}>
                  {(language === "te" ? selectedRecipe.teluguIngredients : selectedRecipe.ingredients).map((ing, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <CheckCircle size={12} color="var(--c-accent)" /> <span>{ing}</span>
                    </li>
                  ))}
                </ul>

                {/* Cooking Instructions */}
                <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--c-primary)", marginBottom: "10px", borderBottom: "1px solid var(--c-border)", paddingBottom: "4px" }}>
                  {t("Preparation Method", "తయారీ విధానం")}
                </h4>
                <ol style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem", color: "var(--c-text)" }}>
                  {(language === "te" ? selectedRecipe.teluguInstructions : selectedRecipe.instructions).map((step, idx) => (
                    <li key={idx} style={{ lineHeight: "1.5" }}>{step}</li>
                  ))}
                </ol>
              </div>

              {/* Related VNatural Products Bundle Box */}
              <div>
                <div style={{
                  backgroundColor: "var(--c-primary-light)",
                  border: "2px dashed var(--c-primary)",
                  borderRadius: "16px",
                  padding: "20px",
                  position: "sticky",
                  top: "100px"
                }}>
                  <div className="flex align-center gap-xs" style={{ marginBottom: "12px", color: "var(--c-primary)" }}>
                    <BookOpen size={20} />
                    <h4 style={{ fontSize: "0.95rem", fontWeight: "800" }}>{t("Pantry Sourced Ingredients", "ఆరోగ్యకరమైన కిట్")}</h4>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--c-text-muted)", marginBottom: "16px" }}>
                    {t("These ingredients are harvested directly from our farmers. Buy as a single bundle and save 10% off retail pricing.",
                       "రైతుల నుండి సేకరించిన ఈ కిట్ కొనుగోలు ద్వారా రుచికరమైన ఆరోగ్యకర ఆహారం తయారు చేసుకోండి.")}
                  </p>

                  {/* List of related items */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                    {selectedRecipe.relatedProductIds.map(pid => {
                      const prod = products.find(p => p.id === pid);
                      if (!prod) return null;
                      return (
                        <div key={prod.id} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "var(--c-bg-pure)", padding: "8px", borderRadius: "8px", border: "1px solid var(--c-border)" }}>
                          <img src={prod.image} alt={prod.name} style={{ width: "32px", height: "32px", borderRadius: "4px", objectFit: "cover" }} />
                          <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {t(prod.name, prod.teluguName)}
                            </span>
                            <strong style={{ fontSize: "0.75rem", color: "var(--c-primary)" }}>₹{prod.price}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button className="btn-accent" onClick={handleBuyRecipeBundle} style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
                    <ShoppingCart size={16} /> {t("Buy Ingredients Bundle", "కిట్‌ను కార్ట్‌లో చేర్చు")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <h3>No recipe selected.</h3>
          </div>
        )}
      </div>
    </div>
  );
};
