const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "script.js"), "utf8");

const designNotesStart = source.indexOf("const designNotes = [");
const designNotesEnd = source.indexOf("];\nconst articles = [");
const articlesStart = designNotesEnd + "];\n".length;
const articlesEnd = source.indexOf("];\nlet currentNoteIndex");

if (designNotesStart < 0 || articlesEnd < 0) {
  throw new Error("Could not locate data arrays in script.js");
}

const designNotesBlock = source.slice(designNotesStart, designNotesEnd + 2);
const articlesBlock = source.slice(articlesStart, articlesEnd + 2);
const appBody = source.slice(articlesEnd + "];\n".length);

const jsDir = path.join(root, "js");
const dataDir = path.join(jsDir, "data");
fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(
  path.join(dataDir, "design-notes.js"),
  `${designNotesBlock.replace("const designNotes", "export const designNotes")}\n`
);
fs.writeFileSync(
  path.join(dataDir, "articles.js"),
  `${articlesBlock.replace("const articles", "export const articles")}\n`
);
fs.writeFileSync(
  path.join(jsDir, "config.js"),
  'export const initialWritingNoteIndex = 2;\n'
);

const appHeader = `import { designNotes } from "./data/design-notes.js";
import { articles } from "./data/articles.js";
import { initialWritingNoteIndex } from "./config.js";

`;

fs.writeFileSync(path.join(jsDir, "app.js"), appHeader + appBody.replace("const initialWritingNoteIndex = 2;\n", ""));
fs.unlinkSync(path.join(root, "script.js"));

console.log("Created js/app.js and js/data modules; removed root script.js");
