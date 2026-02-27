"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

                @keyframes bounce-fab {
                    0%, 100% { transform: translateY(0); }
                    40%       { transform: translateY(-10px); }
                    60%       { transform: translateY(-5px); }
                }
                @keyframes ripple-ring {
                    0%   { transform: scale(0.85); opacity: 0.7; }
                    100% { transform: scale(2.2);  opacity: 0; }
                }
                @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(32px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }

                .wa-fab {
                    position: fixed; bottom: 28px; right: 28px;
                    width: 62px; height: 62px; border-radius: 50%;
                    background: linear-gradient(145deg, #075e54, #25d366);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; border: none;
                    box-shadow: 0 0 0 6px rgba(37,211,102,0.12), 0 8px 28px rgba(0,0,0,0.45);
                    animation: bounce-fab 2.2s cubic-bezier(0.36,0.07,0.19,0.97) infinite;
                    z-index: 100; transition: transform 0.15s;
                }
                .wa-fab:hover { transform: scale(1.08) translateY(-2px); animation: none; }

                .wa-ripple {
                    position: fixed; bottom: 28px; right: 28px;
                    width: 62px; height: 62px; border-radius: 50%;
                    border: 1.5px solid rgba(37,211,102,0.3);
                    pointer-events: none; z-index: 99;
                    animation: ripple-ring 2.2s ease-out infinite;
                }
                .wa-ripple-2 { animation-delay: 0.7s; border-color: rgba(37,211,102,0.15); }

                .modal-backdrop { animation: fadeIn 0.2s ease; }
                .modal-box      { animation: slideUp 0.25s ease; }

                .gradient-text {
                    background: linear-gradient(90deg, #25d366, #075e54);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .try-btn:hover  { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(37,211,102,0.35); }
                .open-page-link:hover { background: #25d366 !important; color: #fff !important; }
                .modal-close:hover    { background: #f87171 !important; color: #fff !important; }
            `}</style>

      <main className="min-h-screen bg-[#0a0f0c] text-[#e8f5e2]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Nav */}
        <nav className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-[#1a2e22]">
          <span className="font-bold text-lg tracking-tight">
            Neuro<span className="gradient-text">Wealth</span>
          </span>
          <div className="flex gap-6 text-sm text-[#86b09a]">
            <a href="#" className="hover:text-[#e8f5e2] transition-colors">Docs</a>
            <a href="#" className="hover:text-[#e8f5e2] transition-colors">Pricing</a>
            <a href="#" className="hover:text-[#e8f5e2] transition-colors">About</a>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-2xl mx-auto px-6 pt-20 pb-14 text-center">
          <span className="inline-block px-3.5 py-1 mb-5 bg-[#0f2018] border border-[#1e3a2e]
                                     rounded-full text-[11px] font-semibold text-[#25d366] tracking-widest uppercase">
            WhatsApp-native AI
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
            Your wealth, managed via{" "}
            <span className="gradient-text">WhatsApp</span>
          </h1>
          <p className="text-base md:text-lg text-[#86b09a] leading-relaxed mb-9">
            NeuroWealth brings intelligent portfolio management, real-time alerts,
            and instant transactions directly into your WhatsApp — no app downloads,
            no dashboards, just a conversation.
          </p>
          <button
            className="try-btn px-7 py-3 rounded-3xl text-white font-semibold text-sm
                                   shadow-[0_4px_20px_rgba(37,211,102,0.25)] transition-all duration-150"
            style={{ background: "linear-gradient(135deg, #075e54, #25d366)" }}
            onClick={() => setModalOpen(true)}
          >
            Try the Sandbox →
          </button>
        </section>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto px-6 pb-20">
          {[
            { icon: "📊", title: "Portfolio Overview", desc: "Check balances, P&L, and asset allocation in seconds." },
            { icon: "⚡", title: "Instant Transfers", desc: "Send and receive XLM with a simple message." },
            { icon: "🔔", title: "Smart Alerts", desc: "Get notified on price moves, deposits, and withdrawals." },
            { icon: "🤖", title: "AI Advisor", desc: "Ask anything about your portfolio and get instant insights." },
          ].map((f) => (
            <div key={f.title} className="bg-[#0d1a12] border border-[#1a2e22] rounded-2xl p-5">
              <div className="text-2xl mb-2.5">{f.icon}</div>
              <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
              <p className="text-xs text-[#86b09a] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* FAB ripples */}
      <div className="wa-ripple" />
      <div className="wa-ripple wa-ripple-2" />

      {/* Floating WhatsApp FAB */}
      <button className="wa-fab" onClick={() => setModalOpen(true)} title="Open Sandbox">
        <svg viewBox="0 0 48 48" width="32" height="32" fill="none">
          <path d="M24 4C12.95 4 4 12.95 4 24c0 3.6.97 7.0 2.65 9.93L4 44l10.34-2.63A19.87 19.87 0 0024 44c11.05 0 20-8.95 20-20S35.05 4 24 4z" fill="white" fillOpacity="0.95" />
          <path d="M17.5 14.5c-.5-1.2-1.1-1.22-1.6-1.24-.41-.02-.88-.02-1.35-.02-.47 0-1.23.18-1.87.9-.64.73-2.44 2.38-2.44 5.81s2.5 6.74 2.85 7.2c.35.47 4.85 7.77 11.95 10.56 5.92 2.34 7.12 1.88 8.4 1.76 1.28-.12 4.12-1.68 4.7-3.31.58-1.63.58-3.03.41-3.32-.17-.29-.64-.47-1.34-.82-.7-.35-4.12-2.03-4.76-2.26-.64-.23-1.1-.35-1.57.35-.47.7-1.81 2.26-2.22 2.73-.41.47-.82.52-1.52.17-.7-.35-2.97-1.1-5.66-3.5-2.09-1.87-3.5-4.17-3.91-4.87-.41-.7-.04-1.08.31-1.42.32-.32.7-.82 1.05-1.24.35-.41.47-.7.7-1.17.23-.47.12-.88-.06-1.23-.17-.35-1.55-3.79-2.14-5.19z" fill="#25d366" />
        </svg>
      </button>

      {/* ── Sandbox Modal ── */}
      {modalOpen && (
        <div
          className="modal-backdrop fixed inset-0 z-[200] flex items-center justify-center
                               p-0 md:p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
        >
          <div
            className="modal-box flex flex-col bg-[#0d1a12] border border-[#1a2e22]
                                   relative overflow-hidden
                                   w-full h-full rounded-none
                                   md:rounded-2xl md:max-w-4xl md:h-[88vh]"
          >
            {/* Top bar */}
            <div className="flex items-center justify-end gap-2 px-4 py-3
                                        border-b border-[#1a2e22] flex-shrink-0">
              <Link
                href="/sandbox"
                className="open-page-link flex items-center gap-1.5 h-8 px-3
                                           bg-[#1a2e22] rounded-2xl text-[#86b09a] text-xs font-medium
                                           no-underline transition-colors duration-150"
              >
                ↗ Full page
              </Link>
              <button
                onClick={() => setModalOpen(false)}
                className="modal-close flex items-center justify-center w-8 h-8
                                           rounded-full bg-[#1a2e22] text-[#86b09a] text-lg border-none
                                           cursor-pointer transition-colors duration-150 leading-none"
              >
                ×
              </button>
            </div>

            {/* Sandbox iframe */}
            <iframe
              src="/sandbox"
              className="flex-1 border-none w-full"
              title="WhatsApp Sandbox"
            />
          </div>
        </div>
      )}
    </>
  );
}