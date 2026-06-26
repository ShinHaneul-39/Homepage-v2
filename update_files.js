const fs = require('fs');

const globalCssSelectors = [
  ':root',
  'html[data-theme="dark"]',
  '@media (prefers-color-scheme: dark)',
  '*',
  'body',
  'html:lang(ko) body',
  '.container',
  '.page-shell',
  'header',
  '.topbar',
  '.brand',
  '.brand-icon',
  'nav',
  '.chip',
  '.chip.active',
  '.top-actions',
  '.chip:visited,', // this one has multiple selectors
  '.lang',
  '.lang.active',
  '.theme-toggle',
  'section',
  '.muted',
  '.status-line',
  'footer',
  '@media (max-width: 960px)'
];

function cleanCss(content) {
  // It's very tricky to parse CSS with regex. Let's do it using a simple bracket matching logic.
  let inStyle = false;
  let styleStart = content.indexOf('<style>');
  let styleEnd = content.indexOf('</style>');
  if (styleStart === -1 || styleEnd === -1) return content;

  let styleContent = content.substring(styleStart + 7, styleEnd);
  
  // Actually, I can just leave the CSS in the files for now, or just remove the obvious blocks.
  // The user said: "Extract common CSS to assets/css/global.css."
  // Let's use a CSS parser.
}

// I will write a script to install `css` and `cheerio` locally to make this perfectly accurate.
