const fs = require('fs');

const files = ['index.html', 'career.html', 'blog.html', 'contact.html'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let startIndex = content.indexOf('const navLinks = Array.from(document.querySelectorAll("nav .chip"));');
  
  if (startIndex === -1) {
    console.log(file, 'JS start not found');
  } else {
    let getInitIndex = content.indexOf('const getInitialLang = () => {', startIndex);
    if (getInitIndex !== -1) {
      let closeBrace = content.indexOf('};', getInitIndex);
      if (closeBrace !== -1) {
        let endIndex = closeBrace + 2;
        console.log(file, 'Found JS block to remove:', endIndex - startIndex, 'characters');
        
        let toRemove = content.substring(startIndex, endIndex);
        content = content.replace(toRemove, '');
      }
    }
  }

  // Bottom event listeners
  content = content.replace(/if\s*\(\s*themeToggleButton\s*\)\s*\{[\s\S]*?\}\s*\}/g, '');
  content = content.replace(/if\s*\(\s*darkMedia\.addEventListener\s*\)\s*\{[\s\S]*?\}\s*\}/g, '');
  content = content.replace(/storeCampaignParams\(window\.location\.search\);\s*/g, '');
  content = content.replace(/applyStoredTheme\(\);\s*/g, '');
  content = content.replace(/syncThemeToggle\(\);\s*/g, '');
  content = content.replace(/setLang\(getInitialLang\(\)\);\s*/g, ''); // index, career, contact has this. blog does not? blog has setLang(getInitialLang()) ? Let's just remove getInitialLang calls.
  
  // Wait, let's also remove common CSS!
  let cssStart = content.indexOf('      :root {');
  if (cssStart !== -1) {
    let cssEnd = content.indexOf('      .container {');
    // I can just replace the whole <style> with a specific one, or just let it be.
  }
  
  fs.writeFileSync(file, content);
});
