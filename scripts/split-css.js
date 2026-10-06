const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const mainPath = path.join(root, "css", "main.css");
const css = fs.readFileSync(mainPath, "utf8");
const lines = css.split(/\r?\n/);
const mediaIdx = lines.findIndex((line) => line.startsWith("@media (max-width: 980px)"));

if (mediaIdx < 0) {
  throw new Error("Responsive breakpoint block not found.");
}

fs.writeFileSync(path.join(root, "css", "tokens.css"), `${lines.slice(0, 24).join("\n")}\n`);
fs.writeFileSync(path.join(root, "css", "site.css"), `${lines.slice(25, mediaIdx).join("\n")}\n`);
fs.writeFileSync(path.join(root, "css", "responsive.css"), `${lines.slice(mediaIdx).join("\n")}\n`);
fs.writeFileSync(
  path.join(root, "css", "main.css"),
  '@import "./tokens.css";\n@import "./site.css";\n@import "./responsive.css";\n'
);

console.log("Split CSS into tokens, site, and responsive.");
