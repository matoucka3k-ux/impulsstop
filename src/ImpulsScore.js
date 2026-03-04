import React, { useState, useEffect, useRef } from "react";

// ─── CONFETTI ────────────────────────────────────────────────────────────────
export function launchConfetti(color = "#9CAF88") {
  const colors = [color, "#9CAF88", "#E8C4A0", "#B8D4C8", "#D4856A"];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement("div");
    el.style.cssText = `
      position:fixed; width:${Math.random()*8+4}px; height:${Math.random()*8+4}px;
      left:${Math.random()*100}vw; top:-10px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${Math.random()>0.5?"50%":"2px"};
      animation:confetti-fall ${Math.random()*2+2}s ${Math.random()*0.8}s linear forwards;
      z-index:9999; pointer-events:none;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// ─── SCORE CONFIG ────────────────────────────────────────────────────────────
export const scoreConfig = {
  low:    { min:0,  max:25,  label:"LE RÉFLÉCHI",   color:"#A8E6CF", bg:"rgba(184,212,200,0.08)", shake:false, pulse:false, alarm:false, drama:1, savings:500,  msg:"Tu achètes avec la tête. Quelques petites habitudes à peaufiner et tu es au top.", shortMsg:"Sous contrôle" },
  medium: { min:26, max:50,  label:"LE SPONTANÉ",   color:"#9CAF88", bg:"rgba(156,175,136,0.08)", shake:false, pulse:true,  alarm:false, drama:2, savings:2160, msg:"Tu te laisses parfois emporter par l'instant. C'est humain — les marques comptent là-dessus.", shortMsg:"Quelques signaux" },
  high:   { min:51, max:75,  label:"L'ÉMOTIONNEL",  color:"#FFD580", bg:"rgba(232,196,160,0.08)", shake:true,  pulse:true,  alarm:false, drama:3, savings:4800, msg:"Tes achats sont souvent liés à ce que tu ressens. Apprendre à les décoder change tout.", shortMsg:"Attention requise" },
  crisis: { min:76, max:100, label:"LE RÉFLEXE",    color:"#FF6B6B", bg:"rgba(212,133,106,0.08)", shake:true,  pulse:true,  alarm:true,  drama:4, savings:8400, msg:"Acheter est devenu automatique. La bonne nouvelle ? Ça se travaille, et t'es au bon endroit.", shortMsg:"Action urgente" },
};

export function getConfig(score) {
  return Object.values(scoreConfig).find(c => score >= c.min && score <= c.max) || scoreConfig.low;
}

// ─── IMPULS SCORE REVEAL ─────────────────────────────────────────────────────
export function ImpulsScoreReveal({ score, onDone }) {
  const cfg = getConfig(score);
  const [phase, setPhase] = useState("loading"); // loading → suspense → counting → reveal
  const [displayScore, setDisplayScore] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [shake, setShake] = useState(false);
  const [bgFlash, setBgFlash] = useState(false);
  const counterRef = useRef(null);

  // Phase 1: loading bar
  useEffect(() => {
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 8 + 2;
      if (prog >= 100) { prog = 100; clearInterval(interval); setTimeout(() => setPhase("suspense"), 400); }
      setLoadProgress(prog);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Phase 2: suspense text (2s)
  useEffect(() => {
    if (phase !== "suspense") return;
    const t = setTimeout(() => setPhase("counting"), 2200);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase 3: counting up with drama
  useEffect(() => {
    if (phase !== "counting") return;
    const duration = 300 + cfg.drama * 600; // slower = more dramatic
    const steps = 60;
    let step = 0;
    // easing: fast then slow
    counterRef.current = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * score);
      setDisplayScore(current);

      // Dramatic effects during counting
      if (cfg.shake && step % 8 === 0) setShake(s => !s);
      if (cfg.alarm && step % 6 === 0) setBgFlash(f => !f);

      if (step >= steps) {
        clearInterval(counterRef.current);
        setDisplayScore(score);
        setShake(false);
        setBgFlash(false);
        setTimeout(() => {
          setPhase("reveal");
          if (score <= 25) launchConfetti("#A8E6CF");
        }, 400);
      }
    }, duration / steps);
    return () => clearInterval(counterRef.current);
  }, [phase, score, cfg]);

  const suspenseMessages = [
    "Analyse de ton comportement...",
    "Calcul de ton profil...",
    "Évaluation des patterns...",
    "Résultat en cours...",
  ];
  const [suspenseIdx] = useState(Math.floor(Math.random() * suspenseMessages.length));

  return (
    <div style={{
      minHeight: "100vh", background: bgFlash ? "#1a0000" : "#0D0D0D",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "0 24px",
      transition: "background 0.15s",
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "absolute", top: "35%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 320, height: 320, borderRadius: "50%",
        background: `radial-gradient(circle, ${cfg.color}12 0%, transparent 70%)`,
        pointerEvents: "none",
        transition: "background 0.5s",
      }} />

      {phase === "loading" && (
        <div style={{ width: "100%", maxWidth: 300, textAlign: "center" }}>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 13, letterSpacing: 4, color: cfg.color, opacity: 0.6, marginBottom: 24 }}>
            IMPULS SCORE
          </div>
          <div style={{ height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 100, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ height: "100%", background: cfg.color, borderRadius: 100, width: loadProgress + "%", transition: "width 0.1s" }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Analyse de tes réponses...</p>
        </div>
      )}

      {phase === "suspense" && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "Bebas Neue", fontSize: 120, color: "rgba(255,255,255,0.04)",
            letterSpacing: 8, lineHeight: 1, marginBottom: 24,
            animation: "pulse-opacity 0.8s ease infinite alternate",
          }}>?</div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, fontStyle: "italic" }}>
            {suspenseMessages[suspenseIdx]}
          </p>
          <div style={{ marginTop: 16, display: "flex", gap: 6, justifyContent: "center" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: "50%", background: cfg.color,
                animation: `dot-bounce 1.2s ${i*0.2}s ease-in-out infinite alternate`,
                opacity: 0.7,
              }} />
            ))}
          </div>
        </div>
      )}

      {(phase === "counting" || phase === "reveal") && (
        <div style={{
          textAlign: "center", width: "100%",
          transform: shake ? `rotate(${Math.random() > 0.5 ? 1 : -1}deg) translateX(${Math.random() > 0.5 ? 3 : -3}px)` : "none",
          transition: "transform 0.05s",
        }}>
          {/* Score label */}
          <div style={{ fontFamily: "Bebas Neue", fontSize: 13, letterSpacing: 4, color: cfg.color, opacity: 0.7, marginBottom: 16 }}>
            IMPULS SCORE
          </div>

          {/* Big score number */}
          <div style={{
            fontFamily: "Bebas Neue",
            fontSize: phase === "reveal" ? 120 : 96,
            color: cfg.color,
            letterSpacing: 4, lineHeight: 1,
            transition: "font-size 0.4s, text-shadow 0.4s",
            textShadow: phase === "reveal" ? `0 0 60px ${cfg.color}60` : "none",
            marginBottom: 8,
          }}>
            {displayScore}
          </div>

          <div style={{ fontFamily: "Bebas Neue", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: 3, marginBottom: 32 }}>
            SUR 100
          </div>

          {/* Alarm for high scores */}
          {cfg.alarm && phase === "counting" && (
            <div style={{
              background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)",
              borderRadius: 12, padding: "10px 16px", marginBottom: 24,
              animation: "pulse-opacity 0.5s ease infinite alternate",
            }}>
              <p style={{ color: "#FF6B6B", fontSize: 13, margin: 0 }}>⚠️ Score élevé détecté</p>
            </div>
          )}

          {phase === "reveal" && (
            <div style={{ animation: "fade-up 0.5s ease forwards" }}>
              <div style={{
                background: cfg.bg, border: `1px solid ${cfg.color}30`,
                borderRadius: 20, padding: "16px 20px", marginBottom: 24,
              }}>
                <p style={{ fontFamily: "Bebas Neue", fontSize: 22, color: cfg.color, letterSpacing: 3, margin: "0 0 6px" }}>
                  {cfg.label}
                </p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                  {cfg.msg}
                </p>
              </div>
              <button
                onClick={onDone}
                style={{
                  background: cfg.color, color: "#0D0D0D",
                  border: "none", borderRadius: 100,
                  padding: "18px 0", width: "100%",
                  fontFamily: "DM Sans", fontWeight: 700, fontSize: 16,
                  cursor: "pointer",
                }}
              >
                Voir mon analyse complète →
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse-opacity { from { opacity: 0.3; } to { opacity: 1; } }
        @keyframes dot-bounce { from { transform: translateY(0); } to { transform: translateY(-8px); } }
        @keyframes fade-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

// ─── SHARE CARD ──────────────────────────────────────────────────────────────
export function ShareCard({ score, onClose }) {
  const cfg = getConfig(score);
  const cardRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://impulsstop.app/score?s=${score}`;
  const shareText = `Mon Impuls Score : ${score}/100 — ${cfg.shortMsg} 🛍️ Teste le tien sur ImpulsStop`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareNative = () => {
    if (navigator.share) {
      navigator.share({ title: "Mon Impuls Score", text: shareText, url: shareUrl });
    }
  };

  const sharePlatforms = [
    { label: "Instagram", icon: "📸", action: () => { copyLink(); } },
    { label: "WhatsApp", icon: "💬", action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`) },
    { label: "Twitter/X", icon: "𝕏", action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`) },
    { label: "Copier", icon: copied ? "✓" : "🔗", action: copyLink },
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "flex-end", zIndex: 200, padding: "0 16px 32px",
    }}>
      <div style={{
        width: "100%", maxWidth: 400,
        background: "#1A1A1A", borderRadius: 28,
        padding: 24, border: "1px solid rgba(255,255,255,0.08)",
        animation: "slide-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
      }}>
        {/* Preview Card */}
        <div ref={cardRef} style={{
          background: `linear-gradient(135deg, #0D0D0D, #1A1A1A)`,
          border: `1.5px solid ${cfg.color}30`,
          borderRadius: 20, padding: "28px 24px",
          marginBottom: 20, textAlign: "center",
          position: "relative", overflow: "hidden",
        }}>
          {/* Glow */}
          <div style={{
            position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
            width: 200, height: 200, borderRadius: "50%",
            background: `radial-gradient(circle, ${cfg.color}20, transparent 70%)`,
            pointerEvents: "none",
          }} />
          <div style={{ fontFamily: "Bebas Neue", fontSize: 11, letterSpacing: 4, color: cfg.color, opacity: 0.7, marginBottom: 8 }}>
            IMPULS SCORE
          </div>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 80, color: cfg.color, letterSpacing: 4, lineHeight: 1, marginBottom: 4, textShadow: `0 0 40px ${cfg.color}50` }}>
            {score}
          </div>
          <div style={{ fontFamily: "Bebas Neue", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 3, marginBottom: 12 }}>SUR 100</div>
          <div style={{
            background: cfg.bg, border: `1px solid ${cfg.color}25`,
            borderRadius: 100, padding: "6px 16px", display: "inline-block",
          }}>
            <span style={{ fontFamily: "Bebas Neue", fontSize: 14, color: cfg.color, letterSpacing: 2 }}>{cfg.label}</span>
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0, letterSpacing: 1 }}>impulsstop.app</p>
          </div>
        </div>

        {/* Share buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          {sharePlatforms.map(p => (
            <button key={p.label} onClick={p.action} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 14, padding: "14px 0",
              color: "#F0EDE8", fontSize: 13, fontFamily: "DM Sans", fontWeight: 500,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 6,
              transition: "all 0.2s",
            }}>
              <span style={{ fontSize: 16 }}>{p.icon}</span> {p.label}
            </button>
          ))}
        </div>

        {/* Native share */}
        {navigator.share && (
          <button onClick={shareNative} style={{
            width: "100%", padding: "16px", borderRadius: 100,
            background: cfg.color, color: "#0D0D0D",
            border: "none", fontFamily: "DM Sans", fontWeight: 700,
            fontSize: 15, cursor: "pointer", marginBottom: 10,
          }}>
            Partager maintenant →
          </button>
        )}

        <button onClick={onClose} style={{
          width: "100%", padding: "12px", background: "none",
          border: "none", color: "rgba(255,255,255,0.3)",
          fontSize: 14, cursor: "pointer",
        }}>Fermer</button>
      </div>
      <style>{`
        @keyframes slide-up { from { transform:translateY(40px); opacity:0; } to { transform:translateY(0); opacity:1; } }
      `}</style>
    </div>
  );
}

// ─── COMMUNITY FORUM ─────────────────────────────────────────────────────────
const INITIAL_THREADS = [
  {
    id: 1, profile: "Le Spontané", color: "#9CAF88", author: "Marie_26", time: "il y a 2h",
    title: "J'ai résisté à une promo Shein de 70% 🎉",
    body: "Première fois que je ferme l'app sans acheter. Le bouton pause m'a aidé à réaliser que c'était l'excitation de la promo, pas un vrai besoin.",
    likes: 34, replies: [
      { author: "Lucas_R", body: "Bravo ! Moi j'ai désinstallé l'app. Game changer.", likes: 12, time: "il y a 1h" },
      { author: "Camille_B", body: "La promo crée une fausse urgence. On a tous ce biais 😅", likes: 8, time: "il y a 45min" },
    ],
  },
  {
    id: 2, profile: "L'Émotionnel", color: "#FFD580", author: "Thomas_BDX", time: "il y a 5h",
    title: "Mon score était 71. C'était un choc.",
    body: "Je pensais que j'avais juste 'le goût du shopping'. Voir le chiffre m'a vraiment mis une claque. Qui d'autre a eu cette réaction ?",
    likes: 67, replies: [
      { author: "Sarah_M", body: "Score 74 ici. J'ai mis 10 minutes à m'en remettre 😬", likes: 23, time: "il y a 4h" },
      { author: "Alexis_P", body: "Pareil, 68. Le truc c'est que ça m'a motivé à changer.", likes: 19, time: "il y a 3h" },
    ],
  },
  {
    id: 3, profile: "Le Réfléchi", color: "#A8E6CF", author: "Julie_Paris", time: "il y a 1j",
    title: "14 jours de streak ! Voici ce que j'ai changé",
    body: "J'ai créé une règle simple : tout achat > 30€ attend 48h. En 2 semaines, j'ai économisé 180€. Voici mes 3 astuces...",
    likes: 112, replies: [
      { author: "Nico_L", body: "Tu peux partager tes 3 astuces ?", likes: 31, time: "il y a 20h" },
      { author: "Julie_Paris", body: "1) Désactiver les notifs promo 2) Liste de souhaits 3) Règle 48h", likes: 44, time: "il y a 18h" },
    ],
  },
];

const PROFILE_ROOMS = [
  { key: "all",    label: "Tous",          color: "#7D9B6A", icon: "◈" },
  { key: "low",    label: "Le Réfléchi",   color: "#A8E6CF", icon: "🟢" },
  { key: "medium", label: "Le Spontané",   color: "#9CAF88", icon: "🟡" },
  { key: "high",   label: "L'Émotionnel",  color: "#FFD580", icon: "🟠" },
  { key: "crisis", label: "Le Réflexe",    color: "#FF6B6B", icon: "🔴" },
];

export function Community({ userScore }) {
  const userCfg = getConfig(userScore || 50);
  const [room, setRoom] = useState("all");
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [openThread, setOpenThread] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [replyText, setReplyText] = useState("");
  const [likedThreads, setLikedThreads] = useState({});
  const [activeChat, setActiveChat] = useState(null);

  // Chat rooms messages
  const [chatMessages, setChatMessages] = useState({
    all:    [{ author: "ImpulsStop", body: "Bienvenue dans le chat communauté ! 👋", time: "maintenant", isSystem: true }],
    low:    [{ author: "ImpulsStop", body: "Salon Le Réfléchi 🟢 — Partagez vos bonnes pratiques", time: "maintenant", isSystem: true }],
    medium: [{ author: "ImpulsStop", body: "Salon Le Spontané 🟡 — On se comprend ici !", time: "maintenant", isSystem: true }],
    high:   [{ author: "ImpulsStop", body: "Salon L'Émotionnel 🟠 — Exprimez-vous librement", time: "maintenant", isSystem: true }],
    crisis: [{ author: "ImpulsStop", body: "Salon Le Réflexe 🔴 — Vous n'êtes pas seuls", time: "maintenant", isSystem: true }],
  });
  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, activeChat]);

  const likeThread = (id) => {
    setLikedThreads(l => ({ ...l, [id]: !l[id] }));
    setThreads(ts => ts.map(t => t.id === id ? { ...t, likes: t.likes + (likedThreads[id] ? -1 : 1) } : t));
  };

  const postThread = () => {
    if (!newTitle.trim()) return;
    setThreads(ts => [{
      id: Date.now(), profile: userCfg.label, color: userCfg.color,
      author: "Toi", time: "à l'instant",
      title: newTitle, body: newBody, likes: 0, replies: [],
    }, ...ts]);
    setNewTitle(""); setNewBody(""); setShowNew(false);
  };

  const postReply = (threadId) => {
    if (!replyText.trim()) return;
    setThreads(ts => ts.map(t => t.id === threadId ? {
      ...t, replies: [...t.replies, { author: "Toi", body: replyText, likes: 0, time: "à l'instant" }]
    } : t));
    setReplyText("");
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), { author: "Toi", body: chatInput, time: "à l'instant", isSystem: false }]
    }));
    setChatInput("");
  };

  // ── Chat view
  if (activeChat !== null) {
    const roomInfo = PROFILE_ROOMS.find(r => r.key === activeChat);
    const msgs = chatMessages[activeChat] || [];
    return (
      <div style={{ minHeight: "100vh", background: "#0D0D0D", display: "flex", flexDirection: "column", paddingBottom: 80 }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, background: "rgba(13,13,13,0.95)", backdropFilter: "blur(12px)", zIndex: 10 }}>
          <button onClick={() => setActiveChat(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer" }}>←</button>
          <span style={{ fontSize: 20 }}>{roomInfo.icon}</span>
          <div>
            <p style={{ color: "#F0EDE8", fontWeight: 600, fontSize: 15, margin: 0 }}>Chat — {roomInfo.label}</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0 }}>{msgs.length} messages</p>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: "16px 16px", display: "flex", flexDirection: "column", gap: 10, overflowY: "auto" }}>
          {msgs.map((m, i) => (
            <div key={i} style={{
              display: "flex", flexDirection: m.author === "Toi" ? "row-reverse" : "row",
              gap: 10, alignItems: "flex-end",
            }}>
              {m.author !== "Toi" && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: roomInfo.color + "30", border: `1px solid ${roomInfo.color}40`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: roomInfo.color, fontWeight: 700 }}>
                  {m.author[0]}
                </div>
              )}
              <div style={{
                maxWidth: "75%",
                background: m.isSystem ? "rgba(255,255,255,0.04)" : m.author === "Toi" ? roomInfo.color : "rgba(255,255,255,0.07)",
                borderRadius: m.author === "Toi" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "10px 14px",
                border: m.isSystem ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}>
                {m.author !== "Toi" && !m.isSystem && (
                  <p style={{ color: roomInfo.color, fontSize: 11, fontWeight: 600, margin: "0 0 4px" }}>{m.author}</p>
                )}
                <p style={{ color: m.author === "Toi" ? "#0D0D0D" : m.isSystem ? "rgba(240,237,232,0.4)" : "#F0EDE8", fontSize: 14, margin: 0, lineHeight: 1.5 }}>{m.body}</p>
                <p style={{ color: m.author === "Toi" ? "rgba(0,0,0,0.4)" : "rgba(240,237,232,0.25)", fontSize: 10, margin: "4px 0 0", textAlign: m.author === "Toi" ? "right" : "left" }}>{m.time}</p>
              </div>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>

        {/* Input */}
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, padding: "12px 16px 24px", background: "rgba(13,13,13,0.98)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendChat()}
              placeholder="Écris un message..."
              style={{ flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, color: "#F0EDE8", fontSize: 14, outline: "none" }}
            />
            <button onClick={sendChat} style={{ width: 44, height: 44, borderRadius: "50%", background: roomInfo.color, border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Thread detail view
  if (openThread !== null) {
    const thread = threads.find(t => t.id === openThread);
    if (!thread) return null;
    return (
      <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "0 0 100px" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, background: "rgba(13,13,13,0.95)", backdropFilter: "blur(12px)" }}>
          <button onClick={() => setOpenThread(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 20, cursor: "pointer" }}>←</button>
          <p style={{ color: "#F0EDE8", fontWeight: 600, margin: 0 }}>Discussion</p>
        </div>
        <div style={{ padding: "20px 20px" }}>
          <div style={{ background: `${thread.color}10`, border: `1px solid ${thread.color}25`, borderRadius: 20, padding: "20px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: thread.color + "30", border: `1px solid ${thread.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: thread.color, fontWeight: 700 }}>{thread.author[0]}</div>
              <div>
                <span style={{ color: "#F0EDE8", fontSize: 13, fontWeight: 600 }}>{thread.author}</span>
                <span style={{ color: thread.color, fontSize: 11, marginLeft: 8 }}>{thread.profile}</span>
              </div>
              <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{thread.time}</span>
            </div>
            <h3 style={{ color: "#F0EDE8", fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>{thread.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{thread.body}</p>
            <button onClick={() => likeThread(thread.id)} style={{ marginTop: 14, background: "none", border: "none", color: likedThreads[thread.id] ? thread.color : "rgba(240,237,232,0.3)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              {likedThreads[thread.id] ? "♥" : "♡"} {thread.likes}
            </button>
          </div>

          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>{thread.replies.length} réponses</p>

          {thread.replies.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.06)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>{r.author[0]}</div>
              <div>
                <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                  <span style={{ color: "#F0EDE8", fontSize: 13, fontWeight: 600 }}>{r.author}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{r.time}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0, lineHeight: 1.5 }}>{r.body}</p>
              </div>
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Répondre..."
              onKeyDown={e => e.key === "Enter" && postReply(thread.id)}
              style={{ flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, color: "#F0EDE8", fontSize: 14, outline: "none" }} />
            <button onClick={() => postReply(thread.id)} style={{ width: 44, height: 44, borderRadius: "50%", background: userCfg.color, border: "none", cursor: "pointer", fontSize: 16 }}>→</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main forum view
  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "32px 20px 100px" }}>
      <span style={{ fontFamily: "Bebas Neue", fontSize: 13, letterSpacing: 4, color: "#9CAF88", opacity: 0.7 }}>COMMUNAUTÉ</span>
      <h2 style={{ fontFamily: "Bebas Neue", fontSize: 36, color: "#F0EDE8", letterSpacing: 2, margin: "4px 0 20px" }}>FORUM</h2>

      {/* Chat rooms */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Chats en direct</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PROFILE_ROOMS.map(r => (
            <button key={r.key} onClick={() => setActiveChat(r.key)} style={{
              background: "rgba(255,255,255,0.04)", border: `1px solid ${r.color}25`,
              borderRadius: 16, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              transition: "all 0.2s",
            }}>
              <span style={{ fontSize: 20 }}>{r.icon}</span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <p style={{ color: r.color, fontWeight: 600, fontSize: 14, margin: 0 }}>{r.label}</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, margin: "2px 0 0" }}>Chat en direct</p>
              </div>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.color, opacity: 0.7 }} />
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 16 }}>→</span>
            </button>
          ))}
        </div>
      </div>

      {/* Threads */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", margin: 0 }}>Discussions</p>
        <button onClick={() => setShowNew(true)} style={{ background: "rgba(200,245,122,0.1)", border: "1px solid rgba(200,245,122,0.3)", borderRadius: 100, padding: "6px 14px", color: "#9CAF88", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Nouveau</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {threads.map(t => (
          <div key={t.id} onClick={() => setOpenThread(t.id)} style={{
            background: "rgba(255,255,255,0.04)", border: `1.5px solid rgba(255,255,255,0.07)`,
            borderRadius: 20, padding: "16px", cursor: "pointer",
            transition: "all 0.2s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: t.color + "30", border: `1px solid ${t.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: t.color, fontWeight: 700 }}>{t.author[0]}</div>
              <span style={{ color: "#F0EDE8", fontSize: 13, fontWeight: 600 }}>{t.author}</span>
              <span style={{ background: t.color + "20", border: `1px solid ${t.color}30`, borderRadius: 100, padding: "2px 8px", fontSize: 10, color: t.color }}>{t.profile}</span>
              <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.25)", fontSize: 11 }}>{t.time}</span>
            </div>
            <h3 style={{ color: "#F0EDE8", fontSize: 15, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.3 }}>{t.title}</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, margin: "0 0 12px", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{t.body}</p>
            <div style={{ display: "flex", gap: 16 }}>
              <span style={{ color: likedThreads[t.id] ? t.color : "rgba(240,237,232,0.3)", fontSize: 12 }}>{likedThreads[t.id] ? "♥" : "♡"} {t.likes}</span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>💬 {t.replies.length}</span>
            </div>
          </div>
        ))}
      </div>

      {/* New thread modal */}
      {showNew && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(255,255,255,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100, padding: "0 16px 24px" }}>
          <div style={{ width: "100%", maxWidth: 400, background: "#1A1A1A", borderRadius: 24, padding: 24, border: "1px solid rgba(255,255,255,0.1)", animation: "slide-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span style={{ background: userCfg.color + "20", border: `1px solid ${userCfg.color}30`, borderRadius: 100, padding: "4px 12px", fontSize: 12, color: userCfg.color }}>{userCfg.label}</span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>· Toi</span>
            </div>
            <input placeholder="Titre de ta discussion" value={newTitle} onChange={e => setNewTitle(e.target.value)}
              style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#F0EDE8", fontSize: 15, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
            <textarea placeholder="Partage ton expérience, une question, un conseil..." value={newBody} onChange={e => setNewBody(e.target.value)} rows={4}
              style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#F0EDE8", fontSize: 14, outline: "none", marginBottom: 16, resize: "none", lineHeight: 1.5, boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowNew(false)} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, color: "rgba(255,255,255,0.5)", fontSize: 14, cursor: "pointer" }}>Annuler</button>
              <button onClick={postThread} style={{ flex: 1, padding: "14px", background: userCfg.color, border: "none", borderRadius: 100, color: "#0D0D0D", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Publier</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes slide-up { from { transform:translateY(40px); opacity:0; } to { transform:translateY(0); opacity:1; } }`}</style>
    </div>
  );
}