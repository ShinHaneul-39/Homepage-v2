const fs = require('fs');
const path = require('path');

const files = ['index.html', 'career.html', 'blog.html', 'contact.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // --- 1. Link CSS & JS ---
  if (!content.includes('assets/css/global.css')) {
    content = content.replace(
      '<style>',
      '<link rel="stylesheet" href="./assets/css/global.css" />\n    <style>'
    );
  }
  if (!content.includes('assets/js/global.js')) {
    content = content.replace(
      '<script>',
      '<script src="./assets/js/global.js"></script>\n    <script>'
    );
  }

  // --- 2. Remove Common JS ---
  // The common JS block starts with `const navLinks =` and ends right after `const getInitialLang = () => { ... };`
  // Let's use regex to find this block.
  const jsStartMatch = content.match(/const navLinks = Array\.from\(document\.querySelectorAll\("nav \.chip"\)\);/);
  
  if (jsStartMatch) {
    const startIndex = jsStartMatch.index;
    
    // Find the end of getInitialLang
    // It looks like:
    //       const getInitialLang = () => {
    //         ...
    //         return i18n[document.documentElement.lang] ? document.documentElement.lang : "ko";
    //       };
    
    // We can search for the next declaration after getInitialLang.
    // In index.html: let personalInfoMap = {};
    // In career.html: const careerTableBody = document.getElementById("careerTableBody");
    // In blog.html: const blogGrid = document.getElementById("blogGrid");
    // In contact.html: let personalInfoMap = {};
    
    let endIndex = content.indexOf('let personalInfoMap = {};', startIndex);
    if (endIndex === -1) endIndex = content.indexOf('const careerTableBody = document.getElementById("careerTableBody");', startIndex);
    if (endIndex === -1) endIndex = content.indexOf('const blogGrid = document.getElementById("blogGrid");', startIndex);
    
    if (endIndex !== -1) {
      // Extract from startIndex to endIndex
      const before = content.substring(0, startIndex);
      const after = content.substring(endIndex);
      content = before + after;
    }
  }

  // Also remove the common event listeners for theme toggle and lang at the bottom
  // In index.html:
  // if (themeToggleButton) { ... }
  // if (darkMedia.addEventListener) { ... }
  // storeCampaignParams(window.location.search);
  // applyStoredTheme();
  // syncThemeToggle();
  // setLang(getInitialLang());
  
  // Actually, we can just replace them with empty strings.
  const themeToggleBlock = `if (themeToggleButton) {
        themeToggleButton.addEventListener("click", () => {
          const currentTheme = getResolvedTheme();
          const nextTheme = currentTheme === "dark" ? "light" : "dark";
          document.documentElement.dataset.theme = nextTheme;
          try {
            window.localStorage.setItem("preferredTheme", nextTheme);
          } catch (e) {
            // Ignore storage access errors.
          }
          syncThemeToggle();
        });
      }`;
  
  // We'll just do a more flexible regex for the bottom part
  content = content.replace(/if\s*\(themeToggleButton\)\s*\{[\s\S]*?syncThemeToggle\(\);\s*\}\s*\}/g, '');
  content = content.replace(/if\s*\(darkMedia\.addEventListener\)\s*\{[\s\S]*?\}\s*\}/g, '');
  content = content.replace(/storeCampaignParams\(window\.location\.search\);\s*/g, '');
  content = content.replace(/applyStoredTheme\(\);\s*/g, '');
  content = content.replace(/syncThemeToggle\(\);\s*/g, '');

  // Remove lang active toggling which is handled by setLang inside the HTML but we can keep it there.
  
  // --- 3. Remove Common CSS ---
  // To avoid breaking page-specific CSS, we will specifically target the common blocks.
  // We can use a trick: find the first block that is specific to the page, and delete everything before it inside <style>.
  // In index.html: `.grain::before {`
  // In career.html: `@media (prefers-reduced-motion: reduce) {`
  // In blog.html: `.search {`
  // In contact.html: `.methods {`
  
  let styleStart = content.indexOf('<style>');
  let firstSpecificCss = -1;
  if (file === 'index.html') firstSpecificCss = content.indexOf('.grain::before {');
  if (file === 'career.html') firstSpecificCss = content.indexOf('@media (prefers-reduced-motion: reduce) {');
  if (file === 'blog.html') firstSpecificCss = content.indexOf('.search {');
  if (file === 'contact.html') firstSpecificCss = content.indexOf('.methods {');
  
  if (styleStart !== -1 && firstSpecificCss !== -1) {
    const beforeStyle = content.substring(0, styleStart + 7); // include <style>
    const specificCss = content.substring(firstSpecificCss);
    
    // Wait, career.html has some specific variables in :root !
    // Let's preserve :root for career.html and blog.html if they have specific ones.
    // Actually, career.html has:
    // :root {
    //   --theme-transition-duration: 0.25s;
    //   --theme-transition-easing: ease;
    // ...
    // Let's just manually replace the exact common strings.
  }

  fs.writeFileSync(file, content);
});

console.log("Done JS processing");
