const navLinks = Array.from(document.querySelectorAll("nav .chip"));
const themeToggleButton = document.querySelector("[data-theme-toggle]");
const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");

navLinks.forEach((link) => {
  link.dataset.baseHref = (link.getAttribute("href") || "").split("?")[0];
});

const CAMPAIGN_STORAGE_KEY = "campaignParams:v1";
const CAMPAIGN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const CAMPAIGN_ALLOWED_KEYS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "source_platform",
  "creative_format",
  "marketing_tactic",
  "gclid",
  "fbclid",
  "msclkid"
]);
const CAMPAIGN_MAX_VALUE_LENGTH = 200;

const normalizeCampaignKey = (key) => String(key || "").trim().toLowerCase();

const isAllowedCampaignKey = (key) => {
  if (!key) return false;
  return CAMPAIGN_ALLOWED_KEYS.has(key);
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
  if (/^https?:\/\//i.test(value)) {
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
  return nextQuery ? `${path}?${nextQuery}${hash}` : `${path}${hash}`;
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
  if (queryLang && typeof i18n !== 'undefined' && i18n[queryLang]) return queryLang;
  try {
    const savedLang = window.localStorage.getItem("preferredLang");
    if (savedLang && typeof i18n !== 'undefined' && i18n[savedLang]) return savedLang;
  } catch (e) {
    // Ignore storage access errors.
  }
  return typeof i18n !== 'undefined' && i18n[document.documentElement.lang] ? document.documentElement.lang : "ko";
};

window.addEventListener('DOMContentLoaded', () => {
  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      const currentTheme = getResolvedTheme();
      if (typeof startThemeTransition === 'function') startThemeTransition();
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = nextTheme;
      try {
        window.localStorage.setItem("preferredTheme", nextTheme);
      } catch (e) {}
      syncThemeToggle();
    });
  }
  if (darkMedia.addEventListener) {
    darkMedia.addEventListener("change", () => {
      if (!document.documentElement.dataset.theme) syncThemeToggle();
    });
  }
  storeCampaignParams(window.location.search);
  applyStoredTheme();
  syncThemeToggle();
});
