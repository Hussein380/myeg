const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Add text-gray-900 bg-white to inputs and textareas
      content = content.replace(/<input\s+([^>]*)className="([^"]+)"/g, (match, p1, p2) => {
        if (!p2.includes('text-gray-900')) {
          return `<input ${p1}className="${p2} text-gray-900 bg-white"`;
        }
        return match;
      });
      content = content.replace(/<textarea\s+([^>]*)className="([^"]+)"/g, (match, p1, p2) => {
        if (!p2.includes('text-gray-900')) {
          return `<textarea ${p1}className="${p2} text-gray-900 bg-white"`;
        }
        return match;
      });

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Fixed inputs');
