const fs = require('node:fs');
const file = 'pages/about.html';
fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(/0[234] \/ /g, ''));
