import React, { useState, useEffect, useCallback, useRef } from "react";
import { ImpulsScoreReveal, ShareCard, Community, launchConfetti as fireConfetti, getConfig } from "./ImpulsScore";

// ─── UTILS ───────────────────────────────────────────────────────────────────
function launchConfetti() {
  const colors = ["#9CAF88", "#7D9B6A", "#F0EDE8", "#ffffff", "#FFD700"];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement("div");
    el.className = "confetti-piece";
    el.style.left = Math.random() * 100 + "vw";
    el.style.top = "-10px";
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    el.style.width = (Math.random() * 8 + 4) + "px";
    el.style.height = (Math.random() * 8 + 4) + "px";
    el.style.animationDuration = (Math.random() * 2 + 2) + "s";
    el.style.animationDelay = Math.random() * 0.8 + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

// ─── BOTTOM NAV ──────────────────────────────────────────────────────────────
function BottomNav({ page, setPage }) {
  const tabs = [
    { id: "home", icon: "◈", label: "Accueil" },
    { id: "plan", icon: "◷", label: "Plan" },
    { id: "pause", icon: "⏸", label: "Pause" },
    { id: "streak", icon: "◆", label: "Streak" },
    { id: "goals", icon: "◎", label: "Objectifs" },
  ];
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430, background: 'rgba(13,13,13,0.95)',
      borderTop: '1px solid rgba(255,255,255,0.06)', zIndex: 50,
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ display: 'flex', padding: '8px 0 12px' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setPage(t.id)}
            className={`nav-tab ${page === t.id ? "active" : ""}`}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, background: 'none',
              border: 'none', cursor: 'pointer', padding: '4px 0'
            }}
          >
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontFamily: 'DM Sans', fontWeight: 500 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── LANDING ─────────────────────────────────────────────────────────────────
// ─── TESTIMONIALS DATA ───────────────────────────────────────────────────────
const testimonials = [
  { name: "Marie L.", age: 26, profile: "Le Spontané", color: "#9CAF88", text: "J'ai économisé 340€ en 2 mois. Le bouton pause m'a changé la vie.", score: 52 },
  { name: "Thomas B.", age: 31, profile: "L'Émotionnel", color: "#E8C4A0", text: "Voir mon score était un choc. 71/100. Ça m'a vraiment mis une claque.", score: 71 },
  { name: "Camille R.", age: 24, profile: "Le Spontané", color: "#9CAF88", text: "Je pensais pas avoir de problème. Le test m'a prouvé le contraire.", score: 48 },
  { name: "Lucas M.", age: 29, profile: "Le Réflexe", color: "#D4856A", text: "Score 84. J'ai pleuré. Puis j'ai changé. 3 semaines de streak maintenant.", score: 84 },
  { name: "Julie P.", age: 27, profile: "Le Réfléchi", color: "#B8D4C8", text: "14 jours sans achat impulsif. L'app m'a aidé à comprendre mes émotions.", score: 22 },
];

function TestimonialsCarousel() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % testimonials.length); setFade(true); }, 300);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const t = testimonials[idx];
  return (
    <div style={{
      opacity: fade ? 1 : 0, transition: "opacity 0.3s",
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 16, padding: "16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.color + "25", border: `1px solid ${t.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Bebas Neue", fontSize: 14, color: t.color }}>
          {t.name[0]}
        </div>
        <div>
          <span style={{ color: "#F0EDE8", fontSize: 13, fontWeight: 600 }}>{t.name}</span>
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>, {t.age} ans</span>
        </div>
        <div style={{ marginLeft: "auto", background: t.color + "20", borderRadius: 100, padding: "3px 10px" }}>
          <span style={{ fontFamily: "Bebas Neue", fontSize: 13, color: t.color, letterSpacing: 1 }}>{t.score}/100</span>
        </div>
      </div>
      <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>"{t.text}"</p>
      <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
        {testimonials.map((_, i) => (
          <div key={i} style={{ height: 2, flex: 1, borderRadius: 100, background: i === idx ? "#9CAF88" : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />
        ))}
      </div>
    </div>
  );
}

function Landing({ setPage }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      padding: "0 24px 40px", background: "#0D0D0D", position: "relative", overflow: "hidden"
    }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(156,175,136,0.1) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 56 }}>

        {/* Science badge */}
        <div className="fade-up-1" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 14px", borderRadius: 100, width: "fit-content", marginBottom: 20,
          background: "rgba(168,230,207,0.08)", border: "1px solid rgba(168,230,207,0.25)",
        }}>
          <span style={{ fontSize: 14 }}>🔬</span>
          <span style={{ fontSize: 11, color: "#B8D4C8", fontWeight: 500, lineHeight: 1.4 }}>
            Basé sur la Bergen Shopping Addiction Scale — Université de Bergen
          </span>
        </div>

        {/* Title */}
        <div className="fade-up-2">
          <h1 style={{ fontFamily: "Bebas Neue", fontSize: 86, lineHeight: 0.9, color: "#F0EDE8", margin: "0 0 4px", letterSpacing: 2 }}>
            IMPULS
          </h1>
          <h1 className="shimmer-text" style={{ fontFamily: "Bebas Neue", fontSize: 86, lineHeight: 0.9, margin: "0 0 20px", letterSpacing: 2 }}>
            STOP
          </h1>
        </div>

        <p className="fade-up-3" style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.6, marginBottom: 24, maxWidth: 300 }}>
          Reprends le contrôle de tes habitudes d'achat, en douceur. Un test de 2 minutes pour mieux te comprendre.
        </p>

        {/* Neuroscience callout */}
        <div className="fade-up-3" style={{
          background: "rgba(255,213,128,0.06)", border: "1px solid rgba(255,213,128,0.2)",
          borderRadius: 14, padding: "12px 16px", marginBottom: 24,
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🧠</span>
          <p style={{ color: "rgba(255,213,128,0.8)", fontSize: 12, lineHeight: 1.5, margin: 0 }}>
            <strong>Dr. Anna Lembke, Stanford :</strong> "Chaque notification de livraison active la même zone du cerveau que le sucre ou les jeux d'argent."
          </p>
        </div>

        {/* Stats */}
        <div className="fade-up-4" style={{ display: "flex", gap: 24, marginBottom: 24 }}>
          {[["1/3", "Français concernés"], ["23 537", "participants à l'étude"], ["4.8★", "note utilisateurs"]].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontFamily: "Bebas Neue", fontSize: 22, color: "#9CAF88", letterSpacing: 1 }}>{val}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2, lineHeight: 1.3 }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="fade-up-5">
          <button className="btn-primary" onClick={() => setPage("test")} style={{ width: "100%", padding: "18px 0", fontSize: 16, marginBottom: 10 }}>
            Découvrir mon profil →
          </button>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
            Gratuit · 2 minutes · Basé sur la Bergen Shopping Addiction Scale
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── TEST ─────────────────────────────────────────────────────────────────────
const questions = [
  { q: "T'arrive-t-il d'acheter quelque chose en ligne sans vraiment l'avoir cherché ?", opts: ["Jamais", "Parfois", "Souvent", "Tout le temps"] },
  { q: "Est-ce qu'une bonne affaire te donne envie d'acheter même si t'en avais pas besoin ?", opts: ["Jamais", "Parfois", "Souvent", "Tout le temps"] },
  { q: "T'as déjà fait du shopping pour te remonter le moral après une dure journée ?", opts: ["Jamais", "Parfois", "Souvent", "Tout le temps"] },
  { q: "Est-ce que l'attente d'une livraison te rend de bonne humeur ?", opts: ["Jamais", "Parfois", "Souvent", "Tout le temps"] },
  { q: "T'as des choses chez toi que tu n'as jamais ou presque jamais utilisées ?", opts: ["Jamais", "Parfois", "Souvent", "Tout le temps"] },
  { q: "Est-ce que tu scrolles sur des applis de shopping sans but précis ?", opts: ["Jamais", "Parfois", "Souvent", "Tout le temps"] },
  { q: "T'arrive-t-il de regretter un achat quelques jours après ?", opts: ["Jamais", "Parfois", "Souvent", "Tout le temps"] },
  { q: "Est-ce que les soldes ou promos te poussent à acheter plus que prévu ?", opts: ["Jamais", "Parfois", "Souvent", "Tout le temps"] },
  { q: "T'as déjà reçu un colis et eu du mal à te souvenir de ce que tu avais commandé ?", opts: ["Jamais", "Parfois", "Souvent", "Tout le temps"] },
  { q: "Est-ce qu'acheter te donne un sentiment de récompense ou de soulagement ?", opts: ["Jamais", "Parfois", "Souvent", "Tout le temps"] },
];

function Test({ setPage, setScore }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [leaving, setLeaving] = useState(false);

  const handleNext = () => {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    if (current + 1 >= questions.length) {
      const total = newAnswers.reduce((a, b) => a + b, 0);
      setScore(Math.round((total / (questions.length * 3)) * 100));
      setPage("results");
    } else {
      setLeaving(true);
      setTimeout(() => {
        setAnswers(newAnswers);
        setCurrent(current + 1);
        setSelected(null);
        setLeaving(false);
      }, 250);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', padding: '24px 24px 100px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{current + 1} / {questions.length}</span>
          <span style={{ color: '#9CAF88', fontSize: 13, fontWeight: 600 }}>{Math.round((current / questions.length) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(current / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div style={{
        flex: 1,
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'translateX(20px)' : 'translateX(0)',
        transition: 'all 0.25s ease'
      }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{
            fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 3,
            color: '#9CAF88', opacity: 0.7
          }}>QUESTION {current + 1}</span>
        </div>
        <h2 style={{
          fontSize: 22, fontWeight: 600, lineHeight: 1.4,
          color: '#F0EDE8', marginBottom: 32
        }}>
          {questions[current].q}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {questions[current].opts.map((opt, i) => (
            <div
              key={i}
              className={`option-card ${selected === i ? "selected" : ""}`}
              onClick={() => setSelected(i)}
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <span style={{ color: selected === i ? '#9CAF88' : 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: 400 }}>{opt}</span>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                border: `2px solid ${selected === i ? '#9CAF88' : 'rgba(255,255,255,0.15)'}`,
                background: selected === i ? '#9CAF88' : 'transparent',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {selected === i && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0D0D0D' }} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Button */}
      <div style={{ marginTop: 24 }}>
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={selected === null}
          style={{
            width: '100%', padding: '18px 0', fontSize: 16,
            opacity: selected !== null ? 1 : 0.3,
            cursor: selected !== null ? 'pointer' : 'not-allowed'
          }}
        >
          {current + 1 === questions.length ? "Voir mes résultats" : "Continuer →"}
        </button>
      </div>
    </div>
  );
}

// ─── RESULTS ──────────────────────────────────────────────────────────────────
const scoreProfiles = [
  { min: 0, max: 25, label: "LE RÉFLÉCHI", msg: "Tu achètes avec la tête. Quelques petites habitudes à peaufiner et tu es au top.", savings: 500, accent: "#B8D4C8" },
  { min: 26, max: 50, label: "LE SPONTANÉ", msg: "Tu te laisses parfois emporter par l'instant. C'est humain — les marques comptent là-dessus.", savings: 2160, accent: "#9CAF88" },
  { min: 51, max: 75, label: "L'ÉMOTIONNEL", msg: "Tes achats sont souvent liés à ce que tu ressens. Apprendre à les décoder change tout.", savings: 4800, accent: "#E8C4A0" },
  { min: 76, max: 100, label: "LE RÉFLEXE", msg: "Acheter est devenu automatique. La bonne nouvelle ? Ça se travaille, et t'es au bon endroit.", savings: 8400, accent: "#E09080" },
];

function Results({ score, setPage, onShare }) {
  const profile = scoreProfiles.find((p) => score >= p.min && score <= p.max);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => { setVisible(true); launchConfetti(); }, 300);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', padding: '40px 24px 100px' }}>
      <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Score circle */}
        <div className="fade-up-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
          <div style={{
            width: 140, height: 140, borderRadius: '50%',
            border: `3px solid ${profile.accent}30`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: `radial-gradient(circle, ${profile.accent}10 0%, transparent 70%)`,
            marginBottom: 16
          }}>
            <span style={{ fontFamily: 'Cormorant Garamond', fontWeight: 300, fontSize: 62, color: profile.accent, letterSpacing: 2, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>sur 100</span>
          </div>
          <span style={{
            fontFamily: 'Cormorant Garamond', fontSize: 32, fontWeight: 400, letterSpacing: 4,
            color: profile.accent
          }}>{profile.label}</span>
        </div>

        {/* Profile message */}
        <div className="fade-up-2 glass" style={{ borderRadius: 20, padding: '20px 22px' }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
            {profile.msg}
          </p>
        </div>

        {/* Savings card */}
        <div className="fade-up-3" style={{
          borderRadius: 20, padding: '24px 22px',
          background: `linear-gradient(135deg, ${profile.accent}15, ${profile.accent}05)`,
          border: `1px solid ${profile.accent}25`
        }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 6, letterSpacing: 1, textTransform: 'uppercase' }}>
            Dépenses impulsives estimées / an
          </p>
          <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 52, fontWeight: 500, color: profile.accent, letterSpacing: 2, margin: '0 0 8px' }}>
            {profile.savings.toLocaleString()}€
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontStyle: 'italic', margin: 0 }}>
            Et si tu réorientais cet argent vers ce qui compte vraiment ?
          </p>
        </div>

        {/* CTA */}
        <div className="fade-up-4">
          <button className="btn-primary" onClick={() => setPage("paywall")} style={{ width: '100%', padding: '18px 0', fontSize: 16, marginBottom: 10 }}>
            Voir mon plan personnalisé →
          </button>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 16 }}>
            Essai gratuit 7 jours · 3,99€/mois ensuite
          </p>
          <button onClick={onShare} style={{
            width: '100%', padding: '14px 0', borderRadius: 100, fontSize: 14,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#F0EDE8', fontFamily: 'DM Sans', fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
            🔗 Partager mon Impuls Score
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAYWALL ──────────────────────────────────────────────────────────────────
function Paywall({ setPage, setPremium }) {
  const features = [
    ["⏸", "Bouton Pause anti-achat impulsif"],
    ["◷", "Plan personnalisé 30 jours"],
    ["◆", "Streak & récompenses"],
    ["◎", "Objectifs d'épargne"],
    ["✦", "Check-in quotidien"],
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', padding: '48px 24px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

      {/* Glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(156,175,136,0.09) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="fade-up-1" style={{ textAlign: 'center', marginBottom: 28 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>Premium</p>
        <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 52, fontWeight: 400, color: '#F0EDE8', letterSpacing: 2, margin: '0 0 24px' }}>IMPULS<span style={{ color: '#9CAF88' }}>STOP</span></h2>

        {/* Pricing toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Monthly */}
          <div style={{
            border: '1.5px solid rgba(255,255,255,0.12)',
            borderRadius: 18, padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.04)'
          }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: '0 0 2px' }}>Mensuel</p>
              <p style={{ color: '#F0EDE8', fontSize: 13, margin: 0 }}>Sans engagement</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontFamily: 'Cormorant Garamond', fontWeight: 500, fontSize: 32, color: '#F0EDE8' }}>3,99€</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}> /mois</span>
            </div>
          </div>

          {/* Annual — highlighted */}
          <div style={{
            border: '1.5px solid #9CAF88',
            borderRadius: 18, padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(156,175,136,0.08)',
            position: 'relative', overflow: 'hidden'
          }}>
            {/* Best value badge */}
            <div style={{
              position: 'absolute', top: 0, right: 0,
              background: '#9CAF88', color: '#0D0D0D',
              fontSize: 10, fontWeight: 700, letterSpacing: 1,
              padding: '4px 12px', borderBottomLeftRadius: 10,
              textTransform: 'uppercase'
            }}>
              − 48%
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: '#9CAF88', fontSize: 12, fontWeight: 600, margin: '0 0 2px' }}>Annuel</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>Soit 2,08€/mois</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontFamily: 'Cormorant Garamond', fontWeight: 500, fontSize: 32, color: '#9CAF88' }}>24,99€</span>
              <span style={{ color: 'rgba(156,175,136,0.6)', fontSize: 13 }}> /an</span>
            </div>
          </div>

        </div>
      </div>

      <div className="fade-up-2 glass" style={{ borderRadius: 24, padding: '8px 4px', marginBottom: 24 }}>
        {features.map(([icon, label], i) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 20px',
            borderBottom: i < features.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
          }}>
            <span style={{ fontSize: 18, color: '#9CAF88', width: 24, textAlign: 'center' }}>{icon}</span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{label}</span>
            <span style={{ marginLeft: 'auto', color: '#9CAF88', fontSize: 14 }}>✓</span>
          </div>
        ))}
      </div>

      {/* Science trust badge */}
      <div className="fade-up-3" style={{
        background: 'rgba(156,175,136,0.06)',
        border: '1px solid rgba(156,175,136,0.18)',
        borderRadius: 16, padding: '14px 16px',
        marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start'
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>🔬</span>
        <div>
          <p style={{ color: '#9CAF88', fontSize: 12, fontWeight: 600, margin: '0 0 4px' }}>
            Approche basée sur des études cliniques
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.6, margin: 0 }}>
            Notre programme s'appuie sur la{' '}
            <a href="https://www.frontiersin.org/articles/10.3389/fpsyg.2015.01374/full"
              target="_blank" rel="noopener noreferrer"
              style={{ color: '#9CAF88', textDecoration: 'underline' }}>
              Bergen Shopping Addiction Scale
            </a>
            {' '}(Andreassen et al., 23 537 participants) et les travaux du{' '}
            <a href="https://www.annalembke.com" target="_blank" rel="noopener noreferrer"
              style={{ color: '#9CAF88', textDecoration: 'underline' }}>
              Dr. Anna Lembke
            </a>
            {' '}(Stanford) sur la régulation dopaminergique.
          </p>
        </div>
      </div>

      <div className="fade-up-4">
        <button
          className="btn-primary"
          onClick={() => { setPremium(true); setPage("pause"); }}
          style={{ width: '100%', padding: '18px 0', fontSize: 16, marginBottom: 12 }}
        >
          Commencer l'essai gratuit 7 jours
        </button>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
          Annulable à tout moment · Sans engagement
        </p>
      </div>
    </div>
  );
}

// ─── PAUSE ────────────────────────────────────────────────────────────────────
function Pause({ addSavings }) {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState("");
  const [timer, setTimer] = useState(86400);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    let interval;
    if (step === 4) interval = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (s) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const pauseQs = [
    { q: "Comment tu te sens en ce moment ?", opts: ["😊 Bien", "😰 Stressé(e)", "😢 Triste", "😑 Ennuyé(e)"] },
    { q: "T'en auras encore besoin dans 3 jours ?", opts: ["Oui, sûrement", "Probablement pas", "Je sais pas vraiment"] },
    { q: "C'est une envie ou un vrai besoin ?", opts: ["Une envie du moment", "Un vrai besoin", "Un peu des deux"] },
  ];

  if (step === 0) return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 80px', textAlign: 'center' }}>
      <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(156,175,136,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="fade-up-1" style={{ marginBottom: 12 }}>
        <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 4, color: '#9CAF88', opacity: 0.7 }}>ANTI-IMPULSION</span>
      </div>
      <h2 className="fade-up-2" style={{ fontSize: 24, fontWeight: 600, color: '#F0EDE8', marginBottom: 12, lineHeight: 1.3 }}>
        Tu as envie d'acheter quelque chose ?
      </h2>
      <p className="fade-up-3" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 52, maxWidth: 260 }}>
        Avant de cliquer "Acheter", appuie sur le bouton ci-dessous.
      </p>

      <button
        className="fade-up-4"
        onClick={() => { setPressed(true); setTimeout(() => { setStep(1); setPressed(false); }, 400); }}
        style={{
          width: 160, height: 160, borderRadius: '50%',
          background: pressed ? '#7D9B6A' : 'transparent',
          border: '2px solid rgba(156,175,136,0.4)',
          fontSize: 40, cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: pressed ? 'scale(0.92)' : 'scale(1)',
          boxShadow: '0 0 40px rgba(156,175,136,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        ⏸
      </button>
      <p className="fade-up-5" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, marginTop: 20 }}>Appuie pour lancer la pause</p>
    </div>
  );

  if (step >= 1 && step <= 3) {
    const q = pauseQs[step - 1];
    return (
      <div style={{ minHeight: '100vh', background: '#0D0D0D', padding: '40px 24px 100px', display: 'flex', flexDirection: 'column' }} className="fade-in">
        <div style={{ marginBottom: 32 }}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>
        <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 3, color: '#9CAF88', opacity: 0.7, marginBottom: 12, display: 'block' }}>
          QUESTION {step}/3
        </span>
        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#F0EDE8', marginBottom: 32, lineHeight: 1.4 }}>{q.q}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.opts.map((opt, i) => (
            <div key={i} className="option-card" onClick={() => setTimeout(() => setStep(step === 3 ? 4 : step + 1), 200)}
              style={{ padding: '16px 20px' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>{opt}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (step === 4) return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 80px', textAlign: 'center' }} className="fade-in">
      <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
      <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 4, color: '#9CAF88', opacity: 0.7, marginBottom: 12, display: 'block' }}>TIMER ACTIF</span>
      <h2 style={{ fontSize: 24, fontWeight: 600, color: '#F0EDE8', marginBottom: 8 }}>Attends 24 heures</h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 36, maxWidth: 260 }}>
        Si tu y penses encore, c'est peut-être un vrai besoin.
      </p>
      <div className="glass" style={{ borderRadius: 20, padding: '24px 40px', marginBottom: 32 }}>
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 52, fontWeight: 500, color: '#9CAF88', letterSpacing: 4 }}>{formatTime(timer)}</div>
      </div>
      <button onClick={() => setStep(5)} style={{ background: 'none', border: 'none', color: '#9CAF88', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>
        J'ai résisté ! Enregistrer mes économies
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 80px', textAlign: 'center' }} className="fade-in">
      <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
      <h2 style={{ fontSize: 24, fontWeight: 600, color: '#F0EDE8', marginBottom: 8 }}>Combien allais-tu dépenser ?</h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 28 }}>On va ajouter ça à tes économies.</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, width: '100%', maxWidth: 240 }}>
        <input type="number" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)}
          style={{
            flex: 1, padding: '16px 20px', background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16,
            color: '#F0EDE8', fontSize: 28, fontFamily: 'Bebas Neue', letterSpacing: 2,
            textAlign: 'center', outline: 'none', width: '100%'
          }} />
        <span style={{ color: '#9CAF88', fontSize: 24, fontFamily: 'Bebas Neue' }}>€</span>
      </div>
      <button className="btn-primary" onClick={() => { if (amount) { addSavings(parseFloat(amount)); launchConfetti(); setStep(0); setAmount(""); } }}
        style={{ width: '100%', maxWidth: 320, padding: '18px 0', fontSize: 15 }}>
        Ajouter à mes économies 🎉
      </button>
    </div>
  );
}

// ─── PLAN ─────────────────────────────────────────────────────────────────────
const planWeeks = [
  {
    label: "Semaine 1 — Observe", color: "#B8D4C8",
    expert: {
      name: "Cecilie Andreassen", title: "Professeure, Université de Bergen",
      quote: "La première étape pour changer un comportement est de l'observer sans jugement. Tenir un journal d'achats révèle des patterns invisibles.",
      link: "https://www.frontiersin.org/articles/10.3389/fpsyg.2015.01374/full",
      linkLabel: "Lire l'étude BSAS →"
    },
    days: ["Note le prochain achat que tu fais, même petit. Sans te juger.", "Compte combien de fois tu ouvres une app de shopping aujourd'hui.", "Regarde ton historique de commandes du mois dernier. Comment tu te sens ?", "Identifie un achat récent dont tu n'avais pas vraiment besoin.", "Note à quelle heure de la journée tu as le plus envie d'acheter.", "Fais une journée sans ouvrir aucune app de shopping.", "Bilan de semaine : qu'est-ce que tu as appris sur toi ?"]
  },
  {
    label: "Semaine 2 — Comprends", color: "#9CAF88",
    expert: {
      name: "Dr. Anna Lembke", title: "Psychiatre, Stanford University",
      quote: "Les achats compulsifs sont souvent une tentative de réguler des émotions difficiles — pas un manque de volonté. Comprendre le déclencheur émotionnel est la clé.",
      link: "https://www.annalembke.com",
      linkLabel: "Découvrir Dopamine Nation →"
    },
    days: ["La prochaine envie d'achat : note ce que tu ressentais juste avant.", "Est-ce que tu achètes plus quand tu t'ennuies ? Teste aujourd'hui.", "Remplace 1 session de shopping en ligne par une promenade de 10 min.", "Identifie ton site ou app de shopping préféré. Supprime-le pour 48h.", "Note 3 choses que tu possèdes déjà et que tu aimes vraiment.", "Avant chaque achat aujourd'hui, attends 30 minutes.", "Bilan : quel est ton principal déclencheur émotionnel ?"]
  },
  {
    label: "Semaine 3 — Remplace", color: "#E8C4A0",
    expert: {
      name: "Dr. BJ Fogg", title: "Chercheur en comportement, Stanford",
      quote: "Pour changer une habitude durablement, il faut la remplacer par un comportement plus simple qui procure la même satisfaction. Jamais supprimer sans substituer.",
      link: "https://www.tinyhabits.com",
      linkLabel: "Lire Tiny Habits →"
    },
    days: ["Trouve 1 activité gratuite qui te fait du bien autant qu'un achat.", "Crée une liste de souhaits. Tout ce que tu veux acheter va là d'abord.", "Quand une envie arrive, bois un verre d'eau et attends 10 min.", "Offre quelque chose que tu possèdes déjà à quelqu'un.", "Passe 1h sans téléphone. Note comment tu te sens après.", "Calcule ce que tu as économisé cette semaine. Visualise ce que ça représente.", "Bilan : quelle habitude de remplacement marche le mieux pour toi ?"]
  },
  {
    label: "Semaine 4 — Ancre", color: "#E09080",
    expert: {
      name: "Dr. Judson Brewer", title: "Neuroscientifique, Brown University",
      quote: "La curiosité est plus puissante que la volonté. Au lieu de résister à une envie, observez-la avec curiosité. Cette seule technique peut briser le cycle compulsif.",
      link: "https://www.drjud.com",
      linkLabel: "Explorer la méthode →"
    },
    days: ["Définis ton budget shopping mensuel idéal. Écris-le quelque part.", "Partage ton défi à quelqu'un de confiance. L'engagement social aide.", "Revois ta liste de souhaits. Supprime ce qui ne te parle plus.", "Fais 48h sans aucun achat non planifié.", "Note les 3 plus grands changements que tu as remarqués en toi.", "Célèbre : offre-toi quelque chose de petit mais intentionnel.", "Écris une lettre à toi-même sur ta relation avec l'argent.", "Partage un conseil avec quelqu'un qui en aurait besoin.", "🎉 Bilan final : tu as fait 30 jours. Comment tu te sens par rapport au jour 1 ?"]
  },
];

function Plan() {
  const [checked, setChecked] = useState({});
  const total = planWeeks.flatMap(w => w.days).length;
  const done = Object.values(checked).filter(Boolean).length;
  let idx = 0;

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', padding: '32px 20px 100px' }}>
      <div style={{ marginBottom: 24, padding: '0 4px' }}>
        <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 4, color: '#9CAF88', opacity: 0.7 }}>PROGRAMME</span>
        <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 40, fontWeight: 500, color: '#F0EDE8', letterSpacing: 2, margin: '4px 0 16px' }}>PLAN 30 JOURS</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{done} complétés</span>
          <span style={{ color: '#9CAF88', fontSize: 13, fontWeight: 600 }}>{Math.round((done / total) * 100)}%</span>
        </div>
        <div className="progress-bar" style={{ height: 4 }}>
          <div className="progress-fill" style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>

      {planWeeks.map((week, wi) => (
        <div key={wi} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '0 4px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: week.color }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: week.color, letterSpacing: 1, textTransform: 'uppercase' }}>{week.label}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Expert citation */}
          {week.expert && (
            <div style={{
              background: `${week.color}08`, border: `1px solid ${week.color}25`,
              borderRadius: 16, padding: '14px 16px', marginBottom: 12,
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>👨‍⚕️</span>
                <div>
                  <p style={{ color: week.color, fontSize: 12, fontWeight: 700, margin: '0 0 1px' }}>{week.expert.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, margin: 0 }}>{week.expert.title}</p>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.5, fontStyle: 'italic', margin: '0 0 10px' }}>
                "{week.expert.quote}"
              </p>
              <a href={week.expert.link} target="_blank" rel="noopener noreferrer" style={{
                color: week.color, fontSize: 12, textDecoration: 'none', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '5px 12px', borderRadius: 100,
                background: `${week.color}15`, border: `1px solid ${week.color}30`,
              }}>
                🔗 {week.expert.linkLabel}
              </a>
            </div>
          )}
            {week.days.map((day, di) => {
              const i = idx++;
              const isChecked = checked[i];
              return (
                <div key={i} onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
                  style={{
                    padding: '14px 16px', borderRadius: 16, cursor: 'pointer',
                    background: isChecked ? `${week.color}15` : 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${isChecked ? week.color + '40' : 'rgba(255,255,255,0.07)'}`,
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    transition: 'all 0.2s'
                  }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: isChecked ? week.color : 'transparent',
                    border: `2px solid ${isChecked ? week.color : 'rgba(255,255,255,0.2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10
                  }}>
                    {isChecked && "✓"}
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 3, display: 'block' }}>Jour {i + 1}</span>
                    <span style={{ fontSize: 14, color: isChecked ? week.color : 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{day}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── STREAK ───────────────────────────────────────────────────────────────────
const badges = [
  { emoji: "🥉", name: "Premier pas", days: 3 },
  { emoji: "🥈", name: "Une semaine warrior", days: 7 },
  { emoji: "🥇", name: "Deux semaines de contrôle", days: 14 },
  { emoji: "💎", name: "Le mois sans craquer", days: 30 },
  { emoji: "🏆", name: "ImpulsStop Master", days: 60 },
];

function Streak({ streak, setStreak, totalSaved, addSavings }) {
  const [popup, setPopup] = useState(null);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  const equiv = [
    { icon: "🍕", label: "pizzas", value: 10 },
    { icon: "✈️", label: "% Paris-Londres", value: 0.5 },
    { icon: "☕", label: "cafés", value: 3 },
  ];

  const confirm = () => {
    if (popup === "resisted") {
      setStreak(s => s + 1);
      if (amount) addSavings(parseFloat(amount));
      launchConfetti();
    } else {
      setStreak(0);
      setMsg("Pas grave. Demain est un nouveau jour. 💪");
      setTimeout(() => setMsg(""), 3000);
    }
    setPopup(null); setAmount("");
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', padding: '32px 20px 100px' }}>
      <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 4, color: '#9CAF88', opacity: 0.7 }}>PROGRESSION</span>
      <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 40, fontWeight: 500, color: '#F0EDE8', letterSpacing: 2, margin: '4px 0 20px' }}>MON STREAK</h2>

      {/* Streak hero */}
      <div className="glass" style={{ borderRadius: 24, padding: '28px 24px', textAlign: 'center', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at 50% 0%, rgba(156,175,136,0.08), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 48, marginBottom: 4 }}>🔥</div>
        <div style={{ fontFamily: 'Cormorant Garamond', fontWeight: 300, fontSize: 80, color: '#9CAF88', letterSpacing: 2, lineHeight: 1 }}>{streak}</div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: '4px 0 0' }}>jours sans achat impulsif</p>
      </div>

      {msg && <div className="scale-in" style={{ background: 'rgba(255,138,128,0.1)', border: '1px solid rgba(255,138,128,0.3)', borderRadius: 16, padding: '12px 16px', textAlign: 'center', marginBottom: 16 }}>
        <p style={{ color: '#E09080', fontSize: 14, margin: 0 }}>{msg}</p>
      </div>}

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button className="btn-primary" onClick={() => setPopup("resisted")} style={{ flex: 1, padding: '14px 0', fontSize: 14 }}>J'ai résisté ✅</button>
        <button className="btn-ghost" onClick={() => setPopup("cracked")} style={{ flex: 1, padding: '14px 0', fontSize: 14 }}>J'ai craqué 😔</button>
      </div>

      {/* Savings */}
      <div style={{ background: 'linear-gradient(135deg, rgba(156,175,136,0.12), rgba(156,175,136,0.05))', border: '1px solid rgba(156,175,136,0.2)', borderRadius: 20, padding: '20px', marginBottom: 20, textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Total économisé</p>
        <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 52, fontWeight: 500, color: '#9CAF88', letterSpacing: 2 }}>{totalSaved.toFixed(0)}€</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 12 }}>
          {equiv.map(e => (
            <div key={e.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18 }}>{e.icon}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{Math.floor(totalSaved / e.value)} {e.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, fontWeight: 500, color: '#F0EDE8', letterSpacing: 2, marginBottom: 12 }}>RÉCOMPENSES</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {badges.map(b => {
          const unlocked = streak >= b.days;
          const pct = Math.min(100, Math.round((streak / b.days) * 100));
          return (
            <div key={b.name} className={`badge-card ${unlocked ? "unlocked" : ""}`} style={{
              padding: '16px', borderRadius: 16,
              background: unlocked ? 'rgba(156,175,136,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${unlocked ? 'rgba(156,175,136,0.3)' : 'rgba(255,255,255,0.06)'}`,
              opacity: unlocked ? 1 : 0.5
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{unlocked ? b.emoji : "🔒"}</span>
                <div>
                  <p style={{ color: '#F0EDE8', fontSize: 14, fontWeight: 600, margin: 0 }}>{b.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '2px 0 0' }}>{b.days} jours · {pct}%</p>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: pct + "%" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Popup */}
      {popup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100, padding: '0 16px 24px' }}>
          <div className="scale-in glass" style={{ borderRadius: 24, padding: '24px', width: '100%', maxWidth: 400 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: 28, fontWeight: 400, color: '#F0EDE8', letterSpacing: 2, marginBottom: 16 }}>
              {popup === "resisted" ? "BIEN JOUÉ ! 💪" : "COMBIEN AS-TU DÉPENSÉ ?"}
            </h3>
            {popup === "resisted" && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 12 }}>Combien allais-tu dépenser ?</p>}
            <input type="number" placeholder="0€" value={amount} onChange={e => setAmount(e.target.value)}
              style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#F0EDE8', fontSize: 24, fontFamily: 'Bebas Neue', letterSpacing: 2, textAlign: 'center', outline: 'none', marginBottom: 12 }} />
            <button className="btn-primary" onClick={confirm} style={{ width: '100%', padding: '16px', fontSize: 15 }}>Confirmer</button>
            <button onClick={() => setPopup(null)} style={{ width: '100%', padding: '12px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 14, cursor: 'pointer', marginTop: 8 }}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GOALS ────────────────────────────────────────────────────────────────────
function Goals({ totalSaved, allocateSavings }) {
  const [goals, setGoals] = useState([
    { id: 1, name: "Voyage", emoji: "✈️", target: 500, saved: 0 },
    { id: 2, name: "Sneakers", emoji: "👟", target: 150, saved: 0 },
    { id: 3, name: "Console", emoji: "🎮", target: 300, saved: 0 },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState(""); const [target, setTarget] = useState(""); const [emoji, setEmoji] = useState("🎯");
  const emojis = ["✈️", "👟", "🎮", "🏠", "🎁", "🎓", "🚗", "💻", "🌴", "🎸"];

  const allocate = (id) => {
    if (totalSaved <= 0) return;
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const add = Math.min(totalSaved, g.target - g.saved);
      if (add > 0) { allocateSavings(add); const ns = g.saved + add; if (ns >= g.target) launchConfetti(); return { ...g, saved: ns }; }
      return g;
    }));
  };

  const addGoal = () => {
    if (!name || !target) return;
    setGoals(prev => [...prev, { id: Date.now(), name, emoji, target: parseFloat(target), saved: 0 }]);
    setName(""); setTarget(""); setEmoji("🎯"); setShowAdd(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', padding: '32px 20px 100px' }}>
      <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 4, color: '#9CAF88', opacity: 0.7 }}>ÉPARGNE</span>
      <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 40, fontWeight: 500, color: '#F0EDE8', letterSpacing: 2, margin: '4px 0 8px' }}>MES OBJECTIFS</h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 20 }}>Chaque achat évité te rapproche de ce qui compte vraiment</p>

      <div style={{ background: 'linear-gradient(135deg, rgba(156,175,136,0.12), rgba(156,175,136,0.05))', border: '1px solid rgba(156,175,136,0.2)', borderRadius: 20, padding: '16px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 2px' }}>Économies disponibles</p>
          <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 40, fontWeight: 500, color: '#9CAF88', letterSpacing: 2, margin: 0 }}>{totalSaved.toFixed(0)}€</p>
        </div>
        <span style={{ fontSize: 32 }}>💰</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        {goals.map(g => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
          const done = pct >= 100;
          return (
            <div key={g.id} style={{
              padding: '20px', borderRadius: 20,
              background: done ? 'rgba(156,175,136,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${done ? 'rgba(156,175,136,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 32 }}>{g.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#F0EDE8', fontSize: 16, fontWeight: 600, margin: 0 }}>{g.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: '2px 0 0' }}>{g.saved.toFixed(0)}€ / {g.target}€</p>
                </div>
                <span style={{ fontFamily: 'Cormorant Garamond', fontSize: 26, fontWeight: 500, color: done ? '#9CAF88' : 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>{pct}%</span>
              </div>
              <div className="progress-bar" style={{ height: 4, marginBottom: done ? 12 : 10 }}>
                <div className="progress-fill" style={{ width: pct + "%" }} />
              </div>
              {done
                ? <p style={{ textAlign: 'center', color: '#9CAF88', fontSize: 14, fontWeight: 600, margin: 0 }}>🎉 Objectif atteint ! Tu l'as mérité.</p>
                : <button onClick={() => allocate(g.id)} className="btn-ghost" style={{ width: '100%', padding: '10px', fontSize: 13 }}>Allouer mes économies ici →</button>
              }
            </div>
          );
        })}
      </div>

      <button onClick={() => setShowAdd(true)} style={{
        width: '100%', padding: '16px', borderRadius: 20,
        background: 'transparent', border: '1.5px dashed rgba(156,175,136,0.3)',
        color: '#9CAF88', fontSize: 15, fontWeight: 600, cursor: 'pointer'
      }}>+ Ajouter un objectif</button>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100, padding: '0 16px 24px' }}>
          <div className="scale-in" style={{ background: '#1A1A1A', borderRadius: 24, padding: '24px', width: '100%', maxWidth: 400, border: '1px solid rgba(255,255,255,0.1)' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: 28, fontWeight: 400, color: '#F0EDE8', letterSpacing: 2, marginBottom: 16 }}>NOUVEL OBJECTIF</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {emojis.map(e => <button key={e} onClick={() => setEmoji(e)} style={{ fontSize: 22, padding: '8px', borderRadius: 12, background: emoji === e ? 'rgba(156,175,136,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${emoji === e ? '#9CAF88' : 'transparent'}`, cursor: 'pointer' }}>{e}</button>)}
            </div>
            <input placeholder="Nom de l'objectif" value={name} onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#F0EDE8', fontSize: 15, outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
            <input type="number" placeholder="Montant cible (€)" value={target} onChange={e => setTarget(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#F0EDE8', fontSize: 15, outline: 'none', marginBottom: 16, boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAdd(false)} className="btn-ghost" style={{ flex: 1, padding: '14px' }}>Annuler</button>
              <button onClick={addGoal} className="btn-primary" style={{ flex: 1, padding: '14px', fontSize: 15 }}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile({ score, streak, totalSaved, setPremium, setPage }) {
  const { label, color, savings } = getConfig(score);
  const [notifs, setNotifs] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [plan, setPlan] = useState("annual"); // "monthly" | "annual"

  const level = streak < 7 ? { name: "Débutant", next: 7, icon: "🌱" }
    : streak < 30 ? { name: "Intermédiaire", next: 30, icon: "🌿" }
    : streak < 60 ? { name: "Avancé", next: 60, icon: "🌳" }
    : { name: "Maître", next: null, icon: "🏆" };

  const pct = level.next ? Math.round((streak / level.next) * 100) : 100;

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{
      width: 44, height: 24, borderRadius: 100, cursor: 'pointer',
      background: value ? color : 'rgba(255,255,255,0.12)',
      transition: 'background 0.3s', position: 'relative', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 3, left: value ? 23 : 3,
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }} />
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 10, paddingLeft: 4 }}>{title}</p>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );

  const Row = ({ icon, label, right, onClick, danger, last }) => (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '15px 18px',
      borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.05)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background 0.15s',
    }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ fontSize: 17, width: 22, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 14, color: danger ? '#E09080' : 'rgba(255,255,255,0.8)', fontWeight: 400 }}>{label}</span>
      {right && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{right}</span>}
      {onClick && !right && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 16 }}>›</span>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', padding: '32px 20px 100px', overflowY: 'auto' }}>

      {/* Header */}
      <div className="fade-up-1" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}30, ${color}10)`,
          border: `1.5px solid ${color}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>
          {level.icon}
        </div>
        <div>
          <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, fontWeight: 500, color: '#F0EDE8', margin: '0 0 2px' }}>Mon Profil</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: color, fontWeight: 600 }}>{label}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Niveau {level.name}</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 28 }}>
        {[
          { label: 'Impuls Score', value: score, unit: '/100', c: color },
          { label: 'Streak actuel', value: streak, unit: ' j', c: '#E8C4A0' },
          { label: 'Économisé', value: `${totalSaved.toFixed(0)}€`, unit: '', c: '#B8D4C8' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '14px 12px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 28, fontWeight: 400, color: s.c, margin: '0 0 3px', lineHeight: 1 }}>
              {s.value}<span style={{ fontSize: 13, opacity: 0.6 }}>{s.unit}</span>
            </p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Level progress */}
      <div className="fade-up-2" style={{ background: `${color}0D`, border: `1px solid ${color}25`, borderRadius: 18, padding: '16px 18px', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: color, fontWeight: 600 }}>{level.icon} Niveau {level.name}</span>
          {level.next
            ? <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{streak} / {level.next} jours</span>
            : <span style={{ fontSize: 12, color: color }}>Niveau max !</span>}
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: pct + '%', background: color, borderRadius: 100, transition: 'width 0.6s' }} />
        </div>
        {level.next && (
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>
            Encore {level.next - streak} jours pour atteindre le niveau suivant
          </p>
        )}
      </div>

      {/* Subscription */}
      <div className="fade-up-3">
        <Section title="Abonnement">
          <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div>
                <p style={{ color: '#F0EDE8', fontSize: 14, fontWeight: 500, margin: '0 0 2px' }}>
                  ImpulsStop Premium
                </p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>
                  {plan === 'annual' ? 'Annuel · 24,99€/an' : 'Mensuel · 3,99€/mois'}
                </p>
              </div>
              <span style={{ background: color + '20', border: `1px solid ${color}40`, borderRadius: 100, padding: '4px 10px', fontSize: 11, color: color, fontWeight: 600 }}>Actif</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setPlan('monthly')} style={{
                flex: 1, padding: '8px', borderRadius: 10, border: `1px solid ${plan === 'monthly' ? color : 'rgba(255,255,255,0.1)'}`,
                background: plan === 'monthly' ? color + '15' : 'transparent',
                color: plan === 'monthly' ? color : 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer'
              }}>Mensuel</button>
              <button onClick={() => setPlan('annual')} style={{
                flex: 1, padding: '8px', borderRadius: 10, border: `1px solid ${plan === 'annual' ? color : 'rgba(255,255,255,0.1)'}`,
                background: plan === 'annual' ? color + '15' : 'transparent',
                color: plan === 'annual' ? color : 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer'
              }}>Annuel −48%</button>
            </div>
          </div>
          <Row icon="📄" label="Historique de facturation" onClick={() => {}} last={false} />
          <Row icon="🔴" label="Annuler l'abonnement" onClick={() => setShowCancel(true)} danger last />
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 17, width: 22, textAlign: 'center' }}>🔔</span>
            <span style={{ flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Notifications push</span>
            <Toggle value={notifs} onChange={setNotifs} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px' }}>
            <span style={{ fontSize: 17, width: 22, textAlign: 'center' }}>⏰</span>
            <span style={{ flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>Rappels quotidiens</span>
            <Toggle value={reminders} onChange={setReminders} />
          </div>
        </Section>

        {/* App info */}
        <Section title="Application">
          <Row icon="🔁" label="Refaire le test" onClick={() => setPage('test')} />
          <Row icon="🌿" label="À propos d'ImpulsStop" onClick={() => {}} />
          <Row icon="🔒" label="Politique de confidentialité" onClick={() => {}} />
          <Row icon="⭐" label="Noter l'application" onClick={() => {}} last />
        </Section>

        {/* Logout */}
        <Section title="Compte">
          <Row icon="🚪" label="Se déconnecter" onClick={() => setShowLogout(true)} danger last />
        </Section>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.15)', fontSize: 11, marginTop: 8 }}>
          ImpulsStop v3.0 · Fait avec 🌿 pour reprendre le contrôle
        </p>
      </div>

      {/* Logout confirm */}
      {showLogout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100, padding: '0 16px 32px' }}>
          <div className="scale-in" style={{ width: '100%', maxWidth: 400, background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 24 }}>
            <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, fontWeight: 400, color: '#F0EDE8', marginBottom: 8 }}>Se déconnecter ?</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Tes données locales seront conservées. Tu pourras te reconnecter à tout moment.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowLogout(false)} className="btn-ghost" style={{ flex: 1, padding: '14px' }}>Annuler</button>
              <button onClick={() => { setPremium(false); setPage('home'); setShowLogout(false); }} style={{ flex: 1, padding: '14px', background: '#E09080', border: 'none', borderRadius: 100, color: 'white', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>Déconnecter</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirm */}
      {showCancel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100, padding: '0 16px 32px' }}>
          <div className="scale-in" style={{ width: '100%', maxWidth: 400, background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 24 }}>
            <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, fontWeight: 400, color: '#F0EDE8', marginBottom: 8 }}>Annuler l'abonnement ?</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>Tu perdras l'accès à toutes les fonctionnalités Premium à la fin de ta période en cours.</p>
            <div style={{ background: 'rgba(156,175,136,0.08)', border: '1px solid rgba(156,175,136,0.2)', borderRadius: 14, padding: '12px 16px', marginBottom: 20 }}>
              <p style={{ color: '#9CAF88', fontSize: 13, margin: 0, lineHeight: 1.5 }}>💡 Tu peux mettre en pause ton abonnement au lieu de l'annuler.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowCancel(false)} className="btn-ghost" style={{ flex: 1, padding: '14px' }}>Garder Premium</button>
              <button onClick={() => setShowCancel(false)} style={{ flex: 1, padding: '14px', background: 'rgba(224,144,128,0.15)', border: '1px solid rgba(224,144,128,0.3)', borderRadius: 100, color: '#E09080', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── UPDATED BOTTOM NAV ──────────────────────────────────────────────────────
function BottomNavV2({ page, setPage }) {
  const tabs = [
    { id: "home",      icon: "◈",  label: "Accueil" },
    { id: "plan",      icon: "◷",  label: "Plan" },
    { id: "pause",     icon: "⏸",  label: "Pause" },
    { id: "streak",    icon: "◆",  label: "Streak" },
    { id: "community", icon: "⬡",  label: "Communauté" },
    { id: "profile",   icon: "◉",  label: "Profil" },
  ];
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430, background: 'rgba(13,13,13,0.97)',
      borderTop: '1px solid rgba(255,255,255,0.06)', zIndex: 50,
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ display: 'flex', padding: '8px 0 12px' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setPage(t.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
              color: page === t.id ? '#9CAF88' : 'rgba(255,255,255,0.25)',
              transition: 'color 0.2s'
            }}>
            <span style={{ fontSize: t.id === "community" ? 14 : 16 }}>{t.icon}</span>
            <span style={{ fontSize: 9, fontFamily: 'DM Sans', fontWeight: 500 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [score, setScore] = useState(0);
  const [premium, setPremium] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [pendingScore, setPendingScore] = useState(0);

  const addSavings = useCallback((a) => setTotalSaved(t => t + a), []);
  const allocateSavings = useCallback((a) => setTotalSaved(t => Math.max(0, t - a)), []);
  const showNav = premium && ["home","plan","pause","streak","goals","community","profile"].includes(page);

  const handleScoreSet = (s) => {
    setPendingScore(s);
    setScore(s);
    setShowReveal(true);
  };

  if (showReveal && !showConsent) return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: '#0D0D0D', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(156,175,136,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', textAlign: 'center' }}>
        <div className="fade-up-1" style={{ marginBottom: 40 }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(156,175,136,0.08)', border: '1px solid rgba(156,175,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto', animation: 'orb-breathe 4s ease-in-out infinite' }}>
            ◎
          </div>
        </div>
        <div className="fade-up-2" style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 4, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 20 }}>Analyse terminée</p>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 44, fontWeight: 300, fontStyle: 'italic', color: '#F0EDE8', lineHeight: 1.2, marginBottom: 20 }}>
            Ton Impuls Score<br/>est prêt
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, lineHeight: 1.8, maxWidth: 260, margin: '0 auto' }}>
            Ce score n'est pas un jugement.<br/>C'est un point de départ pour mieux te comprendre.
          </p>
        </div>
        <div className="fade-up-3" style={{ width: '100%' }}>
          <button onClick={() => setShowConsent(true)} style={{ width: '100%', padding: '20px 0', background: '#9CAF88', border: 'none', borderRadius: 100, cursor: 'pointer', fontFamily: 'Cormorant Garamond', fontWeight: 600, fontSize: 22, color: '#0D0D0D', letterSpacing: 1, transition: 'all 0.3s', boxShadow: '0 0 40px rgba(156,175,136,0.2)' }}>
            Découvrir mon Impuls Score
          </button>
        </div>
      </div>
      <style>{`@keyframes orb-breathe { 0%,100%{transform:scale(1);opacity:0.6;} 50%{transform:scale(1.08);opacity:1;} }`}</style>
    </div>
  );

  if (showReveal && showConsent) return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: '#0D0D0D' }}>
      <ImpulsScoreReveal score={pendingScore} onDone={() => { setShowReveal(false); setShowConsent(false); setPage("results"); }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', minHeight: '100vh', background: '#0D0D0D', position: 'relative', overflow: 'hidden' }}>
      {page === "home" && !premium && <Landing setPage={setPage} />}
      {page === "test" && <Test setPage={setPage} setScore={handleScoreSet} />}
      {page === "results" && (
        <>
          <Results score={score} setPage={setPage} onShare={() => setShowShare(true)} />
          {showShare && <ShareCard score={score} onClose={() => setShowShare(false)} />}
        </>
      )}
      {page === "paywall" && <Paywall setPage={setPage} setPremium={setPremium} />}
      {page === "home" && premium && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 100px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 58, fontWeight: 400, color: '#F0EDE8', letterSpacing: 2 }}>IMPULS<span style={{ color: '#9CAF88' }}>STOP</span></div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 8 }}>Utilise la navigation en bas</p>
          <div style={{ marginTop: 32, background: 'rgba(156,175,136,0.1)', border: '1px solid rgba(156,175,136,0.2)', borderRadius: 20, padding: '16px 20px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 4px' }}>Ton Impuls Score</p>
            <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 52, fontWeight: 500, color: '#9CAF88', letterSpacing: 2, margin: 0 }}>{score}</p>
            <button onClick={() => setShowShare(true)} style={{ marginTop: 10, background: 'none', border: '1px solid rgba(156,175,136,0.3)', borderRadius: 100, padding: '8px 20px', color: '#9CAF88', fontSize: 13, cursor: 'pointer' }}>
              Partager mon score →
            </button>
          </div>
        </div>
      )}
      {page === "plan" && premium && <Plan />}
      {page === "pause" && premium && <Pause addSavings={addSavings} />}
      {page === "streak" && premium && <Streak streak={streak} setStreak={setStreak} totalSaved={totalSaved} addSavings={addSavings} />}
      {page === "goals" && premium && <Goals totalSaved={totalSaved} allocateSavings={allocateSavings} />}
      {page === "community" && premium && <Community userScore={score} />}
      {page === "profile" && premium && <Profile score={score} streak={streak} totalSaved={totalSaved} setPremium={setPremium} setPage={setPage} />}
      {showNav && <BottomNavV2 page={page} setPage={setPage} />}
      {showShare && page !== "results" && <ShareCard score={score} onClose={() => setShowShare(false)} />}
    </div>
  );
}

// Patched by update — replace export default App above with the one below
