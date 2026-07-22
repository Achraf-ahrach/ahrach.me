"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  translations,
  LANG_LABELS,
  type LangKey,
} from "./translations";

/* ── Lucide-style SVG icons (inline, no external dep) ─── */
const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);
const Menu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
);
const X = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const Globe = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.yobarber.app.v2";

export default function YoBarberLanding() {
  const [lang, setLang] = useState<LangKey>("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const t = translations[lang];
  const isRTL = lang === "ar";

  const changeLang = useCallback((l: LangKey) => {
    setLang(l);
    setLangOpen(false);
    setMobileLangOpen(false);
    setMobileMenuOpen(false);
  }, []);

  /* ── Scroll handler for navbar glass ─────── */
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Click-outside for lang dropdown ──────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Intersection observer for reveal ──────── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [lang]); // re-observe on language change

  /* ── Set RTL direction ─────────────────────── */
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    return () => {
      document.documentElement.dir = "ltr";
    };
  }, [isRTL]);

  /* ── Coming-soon toast ─────────────────────── */
  const showComingSoon = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className={`yobarber-page ${isRTL ? "font-arabic" : "font-display"}`} style={{ fontFamily: isRTL ? "'Cairo', sans-serif" : "'Poppins', sans-serif" }}>
      {/* ── Ambient Glows ───────────────────── */}
      <div className="glow-orb glow-1"></div>
      <div className="glow-orb glow-2"></div>
      <div className="glow-orb glow-3"></div>

      {/* ══════ NAVBAR ═══════════════════════ */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navScrolled ? "nav-glass shadow-sm" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("hero")}>
              <Image src="/yobarber/logo.png" alt="YoBarber" width={32} height={32} className="nav-logo-icon" />
              <span className="text-lg font-bold text-slate-800 tracking-tight">YoBarber</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection("features")} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">{t.nav_features}</button>
              <button onClick={() => scrollToSection("how")} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">{t.nav_how}</button>
              <button onClick={() => scrollToSection("download")} className="cta-primary text-white px-5 py-2 rounded-xl text-sm font-semibold">{t.nav_download}</button>
              {/* Language switcher */}
              <div className="lang-switcher" ref={langRef}>
                <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                  <Globe />
                  {LANG_LABELS[lang]}
                  <ChevronDown />
                </button>
                <div className={`lang-dropdown ${langOpen ? "open" : ""}`}>
                  {(Object.keys(LANG_LABELS) as LangKey[]).map((l) => (
                    <button key={l} className={lang === l ? "active" : ""} onClick={() => changeLang(l)}>
                      {l === "en" ? "🇬🇧 English" : l === "fr" ? "🇫🇷 Français" : "🇲🇦 العربية"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-slate-600">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100">
            <div className="px-6 py-4 space-y-3">
              <button onClick={() => scrollToSection("features")} className="block w-full text-left text-sm font-medium text-slate-600 py-2">{t.nav_features}</button>
              <button onClick={() => scrollToSection("how")} className="block w-full text-left text-sm font-medium text-slate-600 py-2">{t.nav_how}</button>
              <button onClick={() => scrollToSection("download")} className="block w-full text-left cta-primary text-white text-center px-5 py-2.5 rounded-xl text-sm font-semibold">{t.nav_download}</button>
              {/* Mobile language */}
              <div className="pt-2 border-t border-slate-100">
                <button onClick={() => setMobileLangOpen(!mobileLangOpen)} className="flex items-center gap-2 text-sm font-medium text-slate-500 py-2">
                  <Globe /> {LANG_LABELS[lang]} <ChevronDown />
                </button>
                {mobileLangOpen && (
                  <div className="pl-6 space-y-1">
                    {(Object.keys(LANG_LABELS) as LangKey[]).map((l) => (
                      <button key={l} onClick={() => changeLang(l)} className={`block text-sm py-1.5 ${lang === l ? "text-blue-600 font-semibold" : "text-slate-500"}`}>
                        {l === "en" ? "🇬🇧 English" : l === "fr" ? "🇫🇷 Français" : "🇲🇦 العربية"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ══════ HERO ═════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 40%, #f8fafc 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border border-blue-100">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full pulse-dot"></span>
                {t.hero_badge}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                <span className="gradient-text">{t.hero_title_1}</span>
                <br />
                <span className="gradient-text-brand">{t.hero_title_2}</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-md">{t.hero_subtitle}</p>
              <div className="flex flex-wrap gap-3 mb-8">
                <button onClick={showComingSoon} className="cta-accent text-white px-6 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  {t.cta_appstore}
                </button>
                <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="cta-primary text-white px-6 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm.91-.91L19.59 12l-1.87-2.21-2.27 2.27 2.27 2.15zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z"/></svg>
                  {t.cta_gplay}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <Image src="/yobarber/client1.jpeg" alt="" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  <Image src="/yobarber/client2.png" alt="" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  <Image src="/yobarber/client3.png" alt="" width={32} height={32} className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-xs font-medium text-slate-400">{t.hero_social_proof}</p>
              </div>
            </div>
            {/* Right — Hero mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="mockup-float mockup-shadow">
                <Image src="/yobarber/hero.png" alt="YoBarber app preview" width={420} height={600} className="w-[320px] sm:w-[380px] lg:w-[420px] h-auto" priority />
              </div>
            </div>
          </div>
          {/* Scroll indicator */}
          <div className="hidden lg:flex flex-col items-center mt-8 gap-2 opacity-40">
            <span className="text-xs font-medium text-slate-400 tracking-widest uppercase">{t.scroll_label}</span>
            <div className="w-5 h-8 border-2 border-slate-300 rounded-full flex justify-center pt-1.5">
              <div className="w-1 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ PROBLEM ══════════════════════ */}
      <section className="relative py-24 lg:py-32" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)" }}>
        <div className="section-divider absolute top-0 left-0 right-0"></div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="reveal">
            <span className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border border-red-100">{t.problem_badge}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">{t.problem_title_1}</span>
              <span className="gradient-text-accent">{t.problem_title_2}</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto mb-12">{t.problem_desc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 reveal" style={{ transitionDelay: "0.15s" }}>
            <div className="stat-card rounded-2xl p-6"><p className="text-3xl font-bold gradient-text-accent">45 min</p><p className="text-sm text-slate-500 mt-1">{t.stat_1}</p></div>
            <div className="stat-card rounded-2xl p-6"><p className="text-3xl font-bold gradient-text-accent">30%</p><p className="text-sm text-slate-500 mt-1">{t.stat_2}</p></div>
            <div className="stat-card rounded-2xl p-6"><p className="text-3xl font-bold gradient-text-brand">0 min</p><p className="text-sm text-slate-500 mt-1">{t.stat_3}</p></div>
          </div>
        </div>
      </section>

      {/* ══════ SOLUTION ═════════════════════ */}
      <section className="relative py-24 lg:py-32 bg-white">
        <div className="section-divider absolute top-0 left-0 right-0"></div>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border border-green-100">{t.solution_badge}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">{t.solution_title_1}</span>
              <span className="gradient-text-brand">{t.solution_title_2}</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">{t.solution_desc}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 reveal" style={{ transitionDelay: "0.15s" }}>
            {[
              { title: t.sol_feat_1_title, desc: t.sol_feat_1_desc, icon: "📡" },
              { title: t.sol_feat_2_title, desc: t.sol_feat_2_desc, icon: "🔔" },
              { title: t.sol_feat_3_title, desc: t.sol_feat_3_desc, icon: "⚡" },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-2xl p-8 text-center">
                <div className="feature-icon w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl">{item.icon}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FEATURES ═════════════════════ */}
      <section id="features" className="relative py-24 lg:py-32" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)" }}>
        <div className="section-divider absolute top-0 left-0 right-0"></div>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border border-blue-100">{t.features_badge}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">{t.features_title_1}</span>
              <br />
              <span className="gradient-text-brand">{t.features_title_2}</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">{t.features_subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: t.feat_1_title, desc: t.feat_1_desc, icon: "🎯" },
              { title: t.feat_2_title, desc: t.feat_2_desc, icon: "📅" },
              { title: t.feat_3_title, desc: t.feat_3_desc, icon: "👤" },
              { title: t.feat_4_title, desc: t.feat_4_desc, icon: "⏱️" },
              { title: t.feat_5_title, desc: t.feat_5_desc, icon: "🔔" },
              { title: t.feat_6_title, desc: t.feat_6_desc, icon: "💈" },
            ].map((feat, idx) => (
              <div key={feat.title} className="glass-card rounded-2xl p-8 reveal" style={{ transitionDelay: `${idx * 0.08}s` }}>
                <div className="feature-icon w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-xl">{feat.icon}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ═════════════════ */}
      <section id="how" className="relative py-24 lg:py-32 bg-white">
        <div className="section-divider absolute top-0 left-0 right-0"></div>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <span className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border border-violet-100">{t.how_badge}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">{t.how_title_1}</span>{" "}
              <span className="gradient-text-brand">{t.how_title_2}</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">{t.how_subtitle}</p>
          </div>

          {/* For Clients */}
          <div className="mb-20 reveal">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest text-center mb-10">{t.how_clients_label}</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: 1, title: t.client_step_1_title, desc: t.client_step_1_desc },
                { num: 2, title: t.client_step_2_title, desc: t.client_step_2_desc },
                { num: 3, title: t.client_step_3_title, desc: t.client_step_3_desc },
              ].map((step) => (
                <div key={step.num} className="text-center">
                  <div className="step-number w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white text-lg font-bold">{step.num}</div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* For Barbers */}
          <div className="reveal">
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest text-center mb-10">{t.how_barbers_label}</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { num: 1, title: t.barber_step_1_title, desc: t.barber_step_1_desc },
                { num: 2, title: t.barber_step_2_title, desc: t.barber_step_2_desc },
                { num: 3, title: t.barber_step_3_title, desc: t.barber_step_3_desc },
              ].map((step) => (
                <div key={step.num} className="text-center">
                  <div className="step-number w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white text-lg font-bold">{step.num}</div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ DOWNLOAD CTA ═════════════════ */}
      <section id="download" className="relative py-24 lg:py-32" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 50%, #f8fafc 100%)" }}>
        <div className="section-divider absolute top-0 left-0 right-0"></div>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <div className="reveal">
            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border border-blue-100">{t.download_badge}</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">{t.download_title_1}</span>
              <span className="gradient-text-brand">{t.download_title_2}</span>
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto mb-10">{t.download_desc}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 reveal" style={{ transitionDelay: "0.15s" }}>
            {/* App Store (coming soon) */}
            <button onClick={showComingSoon} className="store-badge flex items-center gap-3 bg-slate-900 text-white px-6 py-3.5 rounded-2xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div className="text-left"><p className="text-[10px] opacity-70">{t.badge_appstore_label}</p><p className="text-sm font-semibold -mt-0.5">App Store</p></div>
            </button>
            {/* Google Play */}
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="store-badge flex items-center gap-3 bg-slate-900 text-white px-6 py-3.5 rounded-2xl">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm.91-.91L19.59 12l-1.87-2.21-2.27 2.27 2.27 2.15zM6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z"/></svg>
              <div className="text-left"><p className="text-[10px] opacity-70">{t.badge_gplay_label}</p><p className="text-sm font-semibold -mt-0.5">Google Play</p></div>
            </a>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ═══════════════════════ */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/yobarber/logo.png" alt="YoBarber" width={32} height={32} className="w-8 h-8 rounded-lg" />
                <span className="text-lg font-bold tracking-tight">YoBarber</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{t.footer_desc}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-4">{t.footer_product}</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">{t.nav_features}</button></li>
                <li><button onClick={() => scrollToSection("how")} className="hover:text-white transition-colors">{t.nav_how}</button></li>
                <li><button onClick={() => scrollToSection("download")} className="hover:text-white transition-colors">{t.nav_download}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-4">{t.footer_legal}</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/YoBarber/privacy" className="hover:text-white transition-colors">{t.footer_privacy_link}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200 mb-4">{t.footer_connect}</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="https://ahrach.me" className="hover:text-white transition-colors">{t.footer_dev_website}</a></li>
                <li><a href="mailto:achrafahrach44@gmail.com" className="hover:text-white transition-colors">{t.footer_contact}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">{t.footer_copyright}</p>
            <p className="text-xs text-slate-500">
              {t.footer_built_by}{" "}
              <a href="https://ahrach.me" className="text-blue-400 hover:text-blue-300 transition-colors">Achraf Ahrach</a>
            </p>
          </div>
        </div>
      </footer>

      {/* ══════ COMING SOON TOAST ════════════ */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-bounce">
          <div className="glass-card rounded-2xl px-6 py-4 flex items-center gap-3 shadow-xl border-blue-100">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">🚀</div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{t.toast_coming_soon_badge}</p>
              <p className="text-xs text-slate-500">{t.toast_coming_soon_desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
