import React, { useState, useRef, useEffect } from "react";
import { useDb } from "../../context/DbContext";
import { parseAiMessage } from "../../ai/aiEngine";
import { Stars } from "../../components/common/Stars";
import { Sparkles, Send, ShoppingCart, BookOpen, User, HelpCircle, MessageSquare } from "lucide-react";

export const AiNutritionist = () => {
  const { products, recipes, language, addToCart, t } = useDb();

  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "Namaste! Welcome to your VNatural AI Nutrition Center. I can outline organic diet plans, suggest protein-rich grain ratios, recommend farm-traceable staples, or guide you through traditional Telugu recipes. What would you like to prepare or learn about today?",
      teluguText: "నమస్కారం! వి.నేచురల్ ఆర్గానిక్ ఆహార కేంద్రానికి స్వాగతం. మీ శరీర నిరోధక శక్తిని పెంచే ధాన్యాలు, డయాబెటిక్ ఆహార పద్ధతులు, మరియు వివిధ వంటకాల తయారీపై నేను మీకు సహాయం చేయగలను."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const promptShortcuts = [
    {
      title: t("Weekly Diabetic Plan", "డయాబెటిక్ ఆహార పట్టిక"),
      prompt: "Create a weekly grocery plan with low GI diabetic safe items"
    },
    {
      title: t("High Protein Grains", "అధిక ప్రోటీన్ ధాన్యాలు"),
      prompt: "Which grains or dals have the highest protein counts?"
    },
    {
      title: t("Lakadong Turmeric", "లకాడాంగ్ పసుపు లాభాలు"),
      prompt: "Explain the health benefits and curcumin levels of Lakadong turmeric powder"
    },
    {
      title: t("Moong Dal Recipe", "పెసరపప్పు కిచిడి తయారీ"),
      prompt: "Suggest ingredients and details for organic moong dal khichdi"
    }
  ];

  const handleSend = (textToSend) => {
    const text = textToSend || query;
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: "user", text }]);
    setQuery("");
    setIsTyping(true);

    setTimeout(async () => {
      const result = await parseAiMessage(text, products, recipes, null);
      
      setMessages(prev => [
        ...prev,
        {
          sender: "assistant",
          text: result.text,
          products: result.products,
          recipes: result.recipes
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="container" style={{ padding: "40px 16px", animation: "fadeIn 0.3s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", color: "var(--c-primary)", marginBottom: "8px" }}>
          {t("AI Nutritionist & Shopping Guide", "AI పౌష్టికాహార నిపుణుడు")}
        </h1>
        <p style={{ color: "var(--c-text-muted)" }}>
          {t("Intelligent nutritional insights, calorie analysis, and meal planning recommendations based on VNatural staples",
             "సేంద్రీయ ఆహార పదార్థాల పోషక విలువలు మరియు సమతుల్య ఆహార పద్ధతులపై ఉచిత నిపుణుల సలహాలు")}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "30px", height: "550px" }}>
        {/* Left column: prompt shortcuts */}
        <aside style={{
          backgroundColor: "var(--c-bg-pure)",
          border: "1px solid var(--c-border)",
          borderRadius: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}>
          <h3 style={{ fontSize: "1.1rem", borderBottom: "1.5px solid var(--c-border)", paddingBottom: "8px", color: "var(--c-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
            <HelpCircle size={18} color="var(--c-accent)" /> {t("Ask AI Shortcuts", "శీఘ్ర ప్రశ్నలు")}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {promptShortcuts.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s.prompt)}
                style={{
                  textAlign: "left",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid var(--c-border)",
                  backgroundColor: "#fbfbfa",
                  fontSize: "0.85rem",
                  color: "var(--c-text)",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--c-primary)";
                  e.currentTarget.style.backgroundColor = "var(--c-primary-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--c-border)";
                  e.currentTarget.style.backgroundColor = "#fbfbfa";
                }}
              >
                {s.title}
              </button>
            ))}
          </div>
          
          <div style={{ marginTop: "auto", fontSize: "0.75rem", color: "var(--c-text-muted)", backgroundColor: "var(--c-primary-light)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(45, 90, 39, 0.15)" }}>
            <strong>💡 AI Tip:</strong> Ask questions like <em>"What dal has the most protein?"</em> or search in Telugu <em>"ఆవు నెయ్యి లాభాలు"</em> for instant guides.
          </div>
        </aside>

        {/* Right column: Chat timelines */}
        <div style={{
          backgroundColor: "var(--c-bg-pure)",
          border: "1px solid var(--c-border)",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: "1.5px solid var(--c-border)",
            backgroundColor: "var(--c-primary)",
            color: "#000",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <Sparkles size={18} color="var(--c-accent)" fill="var(--c-accent)" />
            <div>
              <strong style={{ fontSize: "1rem" }}>VNatural Nutrition Engine v1.2</strong>
              <span style={{ fontSize: "0.7rem", opacity: 0.8, display: "block" }}>Bilingual English & తెలుగు Interactive Chat</span>
            </div>
          </div>

          {/* Messages timeline */}
          <div style={{
            flexGrow: 1,
            padding: "20px",
            overflowY: "auto",
            backgroundColor: "#f7f5f0",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}>
            {messages.map((msg, index) => (
              <div 
                key={index}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "75%"
                }}
              >
                {msg.sender === "assistant" && (
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--c-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Sparkles size={14} />
                  </div>
                )}
                
                <div style={{
                  backgroundColor: msg.sender === "user" ? "var(--c-accent)" : "#fff",
                  color: msg.sender === "user" ? "#fff" : "var(--c-text)",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  borderBottomLeftRadius: msg.sender === "assistant" ? "2px" : "12px",
                  borderBottomRightRadius: msg.sender === "user" ? "2px" : "12px",
                  boxShadow: "var(--shadow-sm)",
                  fontSize: "0.95rem",
                  lineHeight: "1.5"
                }}>
                  <div>{msg.sender === "assistant" && language === "te" && msg.teluguText ? msg.teluguText : msg.text}</div>

                  {/* Products Matches in Chat */}
                  {msg.products && msg.products.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginTop: "14px", borderTop: "1px solid var(--c-border)", paddingTop: "10px" }}>
                      {msg.products.map(p => (
                        <div key={p.id} style={{ display: "flex", gap: "8px", backgroundColor: "#fbfbfa", padding: "8px", borderRadius: "8px", border: "1px solid var(--c-border)" }}>
                          <img src={p.image} alt={p.name} style={{ width: "40px", height: "40px", borderRadius: "4px", objectFit: "cover" }} />
                          <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <span style={{ fontSize: "0.75rem", fontWeight: "600", display: "block", color: "var(--c-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {t(p.name, p.teluguName)}
                            </span>
                            <div className="flex align-center justify-between" style={{ marginTop: "4px" }}>
                              <strong style={{ fontSize: "0.8rem", color: "var(--c-primary)" }}>₹{p.price}</strong>
                              <button 
                                className="btn-accent" 
                                onClick={() => addToCart(p, 1)}
                                style={{ padding: "2px 6px", fontSize: "0.65rem", borderRadius: "4px" }}
                              >
                                Buy
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recipes Matches in Chat */}
                  {msg.recipes && msg.recipes.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px", borderTop: "1px solid var(--c-border)", paddingTop: "8px" }}>
                      {msg.recipes.map(r => (
                        <div key={r.id} style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#fbfbfa", padding: "6px 10px", borderRadius: "8px", border: "1px solid var(--c-border)" }}>
                          <BookOpen size={12} color="var(--c-accent)" />
                          <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--c-text)" }}>
                            {t(r.name, r.teluguName)} ({r.difficulty})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--c-accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: "flex", gap: "12px", alignSelf: "flex-start" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "var(--c-primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={14} />
                </div>
                <div style={{ backgroundColor: "var(--c-bg-card)", color: "var(--c-text)", border: "1px solid var(--c-border-subtle)", padding: "12px 16px", borderRadius: "12px", borderBottomLeftRadius: "2px", boxShadow: "var(--shadow-sm)", fontSize: "0.95rem" }}>
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "12px 20px",
              borderTop: "1.5px solid var(--c-border)",
              display: "flex",
              gap: "10px"
            }}
          >
            <input
              type="text"
              className="portal-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Type your organic food or health query here...", "మీ సేంద్రీయ ఆహార లేదా ఆరోగ్య సందేహాలను ఇక్కడ అడగండి...")}
              style={{ flexGrow: 1, borderRadius: "20px", padding: "10px 16px" }}
            />
            <button
              type="submit"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                backgroundColor: "var(--c-primary)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
