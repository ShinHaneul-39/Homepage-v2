import fs from 'fs';

const file = 'scripts/build-blog.mjs';
let content = fs.readFileSync(file, 'utf-8');

const oldStyle = `<style>
      :root {
        --bg: #f5fbff;
        --ink: #13212d;
        --ink-soft: #425161;
        --line: #d9ebf8;
        --brand: #87ceeb;
        --brand-strong: #5aaed6;
        --card: rgba(255, 255, 255, 0.8);
        --shadow: 0 12px 40px rgba(20, 67, 102, 0.12);
        --bg-radial-1: #c8ebfb;
        --bg-radial-2: #e7f7ff;
        --header-border: #ffffff8c;
        --header-bg-a: #f6fcffe8;
        --header-bg-b: #f6fcffcc;
        --surface: #ffffff;
        --surface-soft: #ffffffba;
        --chip-active-bg: #e7f6ff;
        --chip-active-line: #9fc9e4;
      }
      html[data-theme="dark"] {
        color-scheme: dark;
        --bg: #0f151b;
        --ink: #e9f2fa;
        --ink-soft: #b5c4d2;
        --line: #2d3d4c;
        --card: rgba(20, 29, 38, 0.82);
        --shadow: 0 16px 38px rgba(0, 0, 0, 0.45);
        --bg-radial-1: #1e3345;
        --bg-radial-2: #233646;
        --header-border: #273748cc;
        --header-bg-a: #111a24ee;
        --header-bg-b: #111a24d8;
        --surface: #1b2733;
        --surface-soft: #203140;
        --chip-active-bg: #223648;
        --chip-active-line: #3f5870;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        font-family: "Noto Sans KR", sans-serif;
        color: var(--ink);
        line-height: 1.6;
        background:
          radial-gradient(circle at 20% -20%, var(--bg-radial-1) 0%, transparent 40%),
          radial-gradient(circle at 90% 0%, var(--bg-radial-2) 0%, transparent 36%),
          var(--bg);
      }
      .grain::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.14;
        background-image: radial-gradient(#a7d0e61a 1px, transparent 1px);
        background-size: 4px 4px;
      }
      .container {
        width: min(1120px, 92%);
        margin: 0 auto;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 20;
        border-bottom: 1px solid var(--header-border);
        background: linear-gradient(180deg, var(--header-bg-a), var(--header-bg-b));
      }
      .topbar {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 0.8rem;
        padding: 14px 0;
      }
      .brand {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 1.15rem;
      }
      .brand-icon {
        width: 1.8rem;
        height: 1.8rem;
        border-radius: 50%;
        border: 1px solid var(--line);
        object-fit: cover;
        background: var(--surface-soft);
      }
      nav,
      .top-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      nav {
        grid-column: 2;
        justify-self: center;
      }
      .top-actions {
        grid-column: 3;
        justify-self: end;
      }
      .chip,
      .lang,
      .theme-toggle {
        border: 1px solid var(--line);
        border-radius: 999px;
        background: var(--surface);
        color: var(--ink);
        padding: 0.42rem 0.74rem;
        font-size: 0.85rem;
        text-decoration: none;
        cursor: pointer;
      }
      .chip.active {
        background: var(--chip-active-bg);
        border-color: var(--chip-active-line);
      }
      .lang.active {
        background: linear-gradient(135deg, var(--brand), #d9f2ff);
        color: #13212d;
      }
      main {
        flex: 1;
        padding: 1rem 0 2rem;
      }
      .hero {
        margin-top: 0.3rem;
        background: var(--card);
        border: 1px solid var(--surface);
        border-radius: 22px;
        box-shadow: var(--shadow);
        padding: 1.2rem;
      }
      .hero-meta {
        margin: 0;
        color: var(--ink-soft);
        font-size: 0.9rem;
      }
      .hero-main h1 {
        margin: 0.35rem 0 0.45rem;
        font-size: clamp(1.8rem, 3.4vw, 2.8rem);
        line-height: 1.1;
      }
      .hero-main p {
        max-width: 62ch;
        color: var(--ink-soft);
      }
      article {
        margin-top: 1rem;
        background: var(--card);
        border: 1px solid var(--surface);
        border-radius: 16px;
        box-shadow: var(--shadow);
        padding: 1.05rem;
      }
      .muted {
        color: var(--ink-soft);
      }
      .lang-content {
        display: none;
        margin-top: 1rem;
      }
      .lang-content.active {
        display: block;
      }
      code {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      pre {
        background: #0f1720;
        color: #eef4fa;
        border-radius: 10px;
        padding: 0.8rem;
        overflow: auto;
      }
      ul {
        padding-left: 1.25rem;
      }
      .back {
        display: inline-block;
        margin-top: 1rem;
        color: var(--ink);
      }
      footer {
        text-align: center;
        padding: 1.4rem 0 2rem;
        color: #5b7488;
      }
      @media (max-width: 900px) {
        .topbar {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        nav {
          width: 100%;
          justify-content: center;
        }
      }
    </style>`;

const newStyle = `<link rel="stylesheet" href="../assets/css/global.css" />
    <style>
      main {
        flex: 1;
        padding: 1rem 0 2rem;
      }
      .hero {
        margin-top: 0.3rem;
        background: var(--card);
        border: 1px solid var(--surface);
        border-radius: 22px;
        box-shadow: var(--shadow);
        padding: 1.2rem;
      }
      .hero-meta {
        margin: 0;
        color: var(--ink-soft);
        font-size: 0.9rem;
      }
      .hero-main h1 {
        margin: 0.35rem 0 0.45rem;
        font-size: clamp(1.8rem, 3.4vw, 2.8rem);
        line-height: 1.1;
      }
      .hero-main p {
        max-width: 62ch;
        color: var(--ink-soft);
      }
      article {
        margin-top: 1rem;
        background: var(--card);
        border: 1px solid var(--surface);
        border-radius: 16px;
        box-shadow: var(--shadow);
        padding: 1.05rem;
      }
      .muted {
        color: var(--ink-soft);
      }
      .lang-content {
        display: none;
        margin-top: 1rem;
      }
      .lang-content.active {
        display: block;
      }
      code {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      pre {
        background: #0f1720;
        color: #eef4fa;
        border-radius: 10px;
        padding: 0.8rem;
        overflow: auto;
      }
      ul {
        padding-left: 1.25rem;
      }
      .back {
        display: inline-block;
        margin-top: 1rem;
        color: var(--ink);
      }
      @media (max-width: 900px) {
        .topbar {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        nav {
          width: 100%;
          justify-content: center;
        }
      }
    </style>`;

content = content.replace(oldStyle, newStyle);

const oldScript = `const themeToggleButton = document.querySelector("[data-theme-toggle]");
      const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
      const params = new URLSearchParams(window.location.search);
      const storedLang = localStorage.getItem("preferredLang");
      const initialLang = ["ko", "en"].includes(params.get("lang")) ? params.get("lang") : (["ko", "en"].includes(storedLang) ? storedLang : "ko");

      const getResolvedTheme = () => {
        const explicit = document.documentElement.dataset.theme;
        if (explicit === "dark" || explicit === "light") return explicit;
        return darkMedia.matches ? "dark" : "light";
      };

      const syncThemeToggle = () => {
        if (!themeToggleButton) return;
        themeToggleButton.textContent = getResolvedTheme() === "dark" ? "Light" : "Dark";
      };

      const setLang = (lang) => {`;

const newScript = `const params = new URLSearchParams(window.location.search);
      const storedLang = localStorage.getItem("preferredLang");
      const initialLang = ["ko", "en"].includes(params.get("lang")) ? params.get("lang") : (["ko", "en"].includes(storedLang) ? storedLang : "ko");

      const setLang = (lang) => {`;

content = content.replace(oldScript, newScript);

const oldEvents = `document.querySelectorAll(".lang").forEach((button) => {
        button.addEventListener("click", () => setLang(button.dataset.lang));
      });
      if (themeToggleButton) {
        themeToggleButton.addEventListener("click", () => {
          const currentTheme = getResolvedTheme();
          document.documentElement.dataset.theme = currentTheme === "dark" ? "light" : "dark";
          syncThemeToggle();
        });
      }
      if (darkMedia.addEventListener) {
        darkMedia.addEventListener("change", () => {
          if (!document.documentElement.dataset.theme) syncThemeToggle();
        });
      }
      syncThemeToggle();
      setLang(initialLang);
    </script>
  </body>`;

const newEvents = `document.querySelectorAll(".lang").forEach((button) => {
        button.addEventListener("click", () => setLang(button.dataset.lang));
      });
      setLang(initialLang);
    </script>
    <script src="../assets/js/global.js"></script>
  </body>`;

content = content.replace(oldEvents, newEvents);

fs.writeFileSync(file, content);
console.log('Template fixed!');