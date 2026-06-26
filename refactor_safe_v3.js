const fs = require('fs');

const files = ['index.html', 'career.html', 'blog.html', 'contact.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  const blocksToRemove = [
    /:root\s*\{\s*--bg:\s*#f5fbff;[\s\S]*?--footer-ink:\s*#557085;\s*\}/g,
    /html\[data-theme="dark"\]\s*\{\s*color-scheme:\s*dark;[\s\S]*?--footer-ink:\s*#9db0c1;\s*\}/g,
    /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root:not\(\[data-theme\]\)\s*\{\s*color-scheme:\s*dark;[\s\S]*?--footer-ink:\s*#9db0c1;\s*\}[\s\S]*?\}\s*\}/g,
    /^\s*$/gm
  ];

  blocksToRemove.forEach(regex => {
    content = content.replace(regex, '');
  });

  // Clean up <style>\n\n\n\n</style>
  content = content.replace(/<style>[\s\n]*<\/style>/g, '');

  fs.writeFileSync(file, content);
});

console.log("Cleanup v3 done!");