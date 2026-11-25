const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const restricted = /ruhl|showroom|200_water/i;
function clean(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (restricted.test(entry.name)) {
      fs.rmSync(file, { recursive: true, force: true });
      continue;
    }
    if (entry.isDirectory()) { clean(file); continue; }
    if (!/\.(html|js|json)$/.test(entry.name)) continue;
    let text = fs.readFileSync(file, 'utf8');
    if (file === path.join(root, 'pages/manifest.json')) {
      const manifest = JSON.parse(text);
      manifest.pages = manifest.pages.filter(page => !restricted.test(page.id));
      text = JSON.stringify(manifest);
    }
    text = text.replace(/<script type="application\/(?:json|ld\+json)"[^>]*>([\s\S]*?)<\/script>/g, (tag, body) => {
      const data = JSON.parse(body);
      if (data.pages) for (const id of Object.keys(data.pages)) if (restricted.test(id)) delete data.pages[id];
      return tag.replace(body, JSON.stringify(data));
    });
    text = text.replace(/<section\b[^>]*class="case-next-project[^>]*>[\s\S]*?<\/section>/g, section => restricted.test(section) ? '' : section);
    text = text.replace(/<script\b[^>]*src="[^"]*ruhl[^"]*"[^>]*><\/script>/g, '');
    if (entry.name === 'portfolio-assistant.js') {
      text = text.replace(/^.*href: '#case-(?:ruhl|showroom)'.*\r?\n/gm, '');
    }
    fs.writeFileSync(file, text);
  }
}
clean(root);
console.log('Restricted case studies and project assets excluded from public artifact.');
