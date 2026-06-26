const fs = require('fs');
const path = require('path');

const files = ['index.html', 'career.html', 'blog.html', 'contact.html'];

// 1. Create global.css and global.js directories
if (!fs.existsSync('assets/css')) fs.mkdirSync('assets/css', { recursive: true });
if (!fs.existsSync('assets/js')) fs.mkdirSync('assets/js', { recursive: true });

// 2. Define global.css content (Unified from all files)
const globalCss = `:root {
  --bg: #f5fbff;
  --ink: #13212d;
  --ink-soft: #425161;
  --line: #d9ebf8;
  --brand: #87ceeb;
  --card: rgba(255, 255, 255, 0.84);
  --shadow: 0 12px 40px rgba(20, 67, 102, 0.12);
  --bg-radial-1: #c8ebfb;
  --bg-radial-2: #e7f7ff;
  --header-border: #ffffff8c;
  --header-bg-a: #f6fcffe8;
  --header-bg-b: #f6fcffcc;
  --surface: #ffffff;
  --surface-soft: #ffffffd4;
  --chip-active-bg: #e7f6ff;
  --chip-active-line: #9fc9e4;
  --footer-ink: #557085;
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
  --surface-soft: #1f2f3d;
  --chip-active-bg: #223648;
  --chip-active-line: #3f5870;
  --footer-ink: #9db0c1;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
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
    --surface-soft: #1f2f3d;
    --chip-active-bg: #223648;
    --chip-active-line: #3f5870;
    --footer-ink: #9db0c1;
  }
  :root:not([data-theme]) .lang.active {
    color: rgb(19, 33, 45);
  }
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: "Quicksand", "Noto Sans KR", sans-serif;
  color: var(--ink);
  line-height: 1.6;
  background:
    radial-gradient(circle at 20% -20%, var(--bg-radial-1) 0%, transparent 40%),
    radial-gradient(circle at 90% 0%, var(--bg-radial-2) 0%, transparent 36%),
    var(--bg);
}

html:lang(ko) body {
  font-family: "Gowun Dodum", "Noto Sans KR", sans-serif;
}

.container {
  width: min(1120px, 92%);
  margin: 0 auto;
}

.page-shell {
  flex: 1;
  padding: 2rem 0 2.4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--header-border);
  background: linear-gradient(180deg, var(--header-bg-a), var(--header-bg-b));
}

.topbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 14px 0;
  gap: 0.8rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: "Gowun Dodum", "Playfair Display", serif;
  font-size: 1.15rem;
  letter-spacing: 0.02em;
}

.brand-icon {
  display: inline-block;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  border: 1px solid var(--line);
  object-fit: cover;
  background: var(--surface-soft);
}

nav {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
  grid-column: 2;
  justify-self: center;
}

.chip {
  text-decoration: none;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.44rem 0.78rem;
  background: var(--surface);
  color: var(--ink);
  font-size: 0.85rem;
  font-family: "Quicksand", "Noto Sans KR", sans-serif;
}

.chip.active {
  background: var(--chip-active-bg);
  border-color: var(--chip-active-line);
}

.top-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  grid-column: 3;
  justify-self: end;
}

.chip:visited,
.chip:hover,
.chip:active {
  color: var(--ink);
  text-decoration: none;
}

.lang {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.42rem 0.72rem;
  background: var(--surface);
  color: var(--ink);
  cursor: pointer;
}

.lang.active {
  background: linear-gradient(135deg, var(--brand), #d9f2ff);
}

html[data-theme="dark"] .lang.active {
  color: rgb(19, 33, 45);
}

.theme-toggle {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.42rem 0.72rem;
  background: var(--surface);
  color: var(--ink);
  cursor: pointer;
  font-size: 0.82rem;
}

section {
  margin: 0;
  background: var(--card);
  border: 1px solid var(--surface);
  border-radius: 18px;
  box-shadow: var(--shadow);
  padding: 1.1rem;
}

.muted {
  color: var(--ink-soft);
  font-size: 0.92rem;
  margin: 0;
}

.status-line {
  margin: 0;
  font-size: 0.92rem;
  color: var(--ink-soft);
  border: 1px dashed var(--line);
  background: var(--surface-soft);
  border-radius: 12px;
  padding: 0.58rem 0.72rem;
}

footer {
  text-align: center;
  color: var(--footer-ink);
  padding: 1.5rem 0 2.2rem;
}

@media (max-width: 960px) {
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
`;

fs.writeFileSync('assets/css/global.css', globalCss);

// 3. Define global.js content (Unified from all files)
const globalJs = `const navLinks = Array.from(document.querySelectorAll("nav .chip"));
const themeToggleButton = document.querySelector("[data-theme-toggle]");
const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");

navLinks.forEach((link) => {
  link.dataset.baseHref = (link.getAttribute("href") || "").split("?")[0];
});

const CAMPAIGN_STORAGE_KEY = "campaignParams:v1";
const CAMPAIGN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const CAMPAIGN_CLICK_ID_KEYS = new Set(["gclid", "fbclid", "msclkid"]);
const CAMPAIGN_MAX_VALUE_LENGTH = 200;

const normalizeCampaignKey = (key) => String(key || "").trim().toLowerCase();

const isAllowedCampaignKey = (key) => {
  if (!key) return false;
  if (key.startsWith("utm_")) return true;
  if (key === "source_platform" || key === "creative_format" || key === "marketing_tactic") return true;
  return CAMPAIGN_CLICK_ID_KEYS.has(key);
};

const getSafeCampaignValue = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw.length > CAMPAIGN_MAX_VALUE_LENGTH) return "";
  return raw;
};

const extractCampaignParams = (search) => {
  const query = new URLSearchParams(search || "");
  const result = {};
  for (const [rawKey, rawValue] of query.entries()) {
    const key = normalizeCampaignKey(rawKey);
    if (!isAllowedCampaignKey(key)) continue;
    const value = getSafeCampaignValue(rawValue);
    if (!value) continue;
    result[key] = value;
  }
  return result;
};

const storeCampaignParams = (search) => {
  const nextParams = extractCampaignParams(search);
  if (Object.keys(nextParams).length === 0) return;
  try {
    const existingParams = loadCampaignParams();
    const mergedParams = { ...existingParams, ...nextParams };
    window.localStorage.setItem(
      CAMPAIGN_STORAGE_KEY,
      JSON.stringify({ storedAt: Date.now(), params: mergedParams })
    );
  } catch (error) {}
};

const loadCampaignParams = () => {
  try {
    const raw = window.localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return {};
    const storedAt = Number(data.storedAt || 0);
    if (!storedAt || Date.now() - storedAt > CAMPAIGN_TTL_MS) {
      window.localStorage.removeItem(CAMPAIGN_STORAGE_KEY);
      return {};
    }
    const params = data.params && typeof data.params === "object" ? data.params : {};
    const sanitized = {};
    Object.keys(params).forEach((rawKey) => {
      const key = normalizeCampaignKey(rawKey);
      if (!isAllowedCampaignKey(key)) return;
      const value = getSafeCampaignValue(params[rawKey]);
      if (value) sanitized[key] = value;
    });
    return sanitized;
  } catch (error) {
    return {};
  }
};

const shouldSkipHrefMerge = (href) => {
  const value = String(href || "").trim();
  if (!value) return true;
  if (value.startsWith("#")) return true;
  if (/^(mailto:|tel:|javascript:|data:)/i.test(value)) return true;
  if (value.startsWith("//")) return true;
  const schemeMatch = value.match(/^([a-z][a-z0-9+.-]*):/i);
  if (schemeMatch && !/^https?:/i.test(value)) return true;
  if (/^https?:\\/\\//i.test(value)) {
    try {
      const url = new URL(value);
      if (url.origin !== window.location.origin) return true;
    } catch (error) {
      return true;
    }
  }
  return false;
};

const mergeParamsIntoHref = (href, nextParams) => {
  if (shouldSkipHrefMerge(href)) return href;
  const original = String(href);
  const hashIndex = original.indexOf("#");
  const hash = hashIndex >= 0 ? original.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? original.slice(0, hashIndex) : original;
  const queryIndex = withoutHash.indexOf("?");
  const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "";
  const params = new URLSearchParams(query);
  Object.keys(nextParams || {}).forEach((key) => {
    const value = nextParams[key];
    if (value === undefined || value === null || value === "") return;
    params.set(key, String(value));
  });
  const nextQuery = params.toString();
  return nextQuery ? \`\${path}?\${nextQuery}\${hash}\` : \`\${path}\${hash}\`;
};

const getResolvedTheme = () => {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "dark" || explicit === "light") return explicit;
  return darkMedia.matches ? "dark" : "light";
};

const syncThemeToggle = () => {
  if (!themeToggleButton) return;
  const isDark = getResolvedTheme() === "dark";
  themeToggleButton.textContent = isDark ? "Light" : "Dark";
  themeToggleButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggleButton.setAttribute("aria-pressed", String(isDark));
};

const applyStoredTheme = () => {
  try {
    const savedTheme = window.localStorage.getItem("preferredTheme");
    if (savedTheme === "dark" || savedTheme === "light") {
      document.documentElement.dataset.theme = savedTheme;
    }
  } catch (e) {
    // Ignore storage access errors.
  }
};

let themeTransitionTimer = null;
const startThemeTransition = () => {
  document.documentElement.classList.add("theme-transitioning");
  if (themeTransitionTimer) window.clearTimeout(themeTransitionTimer);
  const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 260;
  themeTransitionTimer = window.setTimeout(() => {
    document.documentElement.classList.remove("theme-transitioning");
    themeTransitionTimer = null;
  }, duration);
};

const syncNavLang = (lang) => {
  const storedCampaignParams = loadCampaignParams();
  const currentCampaignParams = extractCampaignParams(window.location.search);
  const merged = { lang, ...storedCampaignParams, ...currentCampaignParams };
  navLinks.forEach((link) => {
    const baseHref = link.dataset.baseHref || "./index.html";
    link.setAttribute("href", mergeParamsIntoHref(baseHref, merged));
  });
  document.querySelectorAll("[data-lang-link]").forEach((link) => {
    const baseHref = link.dataset.langLink || "./index.html";
    link.setAttribute("href", mergeParamsIntoHref(baseHref, merged));
  });
};

const getInitialLang = () => {
  const queryLang = new URLSearchParams(window.location.search).get("lang");
  if (queryLang && window.i18n && window.i18n[queryLang]) return queryLang;
  try {
    const savedLang = window.localStorage.getItem("preferredLang");
    if (savedLang && window.i18n && window.i18n[savedLang]) return savedLang;
  } catch (e) {
    // Ignore storage access errors.
  }
  return window.i18n && window.i18n[document.documentElement.lang] ? document.documentElement.lang : "ko";
};

// Global Event Listeners setup
if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    const currentTheme = getResolvedTheme();
    if (typeof startThemeTransition === "function") startThemeTransition();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      window.localStorage.setItem("preferredTheme", nextTheme);
    } catch (e) {
      // Ignore storage access errors.
    }
    syncThemeToggle();
  });
}
if (darkMedia.addEventListener) {
  darkMedia.addEventListener("change", () => {
    if (!document.documentElement.dataset.theme) syncThemeToggle();
  });
}

document.querySelectorAll(".lang").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (typeof window.setLang === "function") {
      window.setLang(btn.dataset.lang);
    }
  });
});

// Run initial logic
storeCampaignParams(window.location.search);
applyStoredTheme();
syncThemeToggle();
`;

fs.writeFileSync('assets/js/global.js', globalJs);
