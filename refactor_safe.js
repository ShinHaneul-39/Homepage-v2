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

  // JS Removals using regex for flexibility but specific to the blocks
  const navLinksMatch = content.match(/const navLinks = Array\.from\([\s\S]*?const getInitialLang = \(\) => \{[\s\S]*?\};\r?\n/);
  if (navLinksMatch) {
    content = content.replace(navLinksMatch[0], '');
  }

  const btnLangMatch = content.match(/document\.querySelectorAll\("\.lang"\)\.forEach\(\(btn\) =>[\s\S]*?\}\);\r?\n/);
  if (btnLangMatch) content = content.replace(btnLangMatch[0], '');
  
  const themeToggleMatch = content.match(/if\s*\(themeToggleButton\)\s*\{[\s\S]*?\}\r?\n\s*\}/);
  if (themeToggleMatch) content = content.replace(themeToggleMatch[0], '');

  const darkMediaMatch = content.match(/if\s*\(darkMedia\.addEventListener\)\s*\{[\s\S]*?\}\r?\n\s*\}/);
  if (darkMediaMatch) content = content.replace(darkMediaMatch[0], '');

  content = content.replace(/storeCampaignParams\(window\.location\.search\);\r?\n/g, '');
  content = content.replace(/applyStoredTheme\(\);\r?\n/g, '');
  content = content.replace(/syncThemeToggle\(\);\r?\n/g, '');
  content = content.replace(/setLang\(getInitialLang\(\)\);\r?\n/g, '');
  
  // Clean up any double blank lines inside the script tag if needed, but not strictly necessary.

  const cssBlocks = [
    `* {
        box-sizing: border-box;
      }`,
    `body {
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
      }`,
    `body {
        margin: 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        font-family: "Noto Sans KR", sans-serif;
        color: var(--ink);
        background: var(--bg);
      }`,
    `html:lang(ko) body {
        font-family: "Gowun Dodum", "Noto Sans KR", sans-serif;
      }`,
    `.container {
        width: min(1120px, 92%);
        margin: 0 auto;
      }`,
    `.page-shell {
        flex: 1;
        padding: 2rem 0 2.4rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }`,
    `header {
        position: sticky;
        top: 0;
        z-index: 20;
        backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--header-border);
        background: linear-gradient(180deg, var(--header-bg-a), var(--header-bg-b));
      }`,
    `header {
        position: sticky;
        top: 0;
        z-index: 20;
        border-bottom: 1px solid var(--header-border);
        background: linear-gradient(180deg, var(--header-bg-a), var(--header-bg-b));
      }`,
    `.topbar {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        padding: 14px 0;
        gap: 0.8rem;
      }`,
    `.brand {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        font-family: "Gowun Dodum", "Playfair Display", serif;
        font-size: 1.15rem;
        letter-spacing: 0.02em;
      }`,
    `.brand {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 1.15rem;
      }`,
    `.brand-icon {
        display: inline-block;
        width: 1.8rem;
        height: 1.8rem;
        border-radius: 50%;
        border: 1px solid var(--line);
        object-fit: cover;
        background: var(--surface-soft);
      }`,
    `.brand-icon {
        width: 1.8rem;
        height: 1.8rem;
        border-radius: 50%;
        border: 1px solid var(--line);
        object-fit: cover;
      }`,
    `nav {
        display: flex;
        gap: 0.55rem;
        flex-wrap: wrap;
        grid-column: 2;
        justify-self: center;
      }`,
    `.chip {
        text-decoration: none;
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 0.44rem 0.78rem;
        background: var(--surface);
        color: var(--ink);
        font-size: 0.85rem;
        font-family: "Quicksand", "Noto Sans KR", sans-serif;
      }`,
    `.chip.active {
        background: #e7f6ff;
        border-color: #9fc9e4;
      }`,
    `.chip.active {
        background: var(--chip-active-bg);
        border-color: var(--chip-active-line);
      }`,
    `.top-actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.35rem;
        grid-column: 3;
        justify-self: end;
      }`,
    `.top-actions {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        flex-wrap: wrap;
        grid-column: 3;
        justify-self: end;
      }`,
    `.chip:visited,
      .chip:hover,
      .chip:active {
        color: var(--ink);
        text-decoration: none;
      }`,
    `.lang {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 0.42rem 0.72rem;
        background: var(--surface);
        color: var(--ink);
        cursor: pointer;
      }`,
    `.lang.active {
        background: linear-gradient(135deg, var(--brand), #d9f2ff);
      }`,
    `.theme-toggle {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 0.42rem 0.72rem;
        background: var(--surface);
        color: var(--ink);
        cursor: pointer;
        font-size: 0.82rem;
      }`,
    `footer {
        padding: 1.5rem 0 2.2rem;
        text-align: center;
        color: var(--footer-ink);
      }`,
    `footer {
        text-align: center;
        color: var(--footer-ink);
        padding: 1.1rem 0 1.5rem;
      }`,
    `footer {
        text-align: center;
        color: var(--footer-ink);
        padding: 1.5rem 0 2.2rem;
      }`
  ];

  cssBlocks.forEach(block => {
    const regexStr = block.replace(/[.*+?^$\{}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    const regex = new RegExp(regexStr, 'g');
    content = content.replace(regex, '');
  });

  content = content.replace(/html\[data-theme="dark"\] \.lang\.active \{\s*color: rgb\(19, 33, 45\);\s*\}/g, '');
  content = content.replace(/html\[data-theme="dark"\] \.chip\.active \{\s*background: #223648;\s*border-color: #3f5870;\s*\}/g, '');
  content = content.replace(/:root:not\(\[data-theme\]\) \.lang\.active \{\s*color: rgb\(19, 33, 45\);\s*\}/g, '');
  content = content.replace(/:root:not\(\[data-theme\]\) \.chip\.active \{\s*background: #223648;\s*border-color: #3f5870;\s*\}/g, '');

  fs.writeFileSync(file, content);
});

console.log("Refactor Safe done!");
