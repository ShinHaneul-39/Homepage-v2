const fs = require('fs');

const files = ['index.html', 'career.html', 'blog.html', 'contact.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // Regex to remove the block from * { box-sizing: border-box; } to the footer { ... } block
  // First, we find the index of * { box-sizing: border-box; }
  const startIdx = content.indexOf('* {\n        box-sizing: border-box;');
  if (startIdx === -1) {
    const startIdx2 = content.indexOf('* {\r\n        box-sizing: border-box;');
    if (startIdx2 !== -1) {
        // ...
    }
  }

  // Instead of manual string index, let's use a very powerful regex for CSS.
  // We want to remove standard blocks.
  const blocksToRemove = [
    /\*\s*\{\s*box-sizing:\s*border-box;\s*\}/g,
    /body\s*\{\s*margin:\s*0;\s*min-height:\s*100vh;\s*display:\s*flex;\s*flex-direction:\s*column;\s*font-family:[^;]+;\s*color:\s*var\(--ink\);\s*(?:line-height:\s*1\.6;\s*)?background:[^}]+;\s*\}/g,
    /html:lang\(ko\)\s*body\s*\{\s*font-family:[^}]+;\s*\}/g,
    /\.container\s*\{\s*width:\s*min\(1120px,\s*92%\);\s*margin:\s*0\s*auto;\s*\}/g,
    /\.page-shell\s*\{\s*flex:\s*1;\s*padding:\s*2rem\s*0\s*2\.4rem;\s*display:\s*flex;\s*flex-direction:\s*column;\s*gap:\s*1rem;\s*\}/g,
    /header\s*\{\s*position:\s*sticky;\s*top:\s*0;\s*z-index:\s*20;\s*(?:backdrop-filter:\s*blur\(12px\);\s*)?border-bottom:\s*1px\s*solid\s*var\(--header-border\);\s*background:\s*linear-gradient[^}]+;\s*\}/g,
    /\.topbar\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*1fr\s*auto\s*1fr;\s*align-items:\s*center;\s*padding:\s*14px\s*0;\s*gap:\s*0\.8rem;\s*\}/g,
    /\.brand\s*\{\s*display:\s*inline-flex;\s*align-items:\s*center;\s*gap:\s*0\.45rem;\s*(?:font-family:[^;]+;\s*)?font-size:\s*1\.15rem;\s*(?:letter-spacing:\s*0\.02em;\s*)?\}/g,
    /\.brand-icon\s*\{\s*(?:display:\s*inline-block;\s*)?width:\s*1\.8rem;\s*height:\s*1\.8rem;\s*border-radius:\s*50%;\s*border:\s*1px\s*solid\s*var\(--line\);\s*object-fit:\s*cover;\s*(?:background:\s*var\(--surface-soft\);\s*)?\}/g,
    /nav\s*\{\s*display:\s*flex;\s*gap:\s*0\.55rem;\s*flex-wrap:\s*wrap;\s*grid-column:\s*2;\s*justify-self:\s*center;\s*\}/g,
    /\.chip\s*\{\s*text-decoration:\s*none;\s*border:\s*1px\s*solid\s*var\(--line\);\s*border-radius:\s*999px;\s*padding:\s*0\.44rem\s*0\.78rem;\s*background:\s*var\(--surface\);\s*color:\s*var\(--ink\);\s*font-size:\s*0\.85rem;\s*(?:font-family:[^;]+;\s*)?\}/g,
    /\.chip\.active\s*\{\s*background:\s*(?:#e7f6ff|var\(--chip-active-bg\));\s*border-color:\s*(?:#9fc9e4|var\(--chip-active-line\));\s*\}/g,
    /\.top-actions\s*\{\s*display:\s*flex;\s*align-items:\s*center;\s*(?:flex-wrap:\s*wrap;\s*gap:\s*0\.35rem;\s*grid-column:\s*3;\s*justify-self:\s*end;|gap:\s*0\.35rem;\s*flex-wrap:\s*wrap;\s*grid-column:\s*3;\s*justify-self:\s*end;)\s*\}/g,
    /\.chip:visited,\s*\.chip:hover,\s*\.chip:active\s*\{\s*color:\s*var\(--ink\);\s*text-decoration:\s*none;\s*\}/g,
    /\.lang\s*\{\s*border:\s*1px\s*solid\s*var\(--line\);\s*border-radius:\s*999px;\s*padding:\s*0\.42rem\s*0\.72rem;\s*background:\s*var\(--surface\);\s*color:\s*var\(--ink\);\s*cursor:\s*pointer;\s*\}/g,
    /\.lang\.active\s*\{\s*background:\s*linear-gradient[^}]+;\s*\}/g,
    /html\[data-theme="dark"\]\s*\.lang\.active\s*\{\s*color:\s*rgb\(19,\s*33,\s*45\);\s*\}/g,
    /html\[data-theme="dark"\]\s*\.chip\.active\s*\{\s*background:\s*#223648;\s*border-color:\s*#3f5870;\s*\}/g,
    /\.theme-toggle\s*\{\s*border:\s*1px\s*solid\s*var\(--line\);\s*border-radius:\s*999px;\s*padding:\s*0\.42rem\s*0\.72rem;\s*background:\s*var\(--surface\);\s*color:\s*var\(--ink\);\s*cursor:\s*pointer;\s*font-size:\s*0\.82rem;\s*\}/g,
    /footer\s*\{\s*(?:padding:\s*1\.5rem\s*0\s*2\.2rem;\s*text-align:\s*center;\s*color:\s*var\(--footer-ink\);|text-align:\s*center;\s*color:\s*var\(--footer-ink\);\s*padding:\s*1\.5rem\s*0\s*2\.2rem;|text-align:\s*center;\s*color:\s*var\(--footer-ink\);\s*padding:\s*1\.1rem\s*0\s*1\.5rem;)\s*\}/g,
    /nav,\s*\.top-actions,\s*\.tabs,\s*\.pager\s*\{\s*display:\s*flex;\s*gap:\s*0\.5rem;\s*flex-wrap:\s*wrap;\s*\}/g,
    /nav\s*\{\s*grid-column:\s*2;\s*justify-self:\s*center;\s*\}/g,
    /\.top-actions\s*\{\s*grid-column:\s*3;\s*justify-self:\s*end;\s*\}/g,
    /\.chip,\s*\.lang,\s*\.tab,\s*\.theme-toggle,\s*\.pager\s*button\s*\{\s*text-decoration:\s*none;\s*border:\s*1px\s*solid\s*var\(--line\);\s*border-radius:\s*999px;\s*padding:\s*0\.4rem\s*0\.72rem;\s*background:\s*var\(--surface\);\s*color:\s*var\(--ink\);\s*font-size:\s*0\.85rem;\s*cursor:\s*pointer;\s*\}/g,
    /\.chip\.active,\s*\.tab\.active,\s*\.pager\s*button\.active\s*\{\s*background:\s*var\(--chip-active-bg\);\s*border-color:\s*var\(--chip-active-line\);\s*\}/g,
    /\.lang\.active\s*\{\s*background:\s*linear-gradient\(135deg,\s*var\(--brand\),\s*#d9f2ff\);\s*color:\s*#13212d;\s*\}/g
  ];

  blocksToRemove.forEach(regex => {
    content = content.replace(regex, '');
  });

  // Remove empty lines in <style>
  content = content.replace(/<style>\s*<\/style>/g, '');

  fs.writeFileSync(file, content);
});

console.log("Cleanup done!");