import React from "react";
import { useDb } from "../../context/DbContext";
import { ShoppingBag, Trash2, CalendarClock, CreditCard, ArrowRight } from "lucide-react";

export const Cart = ({ setPage }) => {
  const { cart, removeFromCart, updateCartQuantity, t } = useDb();

  const total = cart.reduce((sum, item) => {
    // 15% discount for subscribed items
    const price = item.isSubscribed ? Math.round(item.price * 0.85) : item.price;
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setPage("checkout");
  };

  return (
    <div className="container" style={{ padding: "40px 16px", animation: "fadeIn 0.3s ease-out" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", color: "var(--c-primary)", marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
        <ShoppingBag size={28} color="var(--c-accent)" /> {t("Your Shopping Cart", "మీ షాపింగ్ కార్ట్")}
      </h1>

      {cart.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: "30px" }}>
          {/* Cart Items list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {cart.map((item) => {
              const discountedPrice = item.isSubscribed ? Math.round(item.price * 0.85) : item.price;

              return (
                <div key={`${item.productId}-${item.isSubscribed}`} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  backgroundColor: "#fff",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid var(--c-border)",
                  boxShadow: "var(--shadow-sm)"
                }}>
                  <img src={item.image} alt={item.name} style={{ width: "80px", height: "80px", borderRadius: "8px", objectFit: "cover" }} />
                  
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t(item.name, item.teluguName)}
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--c-text-muted)" }}>{t("Unit: " + item.unit, "పరిమాణం: " + item.unit)}</span>
                    
                    {/* Subscription tag indicator */}
                    {item.isSubscribed ? (
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        backgroundColor: "rgba(212, 163, 115, 0.15)",
                        color: "var(--c-accent)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        marginLeft: "10px"
                      }}>
                        <CalendarClock size={12} /> {t("Monthly Subscription", "నెలవారీ సబ్‌స్క్రిప్షన్")}
                      </span>
                    ) : (
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        backgroundColor: "rgba(45, 90, 39, 0.08)",
                        color: "var(--c-primary)",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        marginLeft: "10px"
                      }}>
                        {t("One-time", "ఒకసారి కొనుగోలు")}
                      </span>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid var(--c-border)",
                        borderRadius: "6px"
                      }}>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.isSubscribed)}
                          style={{ padding: "4px 10px", fontWeight: "bold" }}
                        >
                          -
                        </button>
                        <span style={{ width: "24px", textAlign: "center", fontSize: "0.85rem", fontWeight: "600" }}>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.isSubscribed)}
                          style={{ padding: "4px 10px", fontWeight: "bold" }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.isSubscribed)}
                        style={{ color: "var(--error)", marginLeft: "10px", display: "flex", alignItems: "center", gap: "2px", fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        <Trash2 size={14} /> {t("Remove", "తొలగించు")}
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <strong style={{ fontSize: "1.15rem", color: "var(--c-primary)", fontFamily: "var(--font-display)" }}>
                      ₹{discountedPrice * item.quantity}
                    </strong>
                    {item.isSubscribed && (
                      <span style={{ display: "block", fontSize: "0.75rem", color: "var(--success)" }}>
                        (₹{discountedPrice} {t("each", "ఒకటి")})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart summary box */}
          <div>
            <div style={{
              backgroundColor: "#fff",
              border: "1px solid var(--c-border)",
              borderRadius: "16px",
              padding: "24px",
              position: "sticky",
              top: "100px"
            }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: "800", color: "var(--c-primary)", borderBottom: "1.5px solid var(--c-border)", paddingBottom: "12px", marginBottom: "16px" }}>
                {t("Order Summary", "ఆర్డర్ వివరాలు")}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "0.95rem", marginBottom: "20px" }}>
                <div className="flex justify-between">
                  <span>{t("Basket Items Subtotal", "సరుకుల మొత్తం")}</span>
                  <strong>₹{total}</strong>
                </div>
                <div className="flex justify-between">
                  <span>{t("Local Shipping", "హోమ్ డెలివరీ")}</span>
                  <strong style={{ color: "var(--success)" }}>{t("FREE", "ఉచితం")}</strong>
                </div>
                <div className="flex justify-between" style={{ borderTop: "1.5px solid var(--c-border)", paddingTop: "12px", fontSize: "1.2rem", color: "var(--c-primary)" }}>
                  <strong>{t("Estimated Total", "మొత్తం బిల్లు")}</strong>
                  <strong style={{ fontFamily: "var(--font-display)" }}>₹{total}</strong>
                </div>
              </div>

              <button className="btn-primary" onClick={handleCheckout} style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
                <CreditCard size={18} /> {t("Proceed to Checkout", "చెక్అవుట్ చేయండి")} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "80px 20px",
          backgroundColor: "#fff",
          borderRadius: "16px",
          border: "1px solid var(--c-border)"
        }}>
          <ShoppingBag size={48} color="var(--c-text-muted)" style={{ marginBottom: "16px" }} />
          <h3>{t("Your cart is empty!", "మీ షాపింగ్ కార్ట్ ఖాళీగా ఉంది!")}</h3>
          <p style={{ color: "var(--c-text-muted)", fontSize: "0.9rem", margin: "8px 0 20px" }}>
            {t("Browse our organic products catalog and add items to your cart.", "సేంద్రీయ ఉత్పత్తుల కేటలాగ్ చూసి మీకు కావలసినవి ఎంచుకోండి.")}
          </p>
          <button className="btn-primary" onClick={() => setPage("catalog")}>
            {t("Browse Catalog", "కేటలాగ్ చూడండి")}
          </button>
        </div>
      )}
    </div>
  );
};
