const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const html = fs.readFileSync(indexPath, "utf8");

function extractTopLevelPageSections(mainHtml) {
  const sections = [];
  let cursor = 0;

  while (cursor < mainHtml.length) {
    const start = mainHtml.indexOf('<section class="page', cursor);
    if (start === -1) {
      break;
    }

    let depth = 0;
    let index = start;

    while (index < mainHtml.length) {
      if (mainHtml.startsWith("<section", index)) {
        depth += 1;
        index += "<section".length;
        continue;
      }

      if (mainHtml.startsWith("</section>", index)) {
        depth -= 1;
        index += "</section>".length;
        if (depth === 0) {
          sections.push(mainHtml.slice(start, index));
          cursor = index;
          break;
        }
        continue;
      }

      index += 1;
    }

    if (depth !== 0) {
      throw new Error("Unclosed page section while parsing index.html");
    }
  }

  return sections;
}

const mainStart = html.indexOf("<main>");
const mainEnd = html.indexOf("</main>");
if (mainStart < 0 || mainEnd < 0) {
  throw new Error("Could not find <main> in index.html");
}

const mainInner = html.slice(mainStart + "<main>".length, mainEnd);
const pageSections = extractTopLevelPageSections(mainInner);

const pagesDir = path.join(root, "pages");
fs.mkdirSync(pagesDir, { recursive: true });

const pageViews = [];
for (const sectionHtml of pageSections) {
  const pageViewMatch = sectionHtml.match(/data-page-view="([^"]+)"/);
  if (!pageViewMatch) {
    throw new Error("Page section missing data-page-view attribute");
  }
  const pageView = pageViewMatch[1];
  pageViews.push(pageView);
  fs.writeFileSync(path.join(pagesDir, `${pageView}.html`), `${sectionHtml}\n`, "utf8");
  console.log(`Wrote pages/${pageView}.html`);
}

const headEnd = html.indexOf("</head>");
const bodyStart = html.indexOf("<body>");
const bodyEnd = html.indexOf("</body>");
const beforeMain = html.slice(bodyStart + "<body>".length, mainStart);
const afterMain = html.slice(mainEnd + "</main>".length, bodyEnd);

const head = html.slice(0, headEnd + "</head>".length);
const scriptsWithLoader = afterMain.includes('src="js/load-pages.js"')
  ? afterMain
  : afterMain.replace(
      '<script src="assets/vendor/page-flip/page-flip.browser.js"></script>',
      '<script src="js/load-pages.js"></script>\n    <script src="assets/vendor/page-flip/page-flip.browser.js"></script>'
    );

const shell = `${head}
  <body>
${beforeMain}    <main data-page-root></main>
${scriptsWithLoader}  </body>
</html>
`;

const manifest = {
  pages: pageViews.map((pageView, index) => ({
    id: pageView,
    file: `${pageView}.html`,
    defaultVisible: index === 0
  }))
};

fs.writeFileSync(path.join(pagesDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
fs.writeFileSync(indexPath, shell);
console.log(`Updated index.html shell (${pageViews.length} pages)`);
