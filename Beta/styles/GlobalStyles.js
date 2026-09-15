/* =========================================================================
   Das komplette CSS-Design der App (Farben, Schrift, Dark/Light Mode) als React-Komponente.
   Teil der Modul-Aufteilung von app.js (siehe PROJECT_MAP.md).
   ========================================================================= */

import React from "https://esm.sh/react@18.3.1";

export function GlobalStyles() {
    return (React.createElement("style", null, `
      @import url('https://fonts.googleapis.com/css2?family=Anton&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap');

      .ff-root {
        --bg: #0a0a0a;
        --bg-card: #121212;
        --bg-card-hover: #171717;
        --border: #262626;
        --border-light: #333333;
        --accent: #d4ff00;
        --accent-dim: rgba(212,255,0,0.12);
        --text: #ffffff;
        --text-dim: #8f8f8f;
        --text-faint: #565656;
        --danger: #ff5c5c;
        --danger-dim: rgba(255,92,92,0.12);
        /* Zusätzliche "Oberflächen"-Töne für Eingabefelder, Popups und
           aktive Tabs - eine Ebene dunkler/heller als die normale Karte. */
        --surface-1: #0d0d0d;
        --surface-2: #0e0e0e;
        --surface-3: #1a1a1a;
        /* Hintergrund der Kopfzeile (Menüreiter) - eigene Variable, damit sie
           im Light Mode mitgeändert werden kann (siehe .theme-light unten). */
        --nav-bg: rgba(10,10,10,0.92);
        font-family: 'Inter', sans-serif;
        background: var(--bg);
        color: var(--text);
        min-height: 100vh;
        width: 100%;
      }

      /* HELLES DESIGN (Light Mode) - aktiv, sobald zusätzlich zu "ff-root" die
         Klasse "theme-light" gesetzt ist (Sonne/Mond-Button oben rechts).
         Überschreibt dieselben Variablen mit hellen Farbtönen - der Rest der
         App merkt nichts davon, weil überall mit var(--...) gearbeitet wird. */
      .ff-root.theme-light {
        --bg: #f2f2ee;
        --bg-card: #ffffff;
        --bg-card-hover: #ececE7;
        --border: #dedcd6;
        --border-light: #c7c4bc;
        --accent: #6f9a00;
        --accent-dim: rgba(111,154,0,0.10);
        --text: #14140f;
        --text-dim: #5c5a52;
        --text-faint: #949086;
        --danger: #c62828;
        --danger-dim: rgba(198,40,40,0.08);
        --surface-1: #f7f7f3;
        --surface-2: #ffffff;
        --surface-3: #e9e8e2;
        --nav-bg: rgba(242,242,238,0.92);
      }
      /* Der Glitch/RGB-Split-Effekt der Überschriften braucht einen dunklen
         Hintergrund (mix-blend-mode "screen"), um sichtbar zu sein - im
         Light Mode blenden wir ihn deshalb aus. */
      .ff-root.theme-light .glitch .gl-a,
      .ff-root.theme-light .glitch .gl-b { display: none; }
      .ff-root * { box-sizing: border-box; }
      .ff-mono { font-family: 'JetBrains Mono', monospace; }
      .ff-display { font-family: 'Anton', sans-serif; text-transform: uppercase; letter-spacing: -0.01em; line-height: 0.95; }

      .ff-eyebrow {
        font-family: 'JetBrains Mono', monospace;
        font-size: 11px;
        letter-spacing: 0.15em;
        color: var(--text-dim);
        text-transform: uppercase;
        margin: 0 0 6px 0;
      }

      .glitch { position: relative; display: inline-block; color: var(--text); }
      .glitch .gl-a, .glitch .gl-b {
        position: absolute; left: 0; top: 0; width: 100%; height: 100%;
        overflow: hidden; mix-blend-mode: screen;
      }
      .glitch .gl-a { color: #00fff9; transform: translate(-2px,0); opacity: 0.55; clip-path: polygon(0 0,100% 0,100% 45%,0 45%); }
      .glitch .gl-b { color: #ff00c1; transform: translate(2px,0); opacity: 0.55; clip-path: polygon(0 55%,100% 55%,100% 100%,0 100%); }

      .ff-accent { color: var(--accent); }

      .ff-nav {
        position: sticky; top: 0; z-index: 20;
        display: flex; align-items: center; justify-content: space-between;
        gap: 16px; padding: 14px 24px;
        background: var(--nav-bg); backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--border);
        flex-wrap: wrap;
      }
      .ff-logo { display: flex; align-items: center; gap: 10px; }
      .ff-logo-img { width: 34px; height: 34px; border-radius: 8px; flex-shrink: 0; object-fit: cover; }
      .ff-logo-mark {
        width: 34px; height: 34px; border-radius: 8px; background: var(--accent);
        display: flex; align-items: center; justify-content: center; color: #0a0a0a; flex-shrink: 0;
      }
      .ff-logo-word { font-family: 'Anton', sans-serif; font-size: 17px; letter-spacing: 0.01em; white-space: nowrap; }
      .ff-logo-word .hi { color: var(--accent); }
      @media (max-width: 560px) { .ff-logo-word { font-size: 14px; } }

      .ff-tabs { display: flex; gap: 4px; overflow-x: auto; scrollbar-width: none; }
      .ff-tabs::-webkit-scrollbar { display: none; }
      .ff-tab {
        display: flex; align-items: center; gap: 7px; padding: 9px 14px; border-radius: 8px;
        font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.06em;
        text-transform: uppercase; color: var(--text-dim); background: transparent; border: 1px solid transparent;
        cursor: pointer; white-space: nowrap; transition: all 0.15s ease;
      }
      .ff-tab:hover { color: var(--text); background: var(--bg-card-hover); }
      .ff-tab.active { color: var(--text); background: var(--surface-3); border-color: var(--border-light); }
      .ff-tab.active svg { color: var(--accent); }

      .ff-tag-note { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-faint); letter-spacing: 0.08em; }

      .ff-main { max-width: 1100px; margin: 0 auto; padding: 32px 24px 80px; }

      .ff-card {
        background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 20px;
      }

      .ff-btn {
        font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase;
        padding: 11px 18px; border-radius: 8px; border: 1px solid var(--border-light); background: transparent;
        color: var(--text); cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
        transition: all 0.15s ease; white-space: nowrap;
      }
      .ff-btn:hover { background: var(--bg-card-hover); border-color: #444; }
      .ff-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      .ff-btn-primary { background: var(--accent); border-color: var(--accent); color: #0a0a0a; font-weight: 700; }
      .ff-btn-primary:hover { background: #c2ec00; }
      .ff-btn-danger { border-color: var(--danger); color: var(--danger); }
      .ff-btn-danger:hover { background: var(--danger-dim); }
      .ff-btn-icon { padding: 8px; }
      .ff-btn-sm { padding: 7px 12px; font-size: 11px; }

      .ff-input, .ff-textarea, .ff-numinput {
        width: 100%; background: var(--surface-1); border: 1px solid var(--border); border-radius: 8px;
        color: var(--text); padding: 12px 14px; font-family: 'Inter', sans-serif; font-size: 14px;
        outline: none; transition: border-color 0.15s ease;
      }
      .ff-input:focus, .ff-textarea:focus, .ff-numinput:focus { border-color: var(--accent); }
      .ff-input::placeholder, .ff-textarea::placeholder { color: var(--text-faint); }
      .ff-textarea { resize: vertical; min-height: 70px; }
      .ff-numinput { text-align: center; padding: 10px 8px; }

      .ff-input-display {
        width: 100%; background: transparent; border: none; border-bottom: 1px solid var(--border);
        color: var(--text); padding: 10px 2px; font-family: 'Anton', sans-serif; text-transform: uppercase;
        font-size: 34px; outline: none; letter-spacing: -0.01em;
      }
      .ff-input-display::placeholder { color: #3a3a3a; }
      .ff-input-display:focus { border-bottom-color: var(--accent); }

      .ff-field-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--text-faint); text-transform: uppercase; margin-bottom: 6px; display: block; }

      .ff-tagbtn {
        font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.04em;
        padding: 8px 13px; border-radius: 20px; border: 1px solid var(--border-light); background: var(--surface-1);
        color: var(--text-dim); cursor: pointer; transition: all 0.15s ease;
      }
      .ff-tagbtn:hover { border-color: #555; }
      .ff-tagbtn.selected { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }

      .ff-equip-card {
        background: var(--bg-card); border: 1px solid var(--border); border-radius: 10px; padding: 16px;
        cursor: pointer; position: relative; transition: all 0.15s ease;
      }
      .ff-equip-card:hover { border-color: #444; }
      .ff-equip-card.selected { border-color: var(--accent); background: var(--accent-dim); }
      .ff-equip-check {
        position: absolute; top: 12px; right: 12px; width: 20px; height: 20px; border-radius: 50%;
        background: var(--accent); color: #0a0a0a; display: flex; align-items: center; justify-content: center;
      }

      .ff-stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
      @media (max-width: 720px) { .ff-stat-grid { grid-template-columns: repeat(2, 1fr); } }

      .ff-empty {
        text-align: center; padding: 60px 20px; color: var(--text-dim);
        border: 1px dashed var(--border-light); border-radius: 12px;
      }

      .ff-modal-backdrop {
        position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(3px);
        display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px;
      }
      .ff-modal {
        background: var(--surface-2); border: 1px solid var(--border-light); border-radius: 14px; padding: 28px;
        max-width: 560px; width: 100%; max-height: 85vh; overflow-y: auto;
      }

      .ff-detail-grid { display: grid; grid-template-columns: 200px 1fr; gap: 32px; }
      @media (max-width: 640px) { .ff-detail-grid { grid-template-columns: 1fr; } }

      .ff-checkbox {
        width: 22px; height: 22px; border-radius: 6px; border: 1px solid var(--border-light);
        background: var(--surface-1); display: flex; align-items: center; justify-content: center; cursor: pointer;
        flex-shrink: 0; transition: all 0.15s ease;
      }
      .ff-checkbox.checked { background: var(--accent); border-color: var(--accent); color: #0a0a0a; }

      .ff-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
      .ff-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

      .ff-rest-bar {
        position: fixed; left: 0; right: 0; bottom: 0; z-index: 150;
        background: var(--surface-2); border-top: 1px solid var(--border-light);
        padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; gap: 16px;
        box-shadow: 0 -8px 24px rgba(0,0,0,0.5); overflow: hidden; transition: bottom 0.15s ease;
      }
      .ff-rest-progress {
        position: absolute; top: 0; left: 0; height: 3px; background: var(--accent);
        transition: width 1s linear;
      }
      @keyframes restFlash { 0% { opacity: 0; } 12% { opacity: 0.4; } 100% { opacity: 0; } }
      .ff-flash-overlay {
        position: fixed; inset: 0; background: var(--accent); pointer-events: auto; cursor: pointer;
        z-index: 300; animation: restFlash 1s ease-out forwards;
      }

      .ff-scrolltop {
        position: fixed; right: 20px; bottom: 24px; z-index: 140;
        width: 44px; height: 44px; border-radius: 50%; border: none;
        background: var(--accent); color: #0a0a0a; display: flex; align-items: center; justify-content: center;
        cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.5); transition: transform 0.15s ease;
      }
      .ff-scrolltop:active { transform: scale(0.92); }
    `));
}
// Große Überschrift mit dem "Glitch"-Texteffekt (leichter Farbversatz wie
// bei einem gestörten Bildschirm) — wird für alle Seitentitel verwendet.
