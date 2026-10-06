/**
 * One-time project layout organizer: moves assets and rewrites path references.
 * Safe to re-run only before paths are migrated (uses old paths as keys).
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const assetMoves = {
  "assets/logo-dark.png": "assets/brand/logo-dark.png",
  "assets/logo-light.png": "assets/brand/logo-light.png",
  "assets/mail.png": "assets/icons/mail.png",
  "assets/linkedin.png": "assets/icons/linkedin.png",
  "assets/behance.png": "assets/icons/behance.png",
  "assets/resume.svg": "assets/documents/resume.svg",
  "assets/hero_background.png": "assets/images/home/hero-background.png",
  "assets/hero-sketch.jpg": "assets/images/home/hero-sketch.jpg",
  "assets/table_texture.jpg": "assets/images/writing/table-texture.jpg",
  "assets/about-portrait.png": "assets/images/about/portrait.png",
  "assets/sketches.png": "assets/images/about/sketches.png",
  "assets/team-1.jpg": "assets/images/about/team-1.jpg",
  "assets/team-2.jpg": "assets/images/about/team-2.jpg",
  "assets/team-3.jpg": "assets/images/about/team-3.jpg",
  "assets/travel-1.jpg": "assets/images/about/travel-1.jpg",
  "assets/travel-2.jpg": "assets/images/about/travel-2.jpg",
  "assets/travel-3.jpg": "assets/images/about/travel-3.jpg",
  "assets/skill-dev.png": "assets/images/about/skills/skill-dev.png",
  "assets/skill-marketing.png": "assets/images/about/skills/skill-marketing.png",
  "assets/skill-ux.png": "assets/images/about/skills/skill-ux.png",
  "assets/testimonial-ankita.jpg": "assets/images/about/testimonials/testimonial-ankita.jpg",
  "assets/testimonial-arnaud.jpg": "assets/images/about/testimonials/testimonial-arnaud.jpg",
  "assets/testimonial-kevin.jpg": "assets/images/about/testimonials/testimonial-kevin.jpg",
  "assets/work-ruhl.png": "assets/images/work/work-ruhl.png",
  "assets/work-trial.png": "assets/images/work/work-trial.png",
  "assets/work-azhartt.png": "assets/images/work/work-azhartt.png",
  "assets/work-soor.png": "assets/images/work/work-soor.png",
  "assets/trialbridge__assistant__chat__04.png":
    "assets/images/case-studies/trialbridge/assistant-chat.png",
  "assets/trialbridge__care-circle__assigned-tasks__04.png":
    "assets/images/case-studies/trialbridge/care-circle-assigned-tasks.png",
  "assets/trialbridge__community__hub-annotated__04.png":
    "assets/images/case-studies/trialbridge/community-hub-annotated.png",
  "assets/trialbridge__dashboard__annotated__04.png":
    "assets/images/case-studies/trialbridge/dashboard-annotated.png",
  "assets/trialbridge__dashboard__matching-trials__01.png":
    "assets/images/case-studies/trialbridge/dashboard-matching-trials.png",
  "assets/trialbridge__onboarding__annotated__04.png":
    "assets/images/case-studies/trialbridge/onboarding-annotated.png",
  "assets/trialbridge__onboarding__travel-preferences__04.png":
    "assets/images/case-studies/trialbridge/onboarding-travel-preferences.png",
};

const textFiles = [
  path.join(root, "index.html"),
  path.join(root, "styles.css"),
  path.join(root, "css", "main.css"),
  path.join(root, "data", "caseStudies", "trialbridge.json"),
];

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function moveAsset(fromRel, toRel) {
  const from = path.join(root, fromRel);
  const to = path.join(root, toRel);
  if (!fs.existsSync(from)) {
    if (fs.existsSync(to)) {
      return;
    }
    console.warn(`Skip missing: ${fromRel}`);
    return;
  }
  ensureDir(to);
  fs.renameSync(from, to);
  console.log(`Moved ${fromRel} -> ${toRel}`);
}

function replacePathsInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  let source = fs.readFileSync(filePath, "utf8");
  let changed = false;
  const sorted = Object.entries(replacements).sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of sorted) {
    if (source.includes(from)) {
      source = source.split(from).join(to);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, source, "utf8");
    console.log(`Updated paths in ${path.relative(root, filePath)}`);
  }
}

for (const [from, to] of Object.entries(assetMoves)) {
  moveAsset(from, to);
}

const cssAssetPrefix = "../assets/";
const pathReplacements = {};
for (const [from, to] of Object.entries(assetMoves)) {
  pathReplacements[from] = to;
  pathReplacements[from.replace(/\//g, "\\")] = to;
}

replacePathsInFile(path.join(root, "index.html"), pathReplacements);

const stylesPath = path.join(root, "styles.css");
if (fs.existsSync(stylesPath)) {
  const cssDir = path.join(root, "css");
  fs.mkdirSync(cssDir, { recursive: true });
  let css = fs.readFileSync(stylesPath, "utf8");
  for (const [from, to] of Object.entries(pathReplacements)) {
    css = css.split(from).join(to.replace(/^assets\//, cssAssetPrefix));
  }
  css = css.replaceAll('url("../assets/assets/', 'url("../assets/');
  fs.writeFileSync(path.join(cssDir, "main.css"), css, "utf8");
  fs.unlinkSync(stylesPath);
  console.log("Moved styles.css -> css/main.css");
}

console.log("Asset organization complete.");
