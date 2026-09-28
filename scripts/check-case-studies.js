const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const files = [
  path.join(root, "index.html"),
  path.join(root, "data", "caseStudies", "trialbridge.json"),
].filter((file) => fs.existsSync(file));

const unresolved = [];

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file);
  const trialbridgeOnly =
    relative === "index.html"
      ? source.match(/<section class="page" data-page-view="case-trial">[\s\S]*?<\/section>\s*<\/main>/)?.[0] || ""
      : source;

  trialbridgeOnly.split(/\r?\n/).forEach((line, index) => {
    if (/\bTODO\b|CaseStudyTodo|\[NEEDS (ASSET|COPY|PROTOTYPE|EVIDENCE|METRIC|TEAM|TIMELINE|REFLECTION)\]/.test(line)) {
      unresolved.push(`${relative}:${index + 1}: ${line.trim()}`);
    }
  });
}

if (unresolved.length) {
  console.error("Unresolved case study TODOs found:");
  unresolved.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log("No unresolved TrialBridge case study TODOs found.");
