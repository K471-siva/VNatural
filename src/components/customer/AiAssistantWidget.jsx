import React, { useState, useRef, useEffect } from "react";
import { useDb } from "../../context/DbContext";
import { parseAiMessage } from "../../ai/aiEngine";
import { MessageSquare, X, Send, Sparkles, ShoppingCart, BookOpen } from "lucide-react";
import { Stars } from "../common/Stars";

export const AiAssistantWidget = () => {
  const { products, recipes, language, addToCart, t } = useDb();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "Namaste! Welcome to VNatural. I am your organic food and nutrition guide. How can I help you today?",
      teluguText: "నమస్కారం! వి.నేచురల్ సహాయ కేంద్రానికి స్వాగతం. మీ ఆరోగ్య జీవనశైలికి నేను ఎలా సహాయపడగలను?"
    }
  ]);
  const [geminiKey, setGeminiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const suggestions = [
    { en: "Diabetic friendly foods", te: "డయాబెటిక్ ఆహారాలు" },
    { en: "High protein staples", te: "అధిక ప్రోటీన్ పప్పులు" },
    { en: "Show organic ghee benefits", te: "ఆవు నెయ్యి ఉపయోగాలు" },
    { en: "Explain Moong Dal recipe", te: "పెసరపప్పు కిచిడి రెసిపీ" }
  ];

  const handleSend = async (textToSend) => {
    const text = textToSend || query;
    if (!text.trim()) return;

    // Add user message
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");

    // Simulate typing
    const typingMsg = { sender: "assistant", text: "...", isTyping: true };
    setMessages((prev) => [...prev, typingMsg]);

    setTimeout(async () => {
      // Execute local NLP or Gemini
      const result = await parseAiMessage(text, products, recipes, geminiKey || null);
      
      setMessages((prev) => {
        // Remove typing indicator and add final response
        const filtered = prev.filter(m => !m.isTyping);
        return [
          ...filtered,
          {
            sender: "assistant",
            text: result.text,
            products: result.products,
            recipes: result.recipes
          }
        ];
      });
    }, 600);
  };

  return (
    <div className="ai-chat-widget">
      {/* Floating Trigger Button */}
      <button className="ai-bubble-trigger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={18} color="var(--c-accent)" fill="var(--c-accent)" />
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: "700" }}>VNatural AI Guide</h4>
                <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>Bilingual: En / తె</span>
              </div>
            </div>
            <button onClick={() => setShowKeyInput(!showKeyInput)} style={{ fontSize: "0.75rem", textDecoration: "underline", color: "var(--c-accent)", cursor: "pointer" }}>
              {geminiKey ? "Key Active" : "Add Gemini Key"}
            </button>
          </div>

          {/* Gemini Key Config Area */}
          {showKeyInput && (
            <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--c-border)", backgroundColor: "var(--c-primary-light)" }}>
              <label style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--c-primary)", display: "block", marginBottom: "4px" }}>
                PASTE GEMINI API KEY (OPTIONAL):
              </label>
              <div style={{ display: "flex", gap: "4px" }}>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  style={{ flexGrow: 1, padding: "4px 8px", fontSize: "0.75rem", border: "1px solid var(--c-border)", borderRadius: "4px" }}
                />
                <button 
                  onClick={() => setShowKeyInput(false)}
                  style={{ padding: "4px 8px", fontSize: "0.75rem", background: "var(--c-primary)", color: "#fff", borderRadius: "4px", fontWeight: "600" }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Messages Panel */}
          <div className="ai-chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`ai-message ${msg.sender}`}>
                <div>{msg.sender === "assistant" && language === "te" && msg.teluguText ? msg.teluguText : msg.text}</div>

                {/* Recommendations in Chat */}
                {msg.products && msg.products.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px", width: "100%" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--c-primary)" }}>
                      {t("Recommended Products:", "సిఫార్సు చేయబడిన ఉత్పత్తులు:")}
                    </span>
                    {msg.products.slice(0, 3).map((prod) => (
                      <div key={prod.id} style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        backgroundColor: "var(--c-bg-pure)",
                        padding: "6px",
                        borderRadius: "8px",
                        border: "1px solid var(--c-border)"
                      }}>
                        <img src={prod.image} alt={prod.name} style={{ width: "45px", height: "45px", borderRadius: "6px", objectFit: "cover" }} />
                        <div style={{ flexGrow: 1, minWidth: 0 }}>
                          <h5 style={{ fontSize: "0.8rem", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {t(prod.name, prod.teluguName)}
                          </h5>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--c-primary)" }}>₹{prod.price}</span>
                            <button
                              onClick={() => addToCart(prod, 1)}
                              style={{
                                padding: "2px 6px",
                                backgroundColor: "var(--c-accent)",
                                color: "#fff",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                fontWeight: "600",
                                display: "flex",
                                alignItems: "center",
                                gap: "2px"
                              }}
                            >
                              <ShoppingCart size={10} /> Add
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recipes inside Chat */}
                {msg.recipes && msg.recipes.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", color: "var(--c-primary)" }}>
                      {t("Matching Recipes:", "సరిపోయే వంటకాలు:")}
                    </span>
                    {msg.recipes.map((rec) => (
                      <div key={rec.id} style={{
                        backgroundColor: "var(--c-bg-pure)",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "1px solid var(--c-border)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <BookOpen size={12} color="var(--c-accent)" />
                        <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--c-text)" }}>
                          {t(rec.name, rec.teluguName)} ({rec.difficulty})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Panel */}
          <div className="ai-suggestions">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                className="ai-suggest-btn"
                onClick={() => handleSend(language === "te" ? s.te : s.en)}
              >
                {language === "te" ? s.te : s.en}
              </button>
            ))}
          </div>

          {/* Input field */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="ai-chat-input-area"
          >
            <input
              type="text"
              placeholder={t("Ask VNatural Guide...", "వి.నేచురల్ గైడ్‌ను అడగండి...")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-full)",
                backgroundColor: "var(--c-primary)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
