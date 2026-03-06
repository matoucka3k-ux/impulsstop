import React, { useState, useEffect, useCallback, useRef } from "react";
import { ImpulsScoreReveal, ShareCard, Community, launchConfetti as fireConfetti, getConfig } from "./ImpulsScore";
import { supabase } from "./supabase";

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
    setTimeout(() => { setVisible(true); }, 300);
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
            Essai gratuit 7 jours · 1,99€/mois ensuite
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
              <span style={{ fontFamily: 'Cormorant Garamond', fontWeight: 500, fontSize: 32, color: '#F0EDE8' }}>1,99€</span>
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
              − 33%
            </div>
            <div style={{ textAlign: 'left' }}>
              <p style={{ color: '#9CAF88', fontSize: 12, fontWeight: 600, margin: '0 0 2px' }}>Annuel</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, margin: 0 }}>Soit 1,33€/mois</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontFamily: 'Cormorant Garamond', fontWeight: 500, fontSize: 32, color: '#9CAF88' }}>15,99€</span>
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
  const [answers, setAnswers] = useState({});
  const [amount, setAmount] = useState("");
  const [pressed, setPressed] = useState(false);
  const [outcome, setOutcome] = useState(null); // "resist" | "confirm" | "savings"
  const [confirmStep, setConfirmStep] = useState(0);

  // Logique intelligente basée sur les réponses
  const analyzeAnswers = (newAnswers) => {
    const emotion = newAnswers.emotion;   // 0=Bien, 1=Stressé, 2=Triste, 3=Ennuyé
    const need3d  = newAnswers.need3d;    // 0=Oui sûrement, 1=Probablement pas, 2=Je sais pas
    const impulse = newAnswers.impulse;   // 0=Envie moment, 1=Vrai besoin, 2=Un peu des deux

    // Si état émotionnel négatif + pas besoin dans 3j + envie du moment → clairement impulsif
    if (emotion >= 1 && need3d >= 1 && impulse === 0) return "resist_clear";
    // Si état négatif + incertain → probablement impulsif
    if (emotion >= 1 && (need3d >= 1 || impulse === 0)) return "resist_likely";
    // Si vrai besoin affirmé → continuer à questionner
    if (impulse === 1 && need3d === 0) return "confirm";
    // Sinon doute → questionner encore
    return "confirm";
  };

  const emotionLabels = ["😊 Tu te sens bien", "😰 Tu es stressé(e)", "😢 Tu es triste", "😑 Tu t'ennuies"];
  const emotionInsights = [
    "Bonne nouvelle, tu es dans un état calme. Mais réfléchis quand même — est-ce vraiment nécessaire ?",
    "Le stress pousse souvent à acheter pour se soulager. C'est une réponse automatique du cerveau, pas un vrai besoin.",
    "La tristesse crée une envie de récompense immédiate. Mais l'effet ne dure que quelques minutes — puis le vide revient.",
    "L'ennui est le déclencheur n°1 des achats impulsifs. Ton cerveau cherche de la stimulation, pas cet article.",
  ];

  // Questions de confirmation supplémentaires (si vrai besoin)
  const confirmQuestions = [
    { q: "Tu possèdes déjà quelque chose de similaire ?", opts: ["Non, rien de tel", "Oui, mais moins bien", "Oui, presque pareil"] },
    { q: "Tu avais prévu cet achat avant aujourd'hui ?", opts: ["Oui, ça fait un moment", "Non, c'est spontané", "Vaguement prévu"] },
    { q: "Quel impact sur ton budget ce mois-ci ?", opts: ["Aucun, j'ai prévu", "Ça se remarquera un peu", "Ça va me serrer"] },
    { q: "Si tu attends encore 48h, tu regretteras de ne pas l'avoir acheté ?", opts: ["Oui, vraiment", "Probablement pas", "Je sais pas"] },
    { q: "Est-ce que ça répond à un besoin précis dans ta vie ?", opts: ["Oui, besoin concret", "C'est plutôt une envie", "Les deux un peu"] },
  ];

  const computeConfirmScore = (cAnswers) => {
    let score = 0;
    // Q1: pas de similaire = +2, moins bien = +1, pareil = 0
    if (cAnswers[0] === 0) score += 2; else if (cAnswers[0] === 1) score += 1;
    // Q2: prévu depuis longtemps = +2, vaguement = +1, spontané = 0
    if (cAnswers[1] === 0) score += 2; else if (cAnswers[1] === 2) score += 1;
    // Q3: aucun impact = +2, un peu = +1, serrer = 0
    if (cAnswers[2] === 0) score += 2; else if (cAnswers[2] === 1) score += 1;
    // Q4: oui regret = +2, probablement pas = 0, sais pas = +1
    if (cAnswers[3] === 0) score += 2; else if (cAnswers[3] === 2) score += 1;
    // Q5: besoin concret = +2, les deux = +1, envie = 0
    if (cAnswers[4] === 0) score += 2; else if (cAnswers[4] === 2) score += 1;
    return score; // max 10
  };

  const Wrapper = ({ children }) => (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "40px 24px 100px", display: "flex", flexDirection: "column" }} className="fade-in">
      {children}
    </div>
  );

  const Header = ({ current, total, label }) => (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontFamily: "DM Sans", fontSize: 11, letterSpacing: 3, color: "#9CAF88", opacity: 0.7, textTransform: "uppercase" }}>{label}</span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{current}/{total}</span>
      </div>
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${(current/total)*100}%` }} /></div>
    </div>
  );

  // ── Écran d'accueil
  if (step === 0) return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px 80px", textAlign: "center" }}>
      <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(156,175,136,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div className="fade-up-1" style={{ marginBottom: 12 }}>
        <span style={{ fontFamily: "DM Sans", fontSize: 11, letterSpacing: 4, color: "#9CAF88", opacity: 0.7 }}>ANTI-IMPULSION</span>
      </div>
      <h2 className="fade-up-2" style={{ fontFamily: "Cormorant Garamond", fontSize: 34, fontWeight: 300, fontStyle: "italic", color: "#F0EDE8", marginBottom: 12, lineHeight: 1.3 }}>
        Tu as envie d'acheter quelque chose ?
      </h2>
      <p className="fade-up-3" style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 52, maxWidth: 260, lineHeight: 1.7 }}>
        Prends 2 minutes avant d'acheter. Ton futur toi te remerciera.
      </p>
      <button className="fade-up-4" onClick={() => { setPressed(true); setTimeout(() => { setStep(1); setPressed(false); }, 400); }} style={{ width: 160, height: 160, borderRadius: "50%", background: pressed ? "#7D9B6A" : "transparent", border: "2px solid rgba(156,175,136,0.4)", fontSize: 40, cursor: "pointer", transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)", transform: pressed ? "scale(0.92)" : "scale(1)", boxShadow: "0 0 40px rgba(156,175,136,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        ⏸
      </button>
      <p className="fade-up-5" style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginTop: 20 }}>Appuie pour lancer la pause</p>
    </div>
  );

  // ── Q1 : Émotion
  if (step === 1) return (
    <Wrapper>
      <Header current={1} total={3} label="Pause intelligente" />
      <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 28, fontWeight: 400, color: "#F0EDE8", marginBottom: 8, lineHeight: 1.3 }}>Comment tu te sens en ce moment ?</h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>Sois honnête avec toi-même. Personne ne voit ta réponse.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {["😊  Je me sens bien", "😰  Je suis stressé(e)", "😢  Je suis triste", "😑  Je m'ennuie"].map((opt, i) => (
          <div key={i} className="option-card" onClick={() => { setAnswers(a => ({ ...a, emotion: i })); setTimeout(() => setStep(2), 250); }} style={{ padding: "16px 20px" }}>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 15 }}>{opt}</span>
          </div>
        ))}
      </div>
    </Wrapper>
  );

  // ── Q2 : Besoin dans 3 jours
  if (step === 2) return (
    <Wrapper>
      <Header current={2} total={3} label="Pause intelligente" />
      <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 28, fontWeight: 400, color: "#F0EDE8", marginBottom: 8, lineHeight: 1.3 }}>T'en auras encore besoin dans 3 jours ?</h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>Ferme les yeux et imagine ta vie dans 72 heures.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {["✅  Oui, sûrement", "❌  Probablement pas", "🤔  Je sais pas vraiment"].map((opt, i) => (
          <div key={i} className="option-card" onClick={() => { setAnswers(a => ({ ...a, need3d: i })); setTimeout(() => setStep(3), 250); }} style={{ padding: "16px 20px" }}>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 15 }}>{opt}</span>
          </div>
        ))}
      </div>
    </Wrapper>
  );

  // ── Q3 : Envie ou besoin
  if (step === 3) return (
    <Wrapper>
      <Header current={3} total={3} label="Pause intelligente" />
      <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 28, fontWeight: 400, color: "#F0EDE8", marginBottom: 8, lineHeight: 1.3 }}>C'est une envie ou un vrai besoin ?</h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>Sois honnête — il n'y a pas de mauvaise réponse.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {["💫  Une envie du moment", "🎯  Un vrai besoin", "🌗  Un peu des deux"].map((opt, i) => (
          <div key={i} className="option-card" onClick={() => {
            const newAnswers = { ...answers, impulse: i };
            setAnswers(newAnswers);
            const result = analyzeAnswers(newAnswers);
            setTimeout(() => {
              if (result === "resist_clear" || result === "resist_likely") {
                setOutcome(result); setStep("resist");
              } else {
                setOutcome("confirm"); setStep("confirm"); setConfirmStep(0);
              }
            }, 250);
          }} style={{ padding: "16px 20px" }}>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 15 }}>{opt}</span>
          </div>
        ))}
      </div>
    </Wrapper>
  );

  // ── Résultat : RÉSISTE — achat impulsif détecté
  if (step === "resist") {
    const emotionIdx = answers.emotion || 0;
    const isClear = outcome === "resist_clear";
    return (
      <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "48px 24px 100px", display: "flex", flexDirection: "column" }} className="fade-in">
        <div style={{ flex: 1 }}>
          {/* Résultat visuel */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(156,175,136,0.1)", border: "1px solid rgba(156,175,136,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 20px", animation: "breathe 3s ease-in-out infinite" }}>
              🌿
            </div>
            <p style={{ fontFamily: "DM Sans", fontSize: 11, letterSpacing: 3, color: "#9CAF88", textTransform: "uppercase", marginBottom: 12 }}>
              {isClear ? "Pulsion détectée" : "Signal d'alerte"}
            </p>
            <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 34, fontWeight: 300, fontStyle: "italic", color: "#F0EDE8", lineHeight: 1.3, marginBottom: 0 }}>
              {isClear ? "C'est une pulsion, pas un besoin." : "Ton cerveau te joue un tour."}
            </h2>
          </div>

          {/* Explication de la pulsion */}
          <div style={{ background: "rgba(156,175,136,0.06)", border: "1px solid rgba(156,175,136,0.18)", borderRadius: 20, padding: "20px", marginBottom: 16 }}>
            <p style={{ color: "#9CAF88", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 10px" }}>
              Ce qui se passe en toi
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
              {emotionInsights[emotionIdx]}
            </p>
          </div>

          {/* Ce que tu ressens vraiment */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "20px", marginBottom: 16 }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 10px" }}>
              Ce que tu ressens vraiment
            </p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
              {answers.emotion === 0 && "Même quand on se sent bien, l'habitude d'acheter peut prendre le dessus. Remarque cette envie sans agir dessus — c'est déjà une victoire."}
              {answers.emotion === 1 && "Quand on est stressé, le cerveau cherche une récompense rapide. L'achat donne une illusion de contrôle. Mais dans 30 minutes, le stress sera toujours là."}
              {answers.emotion === 2 && "La tristesse crée un vide que l'on essaie de remplir. C'est humain. Mais cet article ne pourra pas combler ce que tu ressens vraiment."}
              {answers.emotion === 3 && "L'ennui est le plus grand déclencheur d'achats impulsifs. Ton cerveau a juste besoin de stimulation — pas forcément de cet article."}
            </p>
          </div>

          {/* Citation science */}
          <div style={{ background: "rgba(184,212,200,0.06)", border: "1px solid rgba(184,212,200,0.15)", borderRadius: 16, padding: "14px 16px", marginBottom: 28 }}>
            <p style={{ color: "rgba(184,212,200,0.8)", fontSize: 12, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
              🧠 "Attendre crée un espace entre l'envie et l'action. Dans cet espace réside ta liberté." — Dr. Judson Brewer, Brown University
            </p>
          </div>
        </div>

        {/* Actions */}
        <button onClick={() => { setOutcome("savings"); setStep("savings"); }} className="btn-primary" style={{ width: "100%", padding: "18px 0", fontSize: 16, marginBottom: 10 }}>
          J'ai résisté ! Enregistrer mes économies 💰
        </button>
        <button onClick={() => setStep(0)} style={{ width: "100%", padding: "14px", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, color: "rgba(255,255,255,0.4)", fontSize: 14, cursor: "pointer" }}>
          Recommencer
        </button>
        <style>{`@keyframes breathe { 0%,100%{transform:scale(1);opacity:0.7;} 50%{transform:scale(1.06);opacity:1;} }`}</style>
      </div>
    );
  }

  // ── Flow de confirmation : questions approfondies
  if (step === "confirm") {
    const cAnswers = answers.confirmAnswers || {};
    const totalAnswered = Object.keys(cAnswers).length;

    // Si toutes les questions répondues → calculer score
    if (totalAnswered >= confirmQuestions.length) {
      const score = computeConfirmScore(Object.values(cAnswers));
      // Score >= 7 sur 10 → achat validé
      if (score >= 7) return (
        <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "48px 24px 100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }} className="fade-in">
          <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
          <p style={{ fontFamily: "DM Sans", fontSize: 11, letterSpacing: 3, color: "#9CAF88", textTransform: "uppercase", marginBottom: 16 }}>Achat validé</p>
          <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 32, fontWeight: 300, color: "#F0EDE8", lineHeight: 1.3, marginBottom: 16 }}>
            C'est un vrai besoin.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.8, maxWidth: 280, marginBottom: 32 }}>
            Tu as pris le temps de réfléchir — c'est exactement ce que ImpulsStop t'encourage à faire. Cet achat est conscient et réfléchi. 🌿
          </p>
          <button onClick={() => setStep(0)} className="btn-primary" style={{ width: "100%", maxWidth: 320, padding: "18px 0", fontSize: 16 }}>
            Retour à l'accueil
          </button>
        </div>
      );

      // Score < 7 → orienter vers résistance
      return (
        <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "48px 24px 100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }} className="fade-in">
          <div style={{ fontSize: 56, marginBottom: 20 }}>🤔</div>
          <p style={{ fontFamily: "DM Sans", fontSize: 11, letterSpacing: 3, color: "#E8C4A0", textTransform: "uppercase", marginBottom: 16 }}>Résultat mitigé</p>
          <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 32, fontWeight: 300, color: "#F0EDE8", lineHeight: 1.3, marginBottom: 16 }}>
            Quelques doutes subsistent.
          </h2>
          <div style={{ background: "rgba(232,196,160,0.08)", border: "1px solid rgba(232,196,160,0.2)", borderRadius: 20, padding: "20px", marginBottom: 28, textAlign: "left" }}>
            <p style={{ color: "rgba(232,196,160,0.8)", fontSize: 13, lineHeight: 1.8, margin: 0 }}>
              Tes réponses montrent que ce n'est pas tout à fait un besoin évident. Donne-toi encore 48h. Si dans 2 jours l'envie est toujours là et aussi forte, ce sera peut-être un vrai besoin.
            </p>
          </div>
          <button onClick={() => { setOutcome("savings"); setStep("savings"); }} className="btn-primary" style={{ width: "100%", maxWidth: 320, padding: "18px 0", fontSize: 16, marginBottom: 10 }}>
            J'attends — noter mes économies potentielles 💰
          </button>
          <button onClick={() => setStep(0)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 14, cursor: "pointer" }}>Retour</button>
        </div>
      );
    }

    // Afficher la question de confirmation courante
    const q = confirmQuestions[totalAnswered];
    return (
      <Wrapper>
        <Header current={totalAnswered + 1} total={confirmQuestions.length} label="Vérification approfondie" />
        <div style={{ background: "rgba(156,175,136,0.06)", border: "1px solid rgba(156,175,136,0.15)", borderRadius: 14, padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10 }}>
          <span>🎯</span>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
            Tu penses que c'est un vrai besoin — prenons le temps de vérifier ensemble.
          </p>
        </div>
        <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 28, fontWeight: 400, color: "#F0EDE8", marginBottom: 28, lineHeight: 1.4 }}>{q.q}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.opts.map((opt, i) => (
            <div key={i} className="option-card" onClick={() => {
              const newCAnswers = { ...cAnswers, [totalAnswered]: i };
              setAnswers(a => ({ ...a, confirmAnswers: newCAnswers }));
            }} style={{ padding: "16px 20px" }}>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 15 }}>{opt}</span>
            </div>
          ))}
        </div>
      </Wrapper>
    );
  }

  // ── Écran économies
  if (step === "savings") return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px 100px", textAlign: "center" }} className="fade-in">
      <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
      <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 30, fontWeight: 300, color: "#F0EDE8", marginBottom: 8 }}>Combien allais-tu dépenser ?</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>On ajoute ça à ton total d'économies.</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, width: "100%", maxWidth: 200 }}>
        <input type="number" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)}
          style={{ flex: 1, padding: "16px 20px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, color: "#F0EDE8", fontSize: 32, fontFamily: "Cormorant Garamond", textAlign: "center", outline: "none", width: "100%" }} />
        <span style={{ color: "#9CAF88", fontSize: 28, fontFamily: "Cormorant Garamond" }}>€</span>
      </div>
      <button className="btn-primary" onClick={() => { if (amount) { addSavings(parseFloat(amount)); launchConfetti(); setStep(0); setAnswers({}); setAmount(""); } }}
        style={{ width: "100%", maxWidth: 320, padding: "18px 0", fontSize: 15 }}>
        Ajouter à mes économies 🎉
      </button>
      <button onClick={() => { setStep(0); setAnswers({}); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer", marginTop: 12 }}>
        Passer
      </button>
    </div>
  );

  return null;
}

// ─── PLAN ─────────────────────────────────────────────────────────────────────

const weekQuizzes = [
  {
    week: 1,
    theme: "Observer sans se juger",
    intro: "Ce quiz t'aide à cartographier tes patterns d'achat. Il n'y a pas de bonne ou mauvaise réponse — seulement ce qui est vrai pour toi.",
    color: "#B8D4C8",
    questions: [
      {
        q: "Quand tu ressens une forte envie d'acheter quelque chose, qu'est-ce qui se passe dans ton corps ?",
        opts: ["Mon cœur s'accélère, je suis excité(e)", "Je me sens agité(e), presque anxieux(se)", "Une sorte de vide que je veux remplir", "Je ne remarque rien de particulier"],
        insight: ["L'excitation avant l'achat est une réponse dopaminergique. C'est ton cerveau en mode récompense.", "Cette agitation est un signal d'anxiété. L'achat devient une tentative de la calmer.", "Ce vide est souvent émotionnel. L'achat y répond temporairement, mais ne le comble pas.", "L'automaticité de ta pulsion indique qu'elle est bien ancrée — ce n'est pas un défaut, c'est une habitude à observer."]
      },
      {
        q: "À quel moment de la journée tu te retrouves le plus souvent à faire des achats non prévus ?",
        opts: ["Le soir après le travail / les cours", "Quand je m'ennuie (n'importe quand)", "Quand je suis triste ou stressé(e)", "Le week-end, sans raison particulière"],
        insight: ["Le soir, le cortex préfrontal — zone de la décision rationnelle — est fatigué. Tu résistes moins bien.", "L'ennui crée un manque de stimulation que le shopping comble facilement. C'est le déclencheur le plus courant.", "L'achat comme régulation émotionnelle. Ton cerveau a appris que ça soulage — temporairement.", "Le week-end libère les contraintes habituelles. Sans structure, les impulsions prennent plus de place."]
      },
      {
        q: "Si tu regardes tes 5 derniers achats non essentiels, comment te sentais-tu dans les heures qui ont précédé ?",
        opts: ["Je ne m'en souviens pas vraiment", "Plutôt bien, c'était juste envie", "J'avais vécu quelque chose de difficile", "J'étais en pause, sans rien à faire"],
        insight: ["Ne pas se souvenir est un signe que l'achat est devenu automatique — un pilote automatique émotionnel.", "Acheter quand on se sent bien est moins problématique, mais peut devenir une célébration compulsive.", "C'est le pattern le plus courant. La difficulté émotionnelle cherche une sortie — l'achat en est une.", "L'état de repos sans stimulation déclenche une recherche de dopamine. Le shopping est accessible et immédiat."]
      },
      {
        q: "Combien d'objets achètes-tu en moyenne par mois dont tu ne te sers plus après 2 semaines ?",
        opts: ["1 à 2 maximum", "3 à 5 probablement", "Plus de 5, je préfère ne pas compter", "Je n'achète que des choses durables"],
        insight: ["C'est un niveau sain. Tes achats ont généralement une utilité réelle.", "Environ la moitié de tes achats répondent à une envie plutôt qu'un besoin. Le programme va t'aider à voir lesquels.", "Cette accumulation signale une déconnexion entre l'envie d'acheter et le besoin réel. C'est fréquent, et ça se travaille.", "Excellent. Soit tu es déjà très conscient(e), soit cette période du programme va révéler des patterns cachés."]
      },
    ]
  },
  {
    week: 2,
    theme: "Comprendre tes déclencheurs",
    intro: "Derrière chaque pulsion d'achat, il y a une émotion ou un besoin non exprimé. Ce quiz t'aide à identifier lesquels.",
    color: "#9CAF88",
    questions: [
      {
        q: "Quand tu résistes à un achat impulsif, quelle est ta réaction émotionnelle habituelle ?",
        opts: ["Un sentiment de privation, presque de frustration", "Une légère anxiété, comme si je ratais quelque chose", "Une fierté rapide, puis j'oublie", "Rien de particulier — c'est facile"],
        insight: ["La sensation de privation révèle que l'achat est lié à un besoin de récompense fort. Ce n'est pas de la faiblesse — c'est de la neurologie.", "Cette anxiété de 'rater' (FOMO) est alimentée par les algorithmes. Tu ressens exactement ce qu'ils ont conçu pour que tu ressentes.", "La fierté fugace montre que tu as la capacité — mais pas encore l'ancrage. Le programme va construire ça.", "Tu as peut-être une relation saine à l'achat, ou tes vraies tentations ne sont pas encore survenues cette semaine."]
      },
      {
        q: "Est-ce que tu as déjà utilisé le shopping pour éviter de faire quelque chose d'important ?",
        opts: ["Oui, régulièrement — c'est une forme de procrastination", "Parfois, sans m'en rendre compte sur le moment", "Rarement, mais ça m'est arrivé", "Non, je ne fais pas ce lien"],
        insight: ["Le shopping comme évitement est une forme de procrastination hédonique. Tu échanges une anxiété difficile contre un plaisir facile.", "L'inconscience de l'évitement est la forme la plus courante. La prise de conscience que tu viens d'avoir est déjà une avancée.", "Même rare, ce pattern mérite attention. Il peut s'intensifier dans les périodes de pression.", "Observer cette semaine si ce lien émerge. Parfois il se cache sous des formes anodines."]
      },
      {
        q: "Comment tu te sens généralement juste après avoir reçu un colis que tu attendais ?",
        opts: ["Déçu(e) — l'objet est moins bien que prévu", "Satisfait(e) un moment, puis ça passe vite", "Coupable — pourquoi ai-je encore acheté ça ?", "Vraiment heureux(se), l'objet répond à un besoin"],
        insight: ["La déception post-achat est liée à l'écart entre le fantasme de possession et la réalité. C'est la chute dopaminergique.", "Cette satisfaction brève est typique. Le pic de dopamine était dans l'attente, pas dans la possession.", "La culpabilité post-achat crée un cycle négatif. Elle peut elle-même déclencher de nouveaux achats pour s'en distraire.", "C'est le signe d'un achat conscient. Retiens ce sentiment — c'est la référence vers laquelle tendre."]
      },
      {
        q: "Est-ce que tu as déjà caché des achats à quelqu'un de proche, ou minimisé leur coût ?",
        opts: ["Oui, souvent — je préfère ne pas expliquer", "Une ou deux fois, dans des moments de tension", "Jamais, je suis transparent(e)", "Je vis seul(e) / ça ne s'applique pas"],
        insight: ["Cacher ses achats est un signal fort. Il indique une dissonance entre ce que tu veux faire et ce que tu penses que tu devrais faire.", "Même occasionnel, ce pattern mérite d'être noté. Il signale une honte ou une tension autour de l'argent.", "C'est une force. La transparence réduit le pouvoir des comportements compulsifs.", "Dans ce cas, observe si tu te juges toi-même après certains achats — c'est une forme intérieure du même mécanisme."]
      },
    ]
  },
  {
    week: 3,
    theme: "Reconstruire tes automatismes",
    intro: "Tu as observé. Tu as compris. Maintenant, on travaille sur le remplacement. Ce quiz évalue où tu en es dans ce processus.",
    color: "#E8C4A0",
    questions: [
      {
        q: "Cette semaine, as-tu trouvé une activité qui t'a procuré une satisfaction comparable à un achat ?",
        opts: ["Oui — et c'était plus durable", "Un peu, mais moins intense", "Non, rien ne remplace vraiment ce sentiment", "Je n'ai pas vraiment cherché"],
        insight: ["Excellent. Cela prouve que la dopamine peut être obtenue autrement. Garde cette activité en mémoire comme 'ancre'.", "La moindre intensité est normale au début. Les voies neuronales alternatives mettent du temps à se renforcer.", "Cette résistance est réelle et valide. Certains déclencheurs sont puissants. Continue à explorer — la bonne alternative existe.", "Le chercher activement est la prochaine étape. Pas de pression — même une petite expérimentation compte."]
      },
      {
        q: "Quand une envie d'achat arrive, tu arrives maintenant à faire quoi ?",
        opts: ["L'observer sans agir pendant quelques minutes", "La noter quelque part et y revenir plus tard", "Appeler ou écrire à quelqu'un", "Je cède encore souvent — c'est difficile"],
        insight: ["Observer sans agir est la technique centrale du Dr. Judson Brewer. Tu as développé une capacité réelle.", "Externaliser l'envie (liste de souhaits, note) est une stratégie cognitive puissante. Elle crée une distance.", "Le soutien social est l'un des facteurs les plus efficaces dans le changement d'habitude. C'est une vraie force.", "La difficulté à résister à ce stade est normale — c'est pourquoi cette semaine existe. Tu n'es pas en échec."]
      },
      {
        q: "Comment décrirais-tu ta relation avec l'argent en ce moment ?",
        opts: ["Tendue — j'ai du mal à épargner malgré moi", "Floue — je ne sais pas vraiment où va mon argent", "En amélioration — je commence à voir plus clair", "Saine — l'argent est un outil, pas une émotion"],
        insight: ["Cette tension est souvent liée à une relation émotionnelle à l'argent héritée. Le programme travaille précisément sur ça.", "Le flou financier protège parfois d'une vérité inconfortable. Poser des chiffres concrets est un acte courageux.", "C'est exactement la trajectoire attendue à la semaine 3. Continue — la clarté se renforce.", "Cette sérénité est l'objectif final. Tu es peut-être déjà en train de consolider ce que d'autres mettent des années à construire."]
      },
      {
        q: "Est-ce que tu t'es surpris(e) à résister à une envie que tu n'aurais pas questionnée avant ?",
        opts: ["Oui — plusieurs fois cette semaine", "Une fois, et c'était inattendu", "Non, mes schémas semblent les mêmes", "Oui, mais j'ai quand même acheté après réflexion"],
        insight: ["Plusieurs résistances spontanées : tes nouvelles habitudes neurologiques commencent à s'installer. C'est un signal fort.", "Même une fois, c'est une rupture dans le pilote automatique. Ce moment mérite d'être célébré.", "Ne pas encore observer de changement ne signifie pas l'absence de progrès. Les semaines 1 et 2 plantent des graines invisibles.", "Acheter après réflexion consciente n'est pas un échec — c'est exactement le but. Tu as repris le contrôle du processus."]
      },
    ]
  },
  {
    week: 4,
    theme: "Ancrer et comprendre le fond",
    intro: "La dernière semaine va plus loin. On explore l'origine de ta relation à la consommation — souvent construite bien avant tes premiers achats.",
    color: "#E09080",
    questions: [
      {
        q: "Dans ton enfance / adolescence, le shopping ou l'argent avait quelle place ?",
        opts: ["On avait peu — j'ai grandi dans la restriction", "On achetait beaucoup — c'était une forme d'amour", "L'argent créait des tensions familiales", "Équilibré — ni sujet tabou, ni obsession"],
        insight: ["La restriction dans l'enfance peut créer un rapport compensatoire à l'achat à l'âge adulte — 'maintenant je peux, alors j'achète'.", "Quand l'achat était une expression d'amour, on peut y chercher inconsciemment ce sentiment à l'âge adulte.", "Les tensions autour de l'argent dans l'enfance laissent souvent une charge émotionnelle — anxiété, impulsivité ou évitement.", "Un contexte sain est une base solide. Ton travail ici est peut-être plus de maintenir que de reconstruire."]
      },
      {
        q: "Qu'est-ce que posséder de nouvelles choses signifie pour toi, au fond ?",
        opts: ["Une forme de sécurité — avoir = être préparé", "Une expression de qui je suis / veux être", "Un soulagement temporaire d'une tension intérieure", "Simplement de la praticité — j'achète ce dont j'ai besoin"],
        insight: ["Acheter comme sécurité est lié à l'anxiété. Les objets donnent une illusion de contrôle sur l'avenir.", "L'identité par les objets est puissamment cultivée par le marketing. Questionner ce lien est un acte de liberté.", "Tu as identifié le mécanisme central. Ce soulagement est réel mais bref — et la tension revient, souvent plus forte.", "C'est la relation la plus fonctionnelle à la consommation. Conserve-la en la conscientisant davantage."]
      },
      {
        q: "Si tu n'achetais plus rien de non-essentiel pendant 6 mois, quelle serait ta peur principale ?",
        opts: ["M'ennuyer profondément — le shopping occupe du temps", "Passer à côté de quelque chose d'important", "Ne plus me sentir 'moi' — une partie de mon identité", "Rien de particulier — ce serait libérateur"],
        insight: ["Si le shopping occupe une place centrale dans ton temps libre, il remplace quelque chose. Quoi exactement ? C'est la question clé.", "La FOMO profonde révèle une anxiété existentielle. L'achat simule la participation à quelque chose de plus grand.", "Quand la consommation fait partie de l'identité, s'en défaire ressemble à une perte de soi. C'est un travail identitaire profond.", "Cette liberté perçue est la preuve que tu as intégré les fondamentaux. Tu n'es pas défini(e) par ce que tu possèdes."]
      },
      {
        q: "Après ces 30 jours, quelle phrase décrit le mieux ton évolution ?",
        opts: ["Je comprends maintenant pourquoi j'achetais — mais je lutte encore", "Je contrôle mieux mais j'ai encore des moments de faiblesse", "Ma relation à la consommation a fondamentalement changé", "Je suis au même point — le programme n'a pas eu d'impact"],
        insight: ["Comprendre sans encore changer complètement est exactement là où tu devrais être à 30 jours. La conscience précède le changement.", "Les 'moments de faiblesse' ne sont pas des échecs — ils sont des données. Continue à les observer sans te juger.", "Un changement fondamental en 30 jours est rare et réel. Tu as fait un travail sérieux sur toi-même.", "Si le programme n'a pas eu d'impact, quelque chose a peut-être bloqué. Recommencer depuis le début, ou consulter un professionnel, peut être la prochaine étape."]
      },
    ]
  },
];

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

function WeekQuiz({ quiz, onDone }) {
  const [qIdx, setQIdx]         = useState(0);
  const [answers, setAnswers]   = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);

  const current = quiz.questions[qIdx];
  const total   = quiz.questions.length;

  const choose = (i) => {
    setSelected(i);
    setTimeout(() => {
      const newAnswers = [...answers, i];
      if (qIdx + 1 < total) {
        setAnswers(newAnswers);
        setQIdx(qIdx + 1);
        setSelected(null);
      } else {
        setAnswers(newAnswers);
        setShowResult(true);
      }
    }, 350);
  };

  if (showResult) {
    return (
      <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "40px 24px 100px", overflowY: "auto" }} className="fade-in">
        {/* Header résultat */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${quiz.color}15`, border: `1px solid ${quiz.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🧠</div>
          <p style={{ fontFamily: "DM Sans", fontSize: 11, letterSpacing: 3, color: quiz.color, textTransform: "uppercase", margin: "0 0 10px" }}>Analyse · Semaine {quiz.week}</p>
          <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 30, fontWeight: 300, fontStyle: "italic", color: "#F0EDE8", lineHeight: 1.3, margin: "0 0 8px" }}>
            Voilà ce que tes réponses révèlent
          </h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.6 }}>
            Lis chaque insight lentement. Prends le temps d'y réfléchir.
          </p>
        </div>

        {/* Insights personnalisés */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
          {answers.map((ans, i) => {
            const q = quiz.questions[i];
            return (
              <div key={i} style={{ background: `${quiz.color}08`, border: `1px solid ${quiz.color}20`, borderRadius: 20, padding: "18px 20px" }}>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 6px" }}>Question {i + 1}</p>
                <p style={{ color: quiz.color, fontSize: 13, fontWeight: 500, margin: "0 0 10px", fontStyle: "italic" }}>"{q.opts[ans]}"</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.8, margin: 0 }}>{q.insight[ans]}</p>
              </div>
            );
          })}
        </div>

        {/* Conseil de la semaine */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "20px", marginBottom: 24 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>Conseil pour cette semaine</p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.8, margin: 0, fontStyle: "italic" }}>
            {quiz.week === 1 && "Tiens un carnet (papier ou notes téléphone) où tu notes chaque envie d'achat avec l'émotion du moment. Sans agir dessus. Juste observer."}
            {quiz.week === 2 && "Identifie ton déclencheur principal à partir de tes réponses. Cette semaine, chaque fois qu'il se présente, nomme-le à voix haute ou dans ta tête : 'Tiens, mon déclencheur.'"}
            {quiz.week === 3 && "Choisis UNE alternative concrète à ton comportement d'achat. Pas plusieurs — une seule. Et engage-toi à l'essayer à chaque envie cette semaine."}
            {quiz.week === 4 && "Relis tes notes des 3 premières semaines. Écris en 5 lignes : qui étais-tu avant, qui es-tu maintenant par rapport à tes achats. Cette lettre est pour toi seul(e)."}
          </p>
        </div>

        <button onClick={onDone} className="btn-primary" style={{ width: "100%", padding: "18px 0", fontSize: 16 }}>
          Commencer les défis de la semaine →
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "40px 24px 100px", display: "flex", flexDirection: "column" }} className="fade-in">
      {/* Progress */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontFamily: "DM Sans", fontSize: 11, letterSpacing: 3, color: quiz.color, textTransform: "uppercase" }}>Quiz · Semaine {quiz.week}</span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{qIdx + 1} / {total}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${((qIdx) / total) * 100}%`, background: quiz.color }} />
        </div>
      </div>

      {/* Thème */}
      <div style={{ background: `${quiz.color}08`, border: `1px solid ${quiz.color}20`, borderRadius: 14, padding: "10px 14px", marginBottom: 28, display: "flex", gap: 8 }}>
        <span>🧠</span>
        <p style={{ color: quiz.color, fontSize: 12, margin: 0, lineHeight: 1.5 }}>
          <strong>{quiz.theme}</strong><br/>
          <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>{quiz.intro}</span>
        </p>
      </div>

      {/* Question */}
      <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 400, color: "#F0EDE8", lineHeight: 1.5, marginBottom: 28, flex: 1 }}>
        {current.q}
      </h2>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {current.opts.map((opt, i) => (
          <div key={i}
            onClick={() => selected === null && choose(i)}
            style={{
              padding: "16px 20px", borderRadius: 16, cursor: selected !== null ? "default" : "pointer",
              background: selected === i ? `${quiz.color}20` : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${selected === i ? quiz.color : "rgba(255,255,255,0.08)"}`,
              display: "flex", alignItems: "center", gap: 12,
              transition: "all 0.2s", transform: selected === i ? "scale(0.99)" : "scale(1)",
            }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: selected === i ? quiz.color : "transparent", border: `2px solid ${selected === i ? quiz.color : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#0D0D0D", fontWeight: 700 }}>
              {selected === i ? "✓" : ""}
            </div>
            <span style={{ fontSize: 14, color: selected === i ? quiz.color : "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{opt}</span>
          </div>
        ))}
      </div>

      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, textAlign: "center", marginTop: 20 }}>
        Réponds honnêtement — personne ne voit tes réponses
      </p>
    </div>
  );
}

function Plan() {
  const [checked, setChecked]       = useState({});
  const [quizDone, setQuizDone]     = useState({});   // { 0: true, 1: true, ... }
  const [activeQuiz, setActiveQuiz] = useState(null); // week index 0-3

  const total = planWeeks.flatMap(w => w.days).length;
  const done  = Object.values(checked).filter(Boolean).length;
  let idx = 0;

  if (activeQuiz !== null) {
    return (
      <WeekQuiz
        quiz={weekQuizzes[activeQuiz]}
        onDone={() => { setQuizDone(q => ({ ...q, [activeQuiz]: true })); setActiveQuiz(null); }}
      />
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "32px 20px 100px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24, padding: "0 4px" }}>
        <span style={{ fontFamily: "DM Sans", fontSize: 11, letterSpacing: 4, color: "#9CAF88", opacity: 0.7 }}>PROGRAMME</span>
        <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 38, fontWeight: 400, fontStyle: "italic", color: "#F0EDE8", margin: "4px 0 16px" }}>Plan 30 jours</h2>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{done} défis complétés</span>
          <span style={{ color: "#9CAF88", fontSize: 13, fontWeight: 600 }}>{Math.round((done / total) * 100)}%</span>
        </div>
        <div className="progress-bar" style={{ height: 4 }}>
          <div className="progress-fill" style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>

      {planWeeks.map((week, wi) => {
        const quiz      = weekQuizzes[wi];
        const isDone    = quizDone[wi];
        const weekColor = week.color;
        return (
          <div key={wi} style={{ marginBottom: 32 }}>
            {/* Titre semaine */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "0 4px" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: weekColor }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: weekColor, letterSpacing: 1, textTransform: "uppercase" }}>{week.label}</span>
            </div>

            {/* Quiz card — toujours en premier */}
            <div style={{
              background: isDone ? `${weekColor}08` : "rgba(255,255,255,0.04)",
              border: `1.5px solid ${isDone ? weekColor + "35" : weekColor + "30"}`,
              borderRadius: 20, padding: "18px 20px", marginBottom: 14,
              cursor: "pointer", transition: "all 0.2s",
            }} onClick={() => setActiveQuiz(wi)}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${weekColor}15`, border: `1px solid ${weekColor}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {isDone ? "✅" : "🧠"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <p style={{ color: "#F0EDE8", fontSize: 15, fontWeight: 500, margin: 0 }}>Quiz de la semaine</p>
                    {!isDone && <span style={{ background: weekColor + "25", borderRadius: 100, padding: "2px 8px", fontSize: 10, color: weekColor, fontWeight: 700 }}>NOUVEAU</span>}
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0 }}>
                    {isDone ? `Terminé · ${quiz.theme}` : quiz.theme}
                  </p>
                </div>
                <span style={{ color: isDone ? weekColor : "rgba(255,255,255,0.3)", fontSize: 20 }}>{isDone ? "✓" : "›"}</span>
              </div>
              {!isDone && (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, margin: "12px 0 0", lineHeight: 1.5, paddingLeft: 58 }}>
                  4 questions · Analyse psychologique personnalisée
                </p>
              )}
            </div>

            {/* Citation expert */}
            {week.expert && (
              <div style={{ background: `${weekColor}06`, border: `1px solid ${weekColor}20`, borderRadius: 16, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>👨‍⚕️</span>
                  <div>
                    <p style={{ color: weekColor, fontSize: 12, fontWeight: 700, margin: "0 0 1px" }}>{week.expert.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: 0 }}>{week.expert.title}</p>
                  </div>
                </div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6, fontStyle: "italic", margin: "0 0 10px" }}>"{week.expert.quote}"</p>
                <a href={week.expert.link} target="_blank" rel="noopener noreferrer" style={{ color: weekColor, fontSize: 12, textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 100, background: `${weekColor}12`, border: `1px solid ${weekColor}25` }}>
                  🔗 {week.expert.linkLabel}
                </a>
              </div>
            )}

            {/* Défis quotidiens */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {week.days.map((day, di) => {
                const i = idx++;
                const isChecked = checked[i];
                return (
                  <div key={i} onClick={() => setChecked(c => ({ ...c, [i]: !c[i] }))}
                    style={{ padding: "14px 16px", borderRadius: 16, cursor: "pointer", background: isChecked ? `${weekColor}12` : "rgba(255,255,255,0.03)", border: `1.5px solid ${isChecked ? weekColor + "35" : "rgba(255,255,255,0.06)"}`, display: "flex", gap: 12, alignItems: "flex-start", transition: "all 0.2s" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, marginTop: 1, background: isChecked ? weekColor : "transparent", border: `2px solid ${isChecked ? weekColor : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#0D0D0D", fontWeight: 700 }}>
                      {isChecked && "✓"}
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 3, display: "block" }}>Jour {i + 1}</span>
                      <span style={{ fontSize: 14, color: isChecked ? weekColor : "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{day}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
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

// ─── GOALS MINI (used in Streak) ─────────────────────────────────────────────
function GoalsMini({ totalSaved }) {
  const [goals, setGoals] = useState([]);
  const [showAdd, setShowAdd]     = useState(false);
  const [showAlloc, setShowAlloc] = useState(null);
  const [allocAmount, setAllocAmount] = useState("");
  const [name, setName]   = useState("");
  const [target, setTarget] = useState("");
  const [emoji, setEmoji]   = useState("🎯");
  const emojis = ["✈️","👟","🎮","🏠","🎁","🎓","🚗","💻","🌴","🎸","🏦","💍"];

  const totalAllocated = goals.reduce((s, g) => s + g.saved, 0);
  const available = Math.max(0, totalSaved - totalAllocated);

  const allocate = (id, amount) => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || amt > available) return;
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const add = Math.min(amt, g.target - g.saved);
      return { ...g, saved: g.saved + add };
    }));
    setAllocAmount(""); setShowAlloc(null);
  };

  const addGoal = () => {
    if (!name || !target) return;
    const colors = ["#B8D4C8","#E8C4A0","#9CAF88","#D4856A","#B8A8D4"];
    setGoals(prev => [...prev, { id: Date.now(), name, emoji, target: parseFloat(target), saved: 0, color: colors[prev.length % colors.length] }]);
    setName(""); setTarget(""); setEmoji("🎯"); setShowAdd(false);
  };

  return (
    <div>
      {/* Disponible */}
      <div style={{ background: 'rgba(156,175,136,0.06)', border: '1px solid rgba(156,175,136,0.15)', borderRadius: 16, padding: '12px 16px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Disponible à allouer</span>
        <span style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, fontWeight: 400, color: '#9CAF88' }}>{available.toFixed(0)}€</span>
      </div>

      {/* Liste compacte */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {goals.map(g => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
          const done = pct >= 100;
          const isOpen = showAlloc === g.id;
          return (
            <div key={g.id} style={{ borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: `1.5px solid ${isOpen ? g.color + "50" : done ? g.color + "30" : "rgba(255,255,255,0.07)"}`, overflow: 'hidden', transition: 'all 0.2s' }}>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{g.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#F0EDE8', fontSize: 14, fontWeight: 500, margin: '0 0 1px' }}>{g.name}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: 0 }}>{g.saved.toFixed(0)}€ / {g.target}€</p>
                  </div>
                  <span style={{ fontFamily: 'Cormorant Garamond', fontSize: 20, color: g.color }}>{pct}%</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', background: g.color, borderRadius: 100, transition: 'width 0.5s' }} />
                </div>
              </div>

              {!done && (
                <div style={{ borderTop: `1px solid ${isOpen ? g.color + "20" : "rgba(255,255,255,0.05)"}` }}>
                  {!isOpen ? (
                    <button onClick={() => { setShowAlloc(g.id); setAllocAmount(""); }}
                      disabled={available <= 0}
                      style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', color: available > 0 ? g.color : 'rgba(255,255,255,0.15)', fontSize: 12, fontWeight: 600, cursor: available > 0 ? 'pointer' : 'not-allowed' }}>
                      {available > 0 ? '＋ Allouer des économies' : 'Aucune économie disponible'}
                    </button>
                  ) : (
                    <div style={{ padding: '12px 14px', background: `${g.color}06` }}>
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: '0 0 8px' }}>
                        Dispo : <span style={{ color: g.color, fontWeight: 600 }}>{available.toFixed(0)}€</span>
                      </p>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                        {[10, 25, 50, Math.min(available, g.target - g.saved)].filter((v, i, arr) => arr.indexOf(v) === i && v > 0).map(v => (
                          <button key={v} onClick={() => setAllocAmount(String(v))}
                            style={{ flex: 1, padding: '7px 4px', borderRadius: 10, border: `1px solid ${allocAmount === String(v) ? g.color : "rgba(255,255,255,0.1)"}`, background: allocAmount === String(v) ? `${g.color}20` : 'rgba(255,255,255,0.04)', color: allocAmount === String(v) ? g.color : 'rgba(255,255,255,0.4)', fontSize: 11, cursor: 'pointer' }}>
                            {v === Math.min(available, g.target - g.saved) && v !== 10 && v !== 25 && v !== 50 ? "Tout" : `${v}€`}
                          </button>
                        ))}
                        <input type="number" placeholder="€" value={allocAmount} onChange={e => setAllocAmount(e.target.value)}
                          style={{ flex: 1, padding: '7px 4px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#F0EDE8', fontSize: 11, outline: 'none', textAlign: 'center', boxSizing: 'border-box', minWidth: 0 }} />
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => { setShowAlloc(null); setAllocAmount(""); }}
                          style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, color: 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer' }}>Annuler</button>
                        <button onClick={() => allocate(g.id, allocAmount)}
                          style={{ flex: 2, padding: '8px', background: allocAmount && parseFloat(allocAmount) > 0 ? g.color : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 100, color: allocAmount ? '#0D0D0D' : 'rgba(255,255,255,0.2)', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                          Confirmer {allocAmount ? `${allocAmount}€` : ""}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {done && <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}><span style={{ color: g.color, fontSize: 12, fontWeight: 600 }}>🎉 Atteint !</span></div>}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {goals.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 16px', background: 'rgba(255,255,255,0.03)', border: '1.5px dashed rgba(156,175,136,0.2)', borderRadius: 16, marginBottom: 10 }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🎯</div>
          <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 20, fontWeight: 400, fontStyle: 'italic', color: '#F0EDE8', margin: '0 0 6px' }}>Aucun objectif pour l'instant</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, lineHeight: 1.6, margin: '0 0 16px' }}>Crée ton premier objectif et alloue tes économies vers ce qui compte vraiment pour toi.</p>
          <button onClick={() => setShowAdd(true)} style={{ padding: '12px 24px', background: '#9CAF88', border: 'none', borderRadius: 100, color: '#0D0D0D', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            + Créer mon premier objectif
          </button>
        </div>
      )}

      {/* Ajouter objectif */}
      {goals.length > 0 && (
        <button onClick={() => setShowAdd(true)} style={{ width: '100%', padding: '12px', marginTop: 10, borderRadius: 14, background: 'transparent', border: '1.5px dashed rgba(156,175,136,0.2)', color: '#9CAF88', fontSize: 13, cursor: 'pointer' }}>
          + Créer un objectif
        </button>
      )}

      {/* Modal ajout */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 200, padding: '0 16px 24px' }}>
          <div className="scale-in" style={{ background: '#1A1A1A', borderRadius: 28, padding: '24px', width: '100%', maxWidth: 400, border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 26, fontWeight: 400, fontStyle: 'italic', color: '#F0EDE8', marginBottom: 18 }}>Nouvel objectif</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {emojis.map(e => <button key={e} onClick={() => setEmoji(e)} style={{ fontSize: 20, padding: '7px 9px', borderRadius: 10, background: emoji === e ? 'rgba(156,175,136,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${emoji === e ? '#9CAF88' : 'transparent'}`, cursor: 'pointer' }}>{e}</button>)}
            </div>
            <input placeholder="Nom (ex: Voyage Tokyo)" value={name} onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#F0EDE8', fontSize: 15, outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
            <input type="number" placeholder="Montant cible (€)" value={target} onChange={e => setTarget(e.target.value)}
              style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#F0EDE8', fontSize: 15, outline: 'none', marginBottom: 16, boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAdd(false)} className="btn-ghost" style={{ flex: 1, padding: '13px' }}>Annuler</button>
              <button onClick={addGoal} className="btn-primary" style={{ flex: 1, padding: '13px', fontSize: 15 }}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Streak({ streak, setStreak, totalSaved, addSavings, setPage }) {
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

      {/* Objectifs d'épargne */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, fontWeight: 400, fontStyle: 'italic', color: '#F0EDE8', margin: 0 }}>Mes objectifs</p>
          <button onClick={() => setPage('goals')} style={{ background: 'rgba(156,175,136,0.1)', border: '1px solid rgba(156,175,136,0.25)', borderRadius: 100, padding: '6px 14px', color: '#9CAF88', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Voir tout →</button>
        </div>
        <GoalsMini totalSaved={totalSaved} />
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
  const [goals, setGoals] = useState([]);
  const [showAdd, setShowAdd]         = useState(false);
  const [showDetail, setShowDetail]   = useState(null); // goal id
  const [showAlloc, setShowAlloc]     = useState(null); // goal id
  const [allocAmount, setAllocAmount] = useState("");
  const [name, setName]               = useState("");
  const [target, setTarget]           = useState("");
  const [emoji, setEmoji]             = useState("🎯");
  const [deleteId, setDeleteId]       = useState(null);
  const emojis = ["✈️","👟","🎮","🏠","🎁","🎓","🚗","💻","🌴","🎸","🏦","💍","🎨","🐾","🌍"];

  const totalAllocated = goals.reduce((s, g) => s + g.saved, 0);
  const available = Math.max(0, totalSaved - totalAllocated);

  const allocate = (id, amount) => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || amt > available) return;
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const add = Math.min(amt, g.target - g.saved);
      const entry = { date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short" }), amount: add, source: "Alloué manuellement" };
      return { ...g, saved: g.saved + add, history: [entry, ...g.history] };
    }));
    allocateSavings(Math.min(amt, goals.find(g => g.id === id).target - goals.find(g => g.id === id).saved));
    setAllocAmount(""); setShowAlloc(null);
  };

  const addGoal = () => {
    if (!name || !target) return;
    const colors = ["#B8D4C8","#E8C4A0","#9CAF88","#D4856A","#B8A8D4"];
    setGoals(prev => [...prev, { id: Date.now(), name, emoji, target: parseFloat(target), saved: 0, color: colors[prev.length % colors.length], history: [] }]);
    setName(""); setTarget(""); setEmoji("🎯"); setShowAdd(false);
  };

  const deleteGoal = (id) => { setGoals(prev => prev.filter(g => g.id !== id)); setDeleteId(null); setShowDetail(null); };

  // ── Détail d'un objectif
  const detailGoal = goals.find(g => g.id === showDetail);
  if (detailGoal) {
    const pct = Math.min(100, Math.round((detailGoal.saved / detailGoal.target) * 100));
    const remaining = detailGoal.target - detailGoal.saved;
    const done = pct >= 100;
    return (
      <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "0 0 100px" }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, background: "rgba(13,13,13,0.97)", backdropFilter: "blur(12px)", zIndex: 10, paddingBottom: 16 }}>
          <button onClick={() => setShowDetail(null)} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#F0EDE8", fontSize: 18 }}>←</button>
          <span style={{ fontSize: 24 }}>{detailGoal.emoji}</span>
          <span style={{ fontFamily: "Cormorant Garamond", fontSize: 22, fontWeight: 400, color: "#F0EDE8", flex: 1 }}>{detailGoal.name}</span>
          <button onClick={() => setDeleteId(detailGoal.id)} style={{ background: "rgba(224,144,128,0.1)", border: "1px solid rgba(224,144,128,0.2)", borderRadius: 100, padding: "6px 12px", color: "#E09080", fontSize: 12, cursor: "pointer" }}>Supprimer</button>
        </div>

        <div style={{ padding: "24px 20px" }}>
          {/* Progress visuel */}
          <div style={{ background: `${detailGoal.color}10`, border: `1px solid ${detailGoal.color}25`, borderRadius: 24, padding: "24px", marginBottom: 20, textAlign: "center" }}>
            <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 16px" }}>
              <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={detailGoal.color} strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
                  strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "Cormorant Garamond", fontSize: 28, fontWeight: 400, color: detailGoal.color, lineHeight: 1 }}>{pct}%</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>complété</span>
              </div>
            </div>
            <p style={{ fontFamily: "Cormorant Garamond", fontSize: 32, fontWeight: 300, color: "#F0EDE8", margin: "0 0 4px" }}>
              {detailGoal.saved.toFixed(0)}€ <span style={{ fontSize: 18, color: "rgba(255,255,255,0.3)" }}>/ {detailGoal.target}€</span>
            </p>
            {!done && <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: 0 }}>Encore {remaining.toFixed(0)}€ pour atteindre ton objectif</p>}
            {done  && <p style={{ color: detailGoal.color, fontSize: 14, fontWeight: 600, margin: 0 }}>🎉 Objectif atteint !</p>}
          </div>

          {/* Allouer */}
          {!done && available > 0 && (
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "18px", marginBottom: 20 }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 12px" }}>Allouer des économies</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, margin: "0 0 14px" }}>Disponible : <span style={{ color: "#9CAF88", fontWeight: 600 }}>{available.toFixed(0)}€</span></p>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {[10, 25, 50].map(v => (
                  <button key={v} onClick={() => setAllocAmount(String(Math.min(v, available, remaining)))}
                    style={{ flex: 1, padding: "10px", borderRadius: 12, border: `1px solid ${allocAmount === String(Math.min(v, available, remaining)) ? detailGoal.color : "rgba(255,255,255,0.1)"}`, background: allocAmount === String(Math.min(v, available, remaining)) ? `${detailGoal.color}15` : "transparent", color: "rgba(255,255,255,0.6)", fontSize: 13, cursor: "pointer" }}>
                    {v}€
                  </button>
                ))}
                <input type="number" placeholder="Autre" value={allocAmount} onChange={e => setAllocAmount(e.target.value)}
                  style={{ flex: 1, padding: "10px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#F0EDE8", fontSize: 13, outline: "none", textAlign: "center", boxSizing: "border-box" }} />
              </div>
              <button onClick={() => allocate(detailGoal.id, allocAmount)} style={{ width: "100%", padding: "14px", background: allocAmount ? detailGoal.color : "rgba(255,255,255,0.06)", border: "none", borderRadius: 100, color: allocAmount ? "#0D0D0D" : "rgba(255,255,255,0.3)", fontWeight: 700, fontSize: 14, cursor: allocAmount ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                Allouer {allocAmount ? `${allocAmount}€` : ""}
              </button>
            </div>
          )}

          {available === 0 && !done && (
            <div style={{ background: "rgba(232,196,160,0.08)", border: "1px solid rgba(232,196,160,0.2)", borderRadius: 16, padding: "14px 16px", marginBottom: 20 }}>
              <p style={{ color: "rgba(232,196,160,0.7)", fontSize: 13, margin: 0, lineHeight: 1.6 }}>💡 Utilise le bouton Pause pour éviter des achats impulsifs et alimenter ta cagnotte.</p>
            </div>
          )}

          {/* Historique */}
          <div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>Historique des versements</p>
            {detailGoal.history.length === 0
              ? <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>Aucun versement pour l'instant</p>
              : detailGoal.history.map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div>
                    <p style={{ color: "#F0EDE8", fontSize: 14, margin: "0 0 2px" }}>+{h.amount.toFixed(0)}€</p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, margin: 0 }}>{h.source}</p>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>{h.date}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Confirm delete */}
        {deleteId && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100, padding: "0 16px 32px" }}>
            <div className="scale-in" style={{ width: "100%", maxWidth: 400, background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 24 }}>
              <p style={{ fontFamily: "Cormorant Garamond", fontSize: 24, color: "#F0EDE8", marginBottom: 8 }}>Supprimer cet objectif ?</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 24 }}>Les économies allouées seront remises dans ta cagnotte disponible.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setDeleteId(null)} className="btn-ghost" style={{ flex: 1, padding: "14px" }}>Annuler</button>
                <button onClick={() => deleteGoal(deleteId)} style={{ flex: 1, padding: "14px", background: "#E09080", border: "none", borderRadius: 100, color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Vue principale
  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "32px 20px 100px" }}>

      {/* Header */}
      <p style={{ fontFamily: "DM Sans", fontSize: 11, letterSpacing: 4, color: "#9CAF88", opacity: 0.7, margin: "0 0 4px" }}>ÉPARGNE</p>
      <h2 style={{ fontFamily: "Cormorant Garamond", fontSize: 38, fontWeight: 400, fontStyle: "italic", color: "#F0EDE8", margin: "0 0 4px" }}>Mes objectifs</h2>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 24, lineHeight: 1.6 }}>Chaque achat évité te rapproche de ce qui compte vraiment</p>

      {/* Cagnotte totale */}
      <div style={{ background: "linear-gradient(135deg, rgba(156,175,136,0.12), rgba(156,175,136,0.04))", border: "1px solid rgba(156,175,136,0.25)", borderRadius: 24, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: "0 0 4px" }}>Cagnotte totale</p>
            <p style={{ fontFamily: "Cormorant Garamond", fontSize: 44, fontWeight: 300, color: "#9CAF88", margin: "0 0 4px", lineHeight: 1 }}>{totalSaved.toFixed(0)}€</p>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, margin: 0 }}>économisés grâce à tes pauses</p>
          </div>
          <span style={{ fontSize: 36 }}>💰</span>
        </div>
        {/* Répartition */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>Alloué aux objectifs</span>
            <span style={{ color: "#F0EDE8", fontSize: 12, fontWeight: 600 }}>{totalAllocated.toFixed(0)}€</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>Disponible</span>
            <span style={{ color: "#9CAF88", fontSize: 12, fontWeight: 600 }}>{available.toFixed(0)}€</span>
          </div>
          {/* Barre de répartition */}
          <div style={{ height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 100, overflow: "hidden", marginTop: 12 }}>
            <div style={{ height: "100%", width: totalSaved > 0 ? `${(totalAllocated / totalSaved) * 100}%` : "0%", background: "#9CAF88", borderRadius: 100, transition: "width 0.6s" }} />
          </div>
        </div>
      </div>

      {/* Liste des objectifs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        {goals.map(g => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
          const done = pct >= 100;
          const remaining = g.target - g.saved;
          const isAllocOpen = showAlloc === g.id;
          return (
            <div key={g.id} style={{ borderRadius: 20, background: done ? `${g.color}10` : "rgba(255,255,255,0.04)", border: `1.5px solid ${isAllocOpen ? g.color + "60" : done ? g.color + "35" : "rgba(255,255,255,0.07)"}`, overflow: "hidden", transition: "all 0.2s" }}>
              {/* Card header — cliquable pour détail */}
              <div onClick={() => setShowDetail(g.id)} style={{ padding: "18px 20px 14px", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${g.color}15`, border: `1px solid ${g.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{g.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#F0EDE8", fontSize: 15, fontWeight: 500, margin: "0 0 1px" }}>{g.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0 }}>
                      {done ? "Objectif atteint 🎉" : `${g.saved.toFixed(0)}€ / ${g.target}€`}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: "Cormorant Garamond", fontSize: 22, fontWeight: 400, color: g.color, margin: "0 0 1px", lineHeight: 1 }}>{pct}%</p>
                    <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, margin: 0 }}>{remaining.toFixed(0)}€ restants</p>
                  </div>
                </div>
                <div className="progress-bar" style={{ height: 3 }}>
                  <div className="progress-fill" style={{ width: pct + "%", background: g.color }} />
                </div>
              </div>

              {/* Bouton allouer / zone d'allocation */}
              {!done && (
                <div style={{ borderTop: `1px solid ${isAllocOpen ? g.color + "25" : "rgba(255,255,255,0.05)"}` }}>
                  {!isAllocOpen ? (
                    <button onClick={e => { e.stopPropagation(); setShowAlloc(g.id); setAllocAmount(""); }}
                      style={{ width: "100%", padding: "12px 20px", background: "transparent", border: "none", color: available > 0 ? g.color : "rgba(255,255,255,0.2)", fontSize: 13, fontWeight: 600, cursor: available > 0 ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      {available > 0 ? <><span>＋</span> Allouer des économies</> : "Aucune économie disponible"}
                    </button>
                  ) : (
                    <div style={{ padding: "14px 16px", background: `${g.color}06` }}>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, margin: "0 0 10px" }}>
                        Disponible : <span style={{ color: g.color, fontWeight: 600 }}>{available.toFixed(0)}€</span>
                        <span style={{ marginLeft: 8, color: "rgba(255,255,255,0.2)" }}>· Max allouable : {Math.min(available, remaining).toFixed(0)}€</span>
                      </p>
                      {/* Raccourcis rapides */}
                      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                        {[10, 25, 50, Math.min(available, remaining)].filter((v, i, arr) => arr.indexOf(v) === i && v > 0).map(v => (
                          <button key={v} onClick={() => setAllocAmount(String(v))}
                            style={{ flex: 1, padding: "8px 4px", borderRadius: 10, border: `1px solid ${allocAmount === String(v) ? g.color : "rgba(255,255,255,0.1)"}`, background: allocAmount === String(v) ? `${g.color}20` : "rgba(255,255,255,0.04)", color: allocAmount === String(v) ? g.color : "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer" }}>
                            {v === Math.min(available, remaining) && v !== 10 && v !== 25 && v !== 50 ? "Tout" : `${v}€`}
                          </button>
                        ))}
                        <input type="number" placeholder="€" value={allocAmount} onChange={e => setAllocAmount(e.target.value)}
                          style={{ flex: 1, padding: "8px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#F0EDE8", fontSize: 12, outline: "none", textAlign: "center", boxSizing: "border-box", minWidth: 0 }} />
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => { setShowAlloc(null); setAllocAmount(""); }}
                          style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100, color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer" }}>Annuler</button>
                        <button onClick={() => allocate(g.id, allocAmount)}
                          style={{ flex: 2, padding: "10px", background: allocAmount && parseFloat(allocAmount) > 0 ? g.color : "rgba(255,255,255,0.06)", border: "none", borderRadius: 100, color: allocAmount && parseFloat(allocAmount) > 0 ? "#0D0D0D" : "rgba(255,255,255,0.2)", fontWeight: 700, fontSize: 13, cursor: allocAmount ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                          Confirmer {allocAmount ? `${allocAmount}€` : ""}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {done && (
                <div style={{ padding: "10px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
                  <span style={{ color: g.color, fontSize: 13, fontWeight: 600 }}>🎉 Objectif atteint !</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {goals.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(255,255,255,0.03)", border: "1.5px dashed rgba(156,175,136,0.2)", borderRadius: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🎯</div>
          <p style={{ fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 300, fontStyle: "italic", color: "#F0EDE8", margin: "0 0 8px" }}>Aucun objectif créé</p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, lineHeight: 1.7, margin: "0 0 24px", maxWidth: 260, marginLeft: "auto", marginRight: "auto" }}>
            Définis ce pour quoi tu économises — un voyage, une paire de sneakers, une épargne. Chaque pause alimentera ta cagnotte.
          </p>
          <button onClick={() => setShowAdd(true)} style={{ padding: "14px 32px", background: "#9CAF88", border: "none", borderRadius: 100, color: "#0D0D0D", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            + Créer mon premier objectif
          </button>
        </div>
      )}

      {/* Ajouter objectif */}
      {goals.length > 0 && (
        <button onClick={() => setShowAdd(true)} style={{ width: "100%", padding: "16px", borderRadius: 20, background: "transparent", border: "1.5px dashed rgba(156,175,136,0.25)", color: "#9CAF88", fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>+</span> Ajouter un objectif
        </button>
      )}

      {/* Modal ajout */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100, padding: "0 16px 24px" }}>
          <div className="scale-in" style={{ background: "#1A1A1A", borderRadius: 28, padding: "28px 24px", width: "100%", maxWidth: 400, border: "1px solid rgba(255,255,255,0.08)" }}>
            <p style={{ fontFamily: "Cormorant Garamond", fontSize: 28, fontWeight: 400, fontStyle: "italic", color: "#F0EDE8", marginBottom: 20 }}>Nouvel objectif</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 10px" }}>Choisis une icône</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
              {emojis.map(e => <button key={e} onClick={() => setEmoji(e)} style={{ fontSize: 22, padding: "8px 10px", borderRadius: 12, background: emoji === e ? "rgba(156,175,136,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${emoji === e ? "#9CAF88" : "transparent"}`, cursor: "pointer" }}>{e}</button>)}
            </div>
            <input placeholder="Nom de l'objectif (ex: Voyage Japon)" value={name} onChange={e => setName(e.target.value)}
              style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#F0EDE8", fontSize: 15, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
            <input type="number" placeholder="Montant cible en €" value={target} onChange={e => setTarget(e.target.value)}
              style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#F0EDE8", fontSize: 15, outline: "none", marginBottom: 18, boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowAdd(false)} className="btn-ghost" style={{ flex: 1, padding: "14px" }}>Annuler</button>
              <button onClick={addGoal} className="btn-primary" style={{ flex: 1, padding: "14px", fontSize: 15 }}>Créer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
// ─── PROFILE ──────────────────────────────────────────────────────────────────
function Profile({ score, streak, totalSaved, setPremium, setPage, user, setShowAuth }) {
  const { label, color } = getConfig(score);
  const [notifs, setNotifs] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [showLogout, setShowLogout] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showRate, setShowRate] = useState(false);
  const [stars, setStars] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [rated, setRated] = useState(false);
  const [plan, setPlan] = useState("annual");

  const level = streak < 7  ? { name: "Débutant",     next: 7,  icon: "🌱" }
    : streak < 30 ? { name: "Intermédiaire", next: 30, icon: "🌿" }
    : streak < 60 ? { name: "Avancé",        next: 60, icon: "🌳" }
    :               { name: "Maître",         next: null, icon: "🏆" };
  const pct = level.next ? Math.round((streak / level.next) * 100) : 100;

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 100, cursor: "pointer", background: value ? color : "rgba(255,255,255,0.12)", transition: "background 0.3s", position: "relative", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "white", transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </div>
  );

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontFamily: "DM Sans", fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 }}>{title}</p>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>{children}</div>
    </div>
  );

  const Row = ({ icon, label, right, onClick, danger, last }) => (
    <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", borderBottom: last ? "none" : "1px solid rgba(255,255,255,0.05)", cursor: onClick ? "pointer" : "default" }}>
      <span style={{ fontSize: 17, width: 22, textAlign: "center", flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 14, color: danger ? "#E09080" : "rgba(255,255,255,0.8)" }}>{label}</span>
      {right && <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>{right}</span>}
      {onClick && !right && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 18 }}>›</span>}
    </div>
  );

  const Modal = ({ children, onClose }) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", zIndex: 200, overflowY: "auto" }}>
      <div style={{ minHeight: "100vh", padding: "0 20px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0 24px", position: "sticky", top: 0, background: "rgba(13,13,13,0.97)", backdropFilter: "blur(12px)", zIndex: 10, marginBottom: 8 }}>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", color: "#F0EDE8", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        </div>
        {children}
      </div>
    </div>
  );

  // ── Billing modal
  const fakeBills = [
    { date: "01 Juin 2025",    amount: "15,99€", plan: "Annuel",  status: "Payé", id: "INV-2025-006" },
    { date: "01 Juin 2024",    amount: "15,99€", plan: "Annuel",  status: "Payé", id: "INV-2024-006" },
    { date: "01 Mai 2024",     amount: "1,99€",  plan: "Mensuel", status: "Payé", id: "INV-2024-005" },
    { date: "01 Avril 2024",   amount: "1,99€",  plan: "Mensuel", status: "Payé", id: "INV-2024-004" },
    { date: "01 Mars 2024",    amount: "1,99€",  plan: "Mensuel", status: "Payé", id: "INV-2024-003" },
  ];

  if (showBilling) return (
    <Modal onClose={() => setShowBilling(false)}>
      <p style={{ fontFamily: "Cormorant Garamond", fontSize: 32, fontWeight: 400, color: "#F0EDE8", marginBottom: 24 }}>Historique de facturation</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {fakeBills.map(b => (
          <div key={b.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <p style={{ color: "#F0EDE8", fontSize: 15, fontWeight: 500, margin: "0 0 3px" }}>{b.amount}</p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0 }}>{b.plan} · {b.date}</p>
              </div>
              <span style={{ background: "rgba(156,175,136,0.15)", border: "1px solid rgba(156,175,136,0.3)", borderRadius: 100, padding: "4px 10px", fontSize: 11, color: "#9CAF88" }}>{b.status}</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, margin: 0, fontFamily: "DM Sans" }}>{b.id}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24, background: "rgba(156,175,136,0.06)", border: "1px solid rgba(156,175,136,0.15)", borderRadius: 16, padding: "14px 16px" }}>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
          📧 Tes factures sont également envoyées par email après chaque paiement. Pour toute question : <span style={{ color: "#9CAF88" }}>support@impulsstop.app</span>
        </p>
      </div>
    </Modal>
  );

  // ── About modal
  if (showAbout) return (
    <Modal onClose={() => setShowAbout(false)}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(156,175,136,0.1)", border: "1px solid rgba(156,175,136,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 16px" }}>🌿</div>
        <p style={{ fontFamily: "Cormorant Garamond", fontSize: 38, fontWeight: 400, color: "#F0EDE8", margin: "0 0 4px" }}>ImpulsStop</p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>Version 1.0.0</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "20px", marginBottom: 16 }}>
        <p style={{ color: "#9CAF88", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 10px" }}>Notre mission</p>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.8, margin: 0 }}>
          ImpulsStop aide les jeunes adultes à comprendre et reprendre le contrôle de leurs habitudes d'achat impulsif — avec bienveillance, sans culpabilité. Ce n'est pas ta faute. Les marques sont conçues pour te faire craquer. Nous sommes là pour t'aider à voir plus clair.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "20px", marginBottom: 16 }}>
        <p style={{ color: "#9CAF88", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 16px" }}>Le fondateur</p>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, rgba(156,175,136,0.3), rgba(156,175,136,0.1))", border: "1px solid rgba(156,175,136,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Cormorant Garamond", fontSize: 22, color: "#9CAF88", fontWeight: 600, flexShrink: 0 }}>M</div>
          <div>
            <p style={{ color: "#F0EDE8", fontSize: 16, fontWeight: 600, margin: "0 0 2px" }}>Mathis Bobo</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0 }}>Fondateur & CEO · ImpulsStop</p>
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
          "J'ai créé ImpulsStop après avoir réalisé que mes propres achats compulsifs étaient liés à mes émotions, pas à de vrais besoins. Cette app, c'est l'outil que j'aurais voulu avoir."
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "20px", marginBottom: 16 }}>
        <p style={{ color: "#9CAF88", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px" }}>Basé sur la science</p>
        {[
          { name: "Bergen Shopping Addiction Scale", author: "Andreassen et al.", detail: "23 537 participants · Université de Bergen" },
          { name: "Dopamine Nation", author: "Dr. Anna Lembke", detail: "Psychiatre · Stanford University" },
          { name: "Tiny Habits", author: "Dr. BJ Fogg", detail: "Chercheur en comportement · Stanford" },
          { name: "Unwinding Anxiety", author: "Dr. Judson Brewer", detail: "Neuroscientifique · Brown University" },
        ].map(s => (
          <div key={s.name} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ color: "#F0EDE8", fontSize: 13, fontWeight: 500, margin: "0 0 2px" }}>{s.name}</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, margin: 0 }}>{s.author} · {s.detail}</p>
          </div>
        ))}
      </div>

      <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 12, marginTop: 8 }}>
        📧 contact@impulsstop.app<br/>
        Fait avec 🌿 pour reprendre le contrôle
      </p>
    </Modal>
  );

  // ── Privacy modal
  if (showPrivacy) return (
    <Modal onClose={() => setShowPrivacy(false)}>
      <p style={{ fontFamily: "Cormorant Garamond", fontSize: 32, fontWeight: 400, color: "#F0EDE8", marginBottom: 6 }}>Politique de confidentialité</p>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 24 }}>Dernière mise à jour : 1er juin 2025</p>
      {[
        {
          title: "1. Responsable du traitement",
          text: "ImpulsStop, représenté par Mathis Bobo (contact@impulsstop.app), est responsable du traitement de vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679)."
        },
        {
          title: "2. Données collectées",
          text: "Nous collectons uniquement les données nécessaires au fonctionnement de l'app : adresse email (authentification), score et profil comportemental, streak et économies réalisées, préférences de notifications. Nous ne collectons jamais vos données bancaires — les paiements sont gérés par Stripe, certifié PCI DSS."
        },
        {
          title: "3. Finalités du traitement",
          text: "Vos données sont utilisées pour : personnaliser votre expérience et suivi, gérer votre abonnement Premium, vous envoyer des rappels si activés, améliorer l'application de manière anonymisée."
        },
        {
          title: "4. Base légale",
          text: "Le traitement est fondé sur l'exécution du contrat (art. 6.1.b RGPD) pour les données nécessaires au service, et sur votre consentement (art. 6.1.a RGPD) pour les communications marketing."
        },
        {
          title: "5. Durée de conservation",
          text: "Vos données sont conservées pendant toute la durée de votre compte, puis supprimées dans un délai de 30 jours après fermeture. Les données de facturation sont conservées 10 ans conformément aux obligations légales françaises."
        },
        {
          title: "6. Vos droits (RGPD)",
          text: "Vous disposez des droits suivants : accès à vos données, rectification, suppression (droit à l'oubli), portabilité, opposition au traitement, limitation du traitement. Pour exercer ces droits : contact@impulsstop.app. Délai de réponse : 30 jours maximum."
        },
        {
          title: "7. Partage des données",
          text: "Nous ne vendons jamais vos données. Elles peuvent être partagées uniquement avec nos sous-traitants techniques : Supabase (hébergement base de données, UE), Stripe (paiements, certifié PCI DSS), Vercel (hébergement app, UE)."
        },
        {
          title: "8. Cookies",
          text: "ImpulsStop utilise uniquement des cookies techniques essentiels au fonctionnement de l'app (session, authentification). Aucun cookie publicitaire ou de tracking tiers n'est utilisé."
        },
        {
          title: "9. Sécurité",
          text: "Vos données sont chiffrées en transit (TLS 1.3) et au repos. L'accès est protégé par authentification forte. En cas de violation de données, vous serez notifié dans les 72h conformément au RGPD."
        },
        {
          title: "10. Contact & réclamations",
          text: "Pour toute question : contact@impulsstop.app. Vous pouvez également déposer une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : cnil.fr"
        },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 20 }}>
          <p style={{ color: "#9CAF88", fontSize: 13, fontWeight: 600, margin: "0 0 6px" }}>{s.title}</p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.8, margin: 0 }}>{s.text}</p>
        </div>
      ))}
    </Modal>
  );

  // ── Rate modal
  if (showRate) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200, padding: "0 16px 32px" }}>
      <div className="scale-in" style={{ width: "100%", maxWidth: 400, background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: "28px 24px", textAlign: "center" }}>
        {!rated ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
            <p style={{ fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 400, color: "#F0EDE8", margin: "0 0 6px" }}>Tu aimes ImpulsStop ?</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Ton avis compte beaucoup pour nous et aide d'autres personnes à découvrir l'app.</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 28 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s}
                  onMouseEnter={() => setHoverStar(s)}
                  onMouseLeave={() => setHoverStar(0)}
                  onClick={() => setStars(s)}
                  style={{ fontSize: 40, cursor: "pointer", transition: "transform 0.15s", transform: (hoverStar || stars) >= s ? "scale(1.2)" : "scale(1)", filter: (hoverStar || stars) >= s ? "none" : "grayscale(1) opacity(0.4)" }}
                >⭐</span>
              ))}
            </div>
            <button onClick={() => { if (stars > 0) setRated(true); }} style={{ width: "100%", padding: "16px", background: stars > 0 ? "#9CAF88" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 100, color: stars > 0 ? "#0D0D0D" : "rgba(255,255,255,0.3)", fontFamily: "DM Sans", fontWeight: 700, fontSize: 15, cursor: stars > 0 ? "pointer" : "not-allowed", marginBottom: 10, transition: "all 0.2s" }}>
              Envoyer mon avis {stars > 0 ? `(${stars}★)` : ""}
            </button>
            <button onClick={() => setShowRate(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer" }}>Plus tard</button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <p style={{ fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 400, color: "#F0EDE8", margin: "0 0 10px" }}>Merci beaucoup !</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Ton avis {stars} étoile{stars > 1 ? "s" : ""} nous aide énormément. On travaille chaque jour pour mériter ta confiance. 🌿</p>
            <button onClick={() => { setShowRate(false); setRated(false); setStars(0); }} className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: 15 }}>Fermer</button>
          </>
        )}
      </div>
    </div>
  );

  // ── Main profile view
  return (
    <div style={{ minHeight: "100vh", background: "#0D0D0D", padding: "32px 20px 100px", overflowY: "auto" }}>

      {/* Header */}
      <div className="fade-up-1" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg, ${color}30, ${color}10)`, border: `1.5px solid ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
          {level.icon}
        </div>
        <div>
          <p style={{ fontFamily: "Cormorant Garamond", fontSize: 24, fontWeight: 500, color: "#F0EDE8", margin: "0 0 2px" }}>Mon Profil</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: color, fontWeight: 600 }}>{label}</span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Niveau {level.name}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Impuls Score", value: score, unit: "/100", c: color },
          { label: "Streak", value: streak, unit: " j", c: "#E8C4A0" },
          { label: "Économisé", value: `${totalSaved.toFixed(0)}€`, unit: "", c: "#B8D4C8" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 12px", textAlign: "center" }}>
            <p style={{ fontFamily: "Cormorant Garamond", fontSize: 28, fontWeight: 400, color: s.c, margin: "0 0 3px", lineHeight: 1 }}>{s.value}<span style={{ fontSize: 13, opacity: 0.6 }}>{s.unit}</span></p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Level progress */}
      <div className="fade-up-2" style={{ background: `${color}0D`, border: `1px solid ${color}20`, borderRadius: 18, padding: "16px 18px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: color, fontWeight: 600 }}>{level.icon} Niveau {level.name}</span>
          {level.next ? <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{streak} / {level.next} jours</span> : <span style={{ fontSize: 12, color: color }}>Niveau max !</span>}
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 100, overflow: "hidden" }}>
          <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: 100, transition: "width 0.6s" }} />
        </div>
        {level.next && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>Encore {level.next - streak} jours pour le niveau suivant</p>}
      </div>

      {/* Subscription */}
      <div className="fade-up-3">
        <Section title="Abonnement">
          <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <p style={{ color: "#F0EDE8", fontSize: 14, fontWeight: 500, margin: "0 0 2px" }}>ImpulsStop Premium</p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, margin: 0 }}>{plan === "annual" ? "Annuel · 15,99€/an" : "Mensuel · 1,99€/mois"}</p>
              </div>
              <span style={{ background: color + "20", border: `1px solid ${color}40`, borderRadius: 100, padding: "4px 10px", fontSize: 11, color: color, fontWeight: 600 }}>Actif</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setPlan("monthly")} style={{ flex: 1, padding: "8px", borderRadius: 10, border: `1px solid ${plan === "monthly" ? color : "rgba(255,255,255,0.1)"}`, background: plan === "monthly" ? color + "15" : "transparent", color: plan === "monthly" ? color : "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer" }}>Mensuel</button>
              <button onClick={() => setPlan("annual")} style={{ flex: 1, padding: "8px", borderRadius: 10, border: `1px solid ${plan === "annual" ? color : "rgba(255,255,255,0.1)"}`, background: plan === "annual" ? color + "15" : "transparent", color: plan === "annual" ? color : "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer" }}>Annuel −33%</button>
            </div>
          </div>
          <Row icon="📄" label="Historique de facturation" onClick={() => setShowBilling(true)} />
          <Row icon="🔴" label="Annuler l'abonnement" onClick={() => setShowCancel(true)} danger last />
        </Section>

        <Section title="Notifications">
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 17, width: 22, textAlign: "center" }}>🔔</span>
            <span style={{ flex: 1, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>Notifications push</span>
            <Toggle value={notifs} onChange={setNotifs} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px" }}>
            <span style={{ fontSize: 17, width: 22, textAlign: "center" }}>⏰</span>
            <span style={{ flex: 1, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>Rappels quotidiens</span>
            <Toggle value={reminders} onChange={setReminders} />
          </div>
        </Section>

        <Section title="Application">
          <Row icon="🔁" label="Refaire le test" onClick={() => setPage("test")} />
          <Row icon="🌿" label="À propos d'ImpulsStop" onClick={() => setShowAbout(true)} />
          <Row icon="🔒" label="Politique de confidentialité" onClick={() => setShowPrivacy(true)} />
          <Row icon="⭐" label="Noter l'application" onClick={() => setShowRate(true)} last />
        </Section>

        <Section title="Compte">
          <Row icon="🚪" label="Se déconnecter" onClick={() => setShowLogout(true)} danger last />
        </Section>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.15)", fontSize: 11, marginTop: 8 }}>ImpulsStop v1.0 · Fait avec 🌿 par Mathis Bobo</p>
      {!user && (
        <div style={{ marginTop: 16, background: "rgba(156,175,136,0.06)", border: "1px solid rgba(156,175,136,0.2)", borderRadius: 16, padding: "14px 16px", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: "0 0 10px", lineHeight: 1.6 }}>
            🔒 Connecte-toi pour sauvegarder ton streak et tes objectifs entre sessions
          </p>
          <button onClick={() => setShowAuth(true)} style={{ padding: "10px 24px", background: "#9CAF88", border: "none", borderRadius: 100, color: "#0D0D0D", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Se connecter / S'inscrire
          </button>
        </div>
      )}
      </div>

      {/* Logout confirm */}
      {showLogout && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100, padding: "0 16px 32px" }}>
          <div className="scale-in" style={{ width: "100%", maxWidth: 400, background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 24 }}>
            <p style={{ fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 400, color: "#F0EDE8", marginBottom: 8 }}>Se déconnecter ?</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Tes données locales seront conservées. Tu pourras te reconnecter à tout moment.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowLogout(false)} className="btn-ghost" style={{ flex: 1, padding: "14px" }}>Annuler</button>
              <button onClick={() => { await supabase.auth.signOut(); setPremium(false); setPage("home"); setShowLogout(false); }} style={{ flex: 1, padding: "14px", background: "#E09080", border: "none", borderRadius: 100, color: "white", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Déconnecter</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirm */}
      {showCancel && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100, padding: "0 16px 32px" }}>
          <div className="scale-in" style={{ width: "100%", maxWidth: 400, background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 24 }}>
            <p style={{ fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 400, color: "#F0EDE8", marginBottom: 8 }}>Annuler l'abonnement ?</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>Tu perdras l'accès aux fonctionnalités Premium à la fin de ta période en cours.</p>
            <div style={{ background: "rgba(156,175,136,0.08)", border: "1px solid rgba(156,175,136,0.2)", borderRadius: 14, padding: "12px 16px", marginBottom: 20 }}>
              <p style={{ color: "#9CAF88", fontSize: 13, margin: 0, lineHeight: 1.5 }}>💡 Tu peux mettre en pause ton abonnement au lieu de l'annuler.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowCancel(false)} className="btn-ghost" style={{ flex: 1, padding: "14px" }}>Garder Premium</button>
              <button onClick={() => setShowCancel(false)} style={{ flex: 1, padding: "14px", background: "rgba(224,144,128,0.15)", border: "1px solid rgba(224,144,128,0.3)", borderRadius: 100, color: "#E09080", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Confirmer</button>
            </div>
          </div>
        </div>
      )}

      {showRate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200, padding: "0 16px 32px" }}>
          <div className="scale-in" style={{ width: "100%", maxWidth: 400, background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: "28px 24px", textAlign: "center" }}>
            {!rated ? (
              <>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
                <p style={{ fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 400, color: "#F0EDE8", margin: "0 0 6px" }}>Tu aimes ImpulsStop ?</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Ton avis nous aide énormément et aide d'autres personnes à découvrir l'app.</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 28 }}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} onMouseEnter={() => setHoverStar(s)} onMouseLeave={() => setHoverStar(0)} onClick={() => setStars(s)}
                      style={{ fontSize: 40, cursor: "pointer", transition: "transform 0.15s", transform: (hoverStar || stars) >= s ? "scale(1.2)" : "scale(1)", filter: (hoverStar || stars) >= s ? "none" : "grayscale(1) opacity(0.4)" }}>⭐</span>
                  ))}
                </div>
                <button onClick={() => { if (stars > 0) setRated(true); }} style={{ width: "100%", padding: "16px", background: stars > 0 ? "#9CAF88" : "rgba(255,255,255,0.08)", border: "none", borderRadius: 100, color: stars > 0 ? "#0D0D0D" : "rgba(255,255,255,0.3)", fontFamily: "DM Sans", fontWeight: 700, fontSize: 15, cursor: stars > 0 ? "pointer" : "not-allowed", marginBottom: 10, transition: "all 0.2s" }}>
                  Envoyer {stars > 0 ? `(${stars}★)` : ""}
                </button>
                <button onClick={() => setShowRate(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer" }}>Plus tard</button>
              </>
            ) : (
              <>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <p style={{ fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 400, color: "#F0EDE8", margin: "0 0 10px" }}>Merci !</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Ton avis {stars}★ nous aide énormément 🌿</p>
                <button onClick={() => { setShowRate(false); setRated(false); setStars(0); }} className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: 15 }}>Fermer</button>
              </>
            )}
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

// ─── AUTH MODAL ──────────────────────────────────────────────────────────────
function AuthModal({ onClose }) {
  const [mode, setMode]       = useState("login"); // login | signup
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const handle = async () => {
    setLoading(true); setError(""); setSuccess("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("Email ou mot de passe incorrect");
      else onClose();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSuccess("Vérifie tes emails pour confirmer ton compte 🌿");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 300, padding: "0 16px 24px" }}>
      <div className="scale-in" style={{ width: "100%", maxWidth: 400, background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: "28px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <p style={{ fontFamily: "Cormorant Garamond", fontSize: 26, fontWeight: 400, fontStyle: "italic", color: "#F0EDE8", margin: 0 }}>
            {mode === "login" ? "Se connecter" : "Créer un compte"}
          </p>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "#F0EDE8", fontSize: 16 }}>✕</button>
        </div>

        {/* Google */}
        <button onClick={handleGoogle} style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#F0EDE8", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>G</span> Continuer avec Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>ou</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#F0EDE8", fontSize: 15, outline: "none", marginBottom: 10, boxSizing: "border-box" }} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)}
          style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#F0EDE8", fontSize: 15, outline: "none", marginBottom: 16, boxSizing: "border-box" }} />

        {error && <p style={{ color: "#E09080", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{error}</p>}
        {success && <p style={{ color: "#9CAF88", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{success}</p>}

        <button onClick={handle} disabled={loading} className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: 15, marginBottom: 14, opacity: loading ? 0.6 : 1 }}>
          {loading ? "..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
          {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} style={{ color: "#9CAF88", cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </span>
        </p>
      </div>
    </div>
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
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (data) {
      setScore(data.score || 0);
      setStreak(data.streak || 0);
      setTotalSaved(data.total_saved || 0);
      if (data.plan === "premium") setPremium(true);
    } else {
      // Create profile if doesn't exist
      await supabase.from("profiles").insert({ id: userId });
    }
  };

  const saveProfile = useCallback(async () => {
    if (!user) return;
    await supabase.from("profiles").upsert({ id: user.id, score, streak, total_saved: totalSaved });
  }, [user, score, streak, totalSaved]);

  // Auto-save every time key data changes
  useEffect(() => { saveProfile(); }, [streak, totalSaved]);

  const addSavings = useCallback((a) => setTotalSaved(t => t + a), []);
  const allocateSavings = useCallback((a) => setTotalSaved(t => Math.max(0, t - a)), []);
  const showNav = premium && ["home","plan","pause","streak","goals","community","profile"].includes(page);

  const handleScoreSet = (s) => {
    setPendingScore(s);
    setScore(s);
    setShowReveal(true);
  };

  if (authLoading) return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid rgba(156,175,136,0.3)", borderTop: "2px solid #9CAF88", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

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
      {page === "streak" && premium && <Streak streak={streak} setStreak={setStreak} totalSaved={totalSaved} addSavings={addSavings} setPage={setPage} />}
      {page === "goals" && premium && <Goals totalSaved={totalSaved} allocateSavings={allocateSavings} />}
      {page === "community" && premium && <Community userScore={score} />}
      {page === "profile" && premium && <Profile score={score} streak={streak} totalSaved={totalSaved} setPremium={setPremium} setPage={setPage} user={user} setShowAuth={setShowAuth} />}
      {showNav && <BottomNavV2 page={page} setPage={setPage} />}
      {showShare && page !== "results" && <ShareCard score={score} onClose={() => setShowShare(false)} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

// Patched by update — replace export default App above with the one below
