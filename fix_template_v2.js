import fs from 'fs';

const file = 'scripts/build-blog.mjs';
let content = fs.readFileSync(file, 'utf-8');

// Replace CSS
content = content.replace(/<style>[\s\S]*?:root \{[\s\S]*?--chip-active-line: #9fc9e4;\s*\}\s*html\[data-theme="dark"\] \{[\s\S]*?--chip-active-line: #3f5870;\s*\}/, '<link rel="stylesheet" href="../assets/css/global.css" />\n    <style>');
content = content.replace(/\* \{\s*box-sizing: border-box;\s*\}/, '');
content = content.replace(/body \{\s*margin: 0;[\s\S]*?var\(--bg\);\s*\}/, '');
content = content.replace(/\.grain::before \{\s*content: "";[\s\S]*?background-size: 4px 4px;\s*\}/, '');
content = content.replace(/\.container \{\s*width: min\(1120px, 92%\);\s*margin: 0 auto;\s*\}/, '');
content = content.replace(/header \{\s*position: sticky;[\s\S]*?background: linear-gradient[^;]+;\s*\}/, '');
content = content.replace(/\.topbar \{\s*display: grid;[\s\S]*?padding: 14px 0;\s*\}/, '');
content = content.replace(/\.brand \{\s*display: inline-flex;[\s\S]*?font-size: 1\.15rem;\s*\}/, '');
content = content.replace(/\.brand-icon \{\s*width: 1\.8rem;[\s\S]*?background: var\(--surface-soft\);\s*\}/, '');
content = content.replace(/nav,\s*\.top-actions \{\s*display: flex;\s*gap: 0\.5rem;\s*flex-wrap: wrap;\s*\}/, '');
content = content.replace(/nav \{\s*grid-column: 2;\s*justify-self: center;\s*\}/, '');
content = content.replace(/\.top-actions \{\s*grid-column: 3;\s*justify-self: end;\s*\}/, '');
content = content.replace(/\.chip,\s*\.lang,\s*\.theme-toggle \{\s*border: 1px solid var\(--line\);[\s\S]*?cursor: pointer;\s*\}/, '');
content = content.replace(/\.chip\.active \{\s*background: var\(--chip-active-bg\);\s*border-color: var\(--chip-active-line\);\s*\}/, '');
content = content.replace(/\.lang\.active \{\s*background: linear-gradient\(135deg, var\(--brand\), #d9f2ff\);\s*color: #13212d;\s*\}/, '');
content = content.replace(/footer \{\s*text-align: center;\s*padding: 1\.4rem 0 2rem;\s*color: #5b7488;\s*\}/, '');

// Replace JS
content = content.replace(/const themeToggleButton = document\.querySelector\("\[data-theme-toggle\]"\);[\s\S]*?const getResolvedTheme = \(\) => \{[\s\S]*?\};[\s\S]*?const syncThemeToggle = \(\) => \{[\s\S]*?\};/m, '');
content = content.replace(/if \(themeToggleButton\) \{[\s\S]*?syncThemeToggle\(\);\s*\}/m, '');
content = content.replace(/if \(darkMedia\.addEventListener\) \{[\s\S]*?syncThemeToggle\(\);\s*\}\s*\}/m, '');
content = content.replace(/syncThemeToggle\(\);/g, '');

content = content.replace(/<\/script>\s*<\/body>/, '</script>\n    <script src="../assets/js/global.js"></script>\n  </body>');

fs.writeFileSync(file, content);
console.log('Template fixed v2!');