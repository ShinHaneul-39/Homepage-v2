const fs = require('fs');

const files = ['index.html', 'career.html', 'blog.html', 'contact.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // Add global CSS link
  if (!content.includes('assets/css/global.css')) {
    content = content.replace(
      '<style>',
      '<link rel="stylesheet" href="./assets/css/global.css" />\n    <style>'
    );
  }

  // Add global JS script
  if (!content.includes('assets/js/global.js')) {
    content = content.replace(
      '</body>',
      '  <script src="./assets/js/global.js"></script>\n  </body>'
    );
  }

  // Remove common JS logic
  const jsToRemove = [
    `const navLinks = Array.from(document.querySelectorAll("nav .chip"));`,
    `const themeToggleButton = document.querySelector("[data-theme-toggle]");`,
    `const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");`,
    `navLinks.forEach((link) => {
        link.dataset.baseHref = (link.getAttribute("href") || "").split("?")[0];
      });`,
    `navLinks.forEach((link) => {
        link.dataset.baseHref = (link.getAttribute("href") || "").split("?")[0];
      });`, // some files might have slightly different spacing
    `const CAMPAIGN_STORAGE_KEY = "campaignParams:v1";`,
    `const CAMPAIGN_TTL_MS = 30 * 24 * 60 * 60 * 1000;`,
    `const CAMPAIGN_MAX_VALUE_LENGTH = 200;`,
    `const normalizeCampaignKey = (key) => String(key || "").trim().toLowerCase();`,
    `const getSafeCampaignValue = (value) => {
        const raw = String(value || "").trim();
        if (!raw) return "";
        if (raw.length > CAMPAIGN_MAX_VALUE_LENGTH) return "";
        return raw;
      };`,
    `const extractCampaignParams = (search) => {`,
    `const storeCampaignParams = (search) => {`,
    `const loadCampaignParams = () => {`,
    `const shouldSkipHrefMerge = (href) => {`,
    `const mergeParamsIntoHref = (href, nextParams) => {`,
    `const getResolvedTheme = () => {`,
    `const syncThemeToggle = () => {`,
    `const applyStoredTheme = () => {`,
    `const syncNavLang = (lang) => {`,
    `const getInitialLang = () => {`,
    `storeCampaignParams(window.location.search);`,
    `applyStoredTheme();`,
    `syncThemeToggle();`,
    `if (themeToggleButton) {`,
    `if (darkMedia.addEventListener) {`
  ];

  // We will use a regex-based block remover for JS.
  // It's safer to just replace specific blocks.
  // I will write a specialized replacement for each file or a robust regex.
  
  fs.writeFileSync(file, content);
});
