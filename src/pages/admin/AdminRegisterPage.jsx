import React, { useState } from "react";
import { useDb } from "../../context/DbContext";
import {
  Shield, User, Mail, Lock, Phone, Building2, ChevronRight,
  Eye, EyeOff, CheckCircle, Sparkles, ArrowLeft
} from "lucide-react";

export const AdminRegisterPage = ({ onSuccess, onBackToLogin }) => {
  const { saveUser, login } = useDb();

  const [step, setStep] = useState(1); // 1 = credentials, 2 = personal info
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 1: Account Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 2: Personal / Business Info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [adminCode, setAdminCode] = useState(""); // Secret authorization code

  const SECRET_ADMIN_CODE = "VNAT-ADMIN-2026"; // Admin authorization code

  const handleStep1 = (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (adminCode !== SECRET_ADMIN_CODE) {
      setError("Invalid admin authorization code. Please contact the platform owner.");
      return;
    }
    if (!fullName.trim() || !phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const newAdmin = {
        id: `u_admin_${Date.now()}`,
        email: email.toLowerCase().trim(),
        password,
        role: "admin",
        name: fullName.trim(),
        phone: phone.trim(),
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
        farmName: businessName.trim() || "VNatural Admin",
        farmLocation: null,
        shift: null,
        facility: null,
        vehicleNo: null,
        zone: null,
        addresses: [],
        loyaltyPoints: 0,
        walletBalance: 0,
        dietPreferences: {},
        certifications: [],
        withdrawnAmount: 0,
        payouts: []
      };

      await saveUser(newAdmin);
      const result = await login(email.toLowerCase().trim(), password);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) onSuccess(result.user);
        }, 1800);
      } else {
        setError("Account created but auto-login failed. Please log in manually.");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        fontFamily: "var(--font-sans, 'Inter', sans-serif)"
      }}>
        <div style={{
          maxWidth: "440px", width: "100%", textAlign: "center", padding: "40px",
          background: "rgba(30,41,59,0.9)", borderRadius: "20px",
          border: "1px solid rgba(139,92,246,0.3)",
          boxShadow: "0 25px 50px rgba(139,92,246,0.15)",
          animation: "slideUp 0.4s ease-out"
        }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", boxShadow: "0 8px 25px rgba(16,185,129,0.4)"
          }}>
            <CheckCircle size={40} color="#fff" />
          </div>
          <h2 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "800", marginBottom: "10px" }}>
            Admin Account Created!
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "6px" }}>
            Welcome, <strong style={{ color: "#a78bfa" }}>{fullName}</strong>
          </p>
          <p style={{ color: "#64748b", fontSize: "0.8rem" }}>
            Redirecting you to the customer web dashboard…
          </p>
          <div style={{
            marginTop: "20px", height: "4px", background: "#1e293b",
            borderRadius: "2px", overflow: "hidden"
          }}>
            <div style={{
              height: "100%", background: "linear-gradient(90deg, #8b5cf6, #10b981)",
              borderRadius: "2px", animation: "progressBar 1.8s linear forwards",
              width: "0%"
            }} />
          </div>
        </div>
        <style>{`
          @keyframes progressBar { to { width: 100%; } }
          @keyframes slideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      fontFamily: "var(--font-sans, 'Inter', sans-serif)",
      padding: "40px 20px"
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: "fixed", top: "-100px", right: "-100px", width: "400px", height: "400px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", bottom: "-80px", left: "-80px", width: "300px", height: "300px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{
        maxWidth: "480px", width: "100%",
        background: "rgba(15,23,42,0.85)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(139,92,246,0.25)",
        borderRadius: "20px", padding: "36px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.1)",
        animation: "slideUp 0.4s ease-out"
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "16px",
            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", boxShadow: "0 8px 20px rgba(139,92,246,0.4)"
          }}>
            <Shield size={30} color="#fff" />
          </div>
          <h1 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "800", marginBottom: "6px" }}>
            Create Admin Account
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
            Register as a new platform administrator
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                flex: 1, flexDirection: "column"
              }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "50%",
                  background: step >= s
                    ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                    : "rgba(51,65,85,0.8)",
                  border: step === s ? "2px solid #a78bfa" : "2px solid transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: "0.8rem", fontWeight: "700",
                  transition: "all 0.3s ease",
                  boxShadow: step >= s ? "0 4px 12px rgba(139,92,246,0.4)" : "none"
                }}>
                  {step > s ? <CheckCircle size={14} /> : s}
                </div>
                <span style={{
                  fontSize: "0.65rem", color: step >= s ? "#a78bfa" : "#475569",
                  textAlign: "center", fontWeight: step === s ? "700" : "400"
                }}>
                  {s === 1 ? "Credentials" : "Profile & Verify"}
                </span>
              </div>
              {s < 2 && (
                <div style={{
                  flex: 1, height: "2px", marginBottom: "18px",
                  background: step > 1 ? "linear-gradient(90deg,#8b5cf6,#6d28d9)" : "rgba(51,65,85,0.8)",
                  transition: "background 0.3s ease", borderRadius: "1px"
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: "8px", marginBottom: "16px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "8px"
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1 — Credentials */}
        {step === 1 && (
          <form onSubmit={handleStep1} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                EMAIL ADDRESS *
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@yourcompany.com"
                  style={{
                    width: "100%", padding: "11px 12px 11px 38px", boxSizing: "border-box",
                    background: "rgba(30,41,59,0.8)", border: "1px solid rgba(51,65,85,0.8)",
                    borderRadius: "10px", color: "#fff", fontSize: "0.85rem",
                    outline: "none", transition: "border-color 0.2s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#8b5cf6"}
                  onBlur={e => e.target.style.borderColor = "rgba(51,65,85,0.8)"}
                />
              </div>
            </div>

            <div>
              <label style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                PASSWORD * (min. 8 characters)
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
                <input
                  type={showPassword ? "text" : "password"} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  style={{
                    width: "100%", padding: "11px 40px 11px 38px", boxSizing: "border-box",
                    background: "rgba(30,41,59,0.8)", border: "1px solid rgba(51,65,85,0.8)",
                    borderRadius: "10px", color: "#fff", fontSize: "0.85rem", outline: "none"
                  }}
                  onFocus={e => e.target.style.borderColor = "#8b5cf6"}
                  onBlur={e => e.target.style.borderColor = "rgba(51,65,85,0.8)"}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#475569", cursor: "pointer", padding: "2px"
                }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Password strength bar */}
              {password.length > 0 && (
                <div style={{ marginTop: "6px", display: "flex", gap: "4px" }}>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} style={{
                      flex: 1, height: "3px", borderRadius: "2px", transition: "background 0.3s",
                      background: password.length > i * 2
                        ? password.length < 6 ? "#ef4444" : password.length < 10 ? "#f59e0b" : "#10b981"
                        : "rgba(51,65,85,0.6)"
                    }} />
                  ))}
                  <span style={{ fontSize: "0.65rem", color: "#475569", whiteSpace: "nowrap", marginLeft: "6px" }}>
                    {password.length < 6 ? "Weak" : password.length < 10 ? "Fair" : "Strong"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                CONFIRM PASSWORD *
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
                <input
                  type={showConfirm ? "text" : "password"} required value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  style={{
                    width: "100%", padding: "11px 40px 11px 38px", boxSizing: "border-box",
                    background: "rgba(30,41,59,0.8)",
                    border: `1px solid ${confirmPassword && confirmPassword !== password ? "rgba(239,68,68,0.5)" : "rgba(51,65,85,0.8)"}`,
                    borderRadius: "10px", color: "#fff", fontSize: "0.85rem", outline: "none"
                  }}
                  onFocus={e => e.target.style.borderColor = "#8b5cf6"}
                  onBlur={e => e.target.style.borderColor = confirmPassword && confirmPassword !== password ? "rgba(239,68,68,0.5)" : "rgba(51,65,85,0.8)"}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{
                  position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", color: "#475569", cursor: "pointer", padding: "2px"
                }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p style={{ color: "#f87171", fontSize: "0.7rem", marginTop: "4px" }}>Passwords do not match</p>
              )}
            </div>

            <button type="submit" style={{
              padding: "12px", borderRadius: "10px", border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontWeight: "700", fontSize: "0.9rem",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: "0 6px 20px rgba(139,92,246,0.35)",
              transition: "transform 0.2s, box-shadow 0.2s",
              marginTop: "4px"
            }}
            onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(139,92,246,0.45)"; }}
            onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(139,92,246,0.35)"; }}>
              Continue to Profile <ChevronRight size={16} />
            </button>
          </form>
        )}

        {/* STEP 2 — Profile & Verify */}
        {step === 2 && (
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                  FULL NAME *
                </label>
                <div style={{ position: "relative" }}>
                  <User size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
                  <input
                    type="text" required value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Your full name"
                    style={{
                      width: "100%", padding: "10px 10px 10px 32px", boxSizing: "border-box",
                      background: "rgba(30,41,59,0.8)", border: "1px solid rgba(51,65,85,0.8)",
                      borderRadius: "10px", color: "#fff", fontSize: "0.82rem", outline: "none"
                    }}
                    onFocus={e => e.target.style.borderColor = "#8b5cf6"}
                    onBlur={e => e.target.style.borderColor = "rgba(51,65,85,0.8)"}
                  />
                </div>
              </div>
              <div>
                <label style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                  PHONE *
                </label>
                <div style={{ position: "relative" }}>
                  <Phone size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
                  <input
                    type="tel" required value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 99001 XXXXX"
                    style={{
                      width: "100%", padding: "10px 10px 10px 32px", boxSizing: "border-box",
                      background: "rgba(30,41,59,0.8)", border: "1px solid rgba(51,65,85,0.8)",
                      borderRadius: "10px", color: "#fff", fontSize: "0.82rem", outline: "none"
                    }}
                    onFocus={e => e.target.style.borderColor = "#8b5cf6"}
                    onBlur={e => e.target.style.borderColor = "rgba(51,65,85,0.8)"}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                BUSINESS / ORGANIZATION NAME (Optional)
              </label>
              <div style={{ position: "relative" }}>
                <Building2 size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
                <input
                  type="text" value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="Your company or store name"
                  style={{
                    width: "100%", padding: "11px 12px 11px 38px", boxSizing: "border-box",
                    background: "rgba(30,41,59,0.8)", border: "1px solid rgba(51,65,85,0.8)",
                    borderRadius: "10px", color: "#fff", fontSize: "0.85rem", outline: "none"
                  }}
                  onFocus={e => e.target.style.borderColor = "#8b5cf6"}
                  onBlur={e => e.target.style.borderColor = "rgba(51,65,85,0.8)"}
                />
              </div>
            </div>

            <div>
              <label style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                ADMIN AUTHORIZATION CODE *
              </label>
              <div style={{ position: "relative" }}>
                <Sparkles size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#8b5cf6" }} />
                <input
                  type="password" required value={adminCode}
                  onChange={e => setAdminCode(e.target.value)}
                  placeholder="Enter the secret admin code"
                  style={{
                    width: "100%", padding: "11px 12px 11px 38px", boxSizing: "border-box",
                    background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.3)",
                    borderRadius: "10px", color: "#fff", fontSize: "0.85rem", outline: "none"
                  }}
                  onFocus={e => e.target.style.borderColor = "#8b5cf6"}
                  onBlur={e => e.target.style.borderColor = "rgba(139,92,246,0.3)"}
                />
              </div>
              <p style={{ color: "#475569", fontSize: "0.7rem", marginTop: "5px" }}>
                Contact the platform owner for the admin authorization code.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              <button type="button" onClick={() => { setStep(1); setError(""); }} style={{
                padding: "12px 16px", borderRadius: "10px",
                border: "1px solid rgba(51,65,85,0.8)", cursor: "pointer",
                background: "rgba(30,41,59,0.6)", color: "#94a3b8",
                fontWeight: "600", fontSize: "0.85rem",
                display: "flex", alignItems: "center", gap: "6px"
              }}>
                <ArrowLeft size={15} /> Back
              </button>
              <button type="submit" disabled={loading} style={{
                flex: 1, padding: "12px", borderRadius: "10px", border: "none", cursor: loading ? "not-allowed" : "pointer",
                background: loading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                color: "#fff", fontWeight: "700", fontSize: "0.9rem",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: loading ? "none" : "0 6px 20px rgba(139,92,246,0.35)",
                transition: "all 0.2s"
              }}>
                {loading ? (
                  <><span style={{
                    width: "16px", height: "16px", borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff",
                    animation: "spin 0.8s linear infinite", display: "inline-block"
                  }} /> Creating Account…</>
                ) : (
                  <><Shield size={16} /> Create Admin Account</>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Back to login */}
        <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid rgba(51,65,85,0.5)" }}>
          <button onClick={onBackToLogin} style={{
            background: "none", border: "none", color: "#64748b", fontSize: "0.82rem",
            cursor: "pointer", transition: "color 0.2s"
          }}
          onMouseOver={e => e.target.style.color = "#a78bfa"}
          onMouseOut={e => e.target.style.color = "#64748b"}>
            ← Already have an account? Sign in
          </button>
        </div>

      </div>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
