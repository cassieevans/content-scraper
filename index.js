const path = require("path");
const html2md = require("html-to-md");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const chalk = require("chalk");
const YAML = require("yaml");
const { thisTypeAnnotation } = require("babel-types");

const pages = [
  "https://greensock.com/docs/v3/GSAP/Tween",
  // "https://greensock.com/docs/v3/GSAP/Tween/data",
  // "https://greensock.com/docs/v3/GSAP/Tween/ratio",
  // "https://greensock.com/docs/v3/GSAP/Tween/vars",
  // "https://greensock.com/docs/v3/GSAP/Tween/delay",
  // "https://greensock.com/docs/v3/GSAP/Tween/duration",
  // "https://greensock.com/docs/v3/GSAP/Tween/endTime",
  // "https://greensock.com/docs/v3/GSAP/Tween/eventCallback",
  // "https://greensock.com/docs/v3/GSAP/Tween/globalTime",
  // "https://greensock.com/docs/v3/GSAP/Tween/invalidate",
  "https://greensock.com/docs/v3/GSAP/Tween/isActive",
  // "https://greensock.com/docs/v3/GSAP/Tween/iteration",
  // "https://greensock.com/docs/v3/GSAP/Tween/kill",
  // "https://greensock.com/docs/v3/GSAP/Tween/pause",
  // "https://greensock.com/docs/v3/GSAP/Tween/paused",
  // "https://greensock.com/docs/v3/GSAP/Tween/play",
  // "https://greensock.com/docs/v3/GSAP/Tween/progress",
  // "https://greensock.com/docs/v3/GSAP/Tween/repeat",
  // "https://greensock.com/docs/v3/GSAP/Tween/repeatDelay",
  // "https://greensock.com/docs/v3/GSAP/Tween/restart",
  // "https://greensock.com/docs/v3/GSAP/Tween/resume",
  // "https://greensock.com/docs/v3/GSAP/Tween/reverse",
  // "https://greensock.com/docs/v3/GSAP/Tween/reversed",
  // "https://greensock.com/docs/v3/GSAP/Tween/revert",
  // "https://greensock.com/docs/v3/GSAP/Tween/seek",
  // "https://greensock.com/docs/v3/GSAP/Tween/startTime",
  // "https://greensock.com/docs/v3/GSAP/Tween/targets",
  // "https://greensock.com/docs/v3/GSAP/Tween/then",
  // "https://greensock.com/docs/v3/GSAP/Tween/time",
  // "https://greensock.com/docs/v3/GSAP/Tween/timeScale",
  // "https://greensock.com/docs/v3/GSAP/Tween/totalDuration",
  // "https://greensock.com/docs/v3/GSAP/Tween/totalProgress",
  // "https://greensock.com/docs/v3/GSAP/Tween/totalTime",
  // "https://greensock.com/docs/v3/GSAP/Tween/yoyo",

  // "https://greensock.com/docs/v3/GSAP/Timeline",
  // "https://greensock.com/docs/v3/GSAP/Timeline/autoRemoveChildren",
  // "https://greensock.com/docs/v3/GSAP/Timeline/data",
  // "https://greensock.com/docs/v3/GSAP/Timeline/labels",
  // "https://greensock.com/docs/v3/GSAP/Timeline/parent",
  // "https://greensock.com/docs/v3/GSAP/Timeline/smoothChildTiming",
  // "https://greensock.com/docs/v3/GSAP/Timeline/vars",
  // "https://greensock.com/docs/v3/GSAP/Timeline/add",
  // "https://greensock.com/docs/v3/GSAP/Timeline/addLabel",
  // "https://greensock.com/docs/v3/GSAP/Timeline/addPause",
  // "https://greensock.com/docs/v3/GSAP/Timeline/call",
  // "https://greensock.com/docs/v3/GSAP/Timeline/clear",
  // "https://greensock.com/docs/v3/GSAP/Timeline/currentLabel",
  // "https://greensock.com/docs/v3/GSAP/Timeline/delay",
  // "https://greensock.com/docs/v3/GSAP/Timeline/duration",
  // "https://greensock.com/docs/v3/GSAP/Timeline/endTime",
  // "https://greensock.com/docs/v3/GSAP/Timeline/eventCallback",
  // "https://greensock.com/docs/v3/GSAP/Timeline/eventCallback",
  // "https://greensock.com/docs/v3/GSAP/Timeline/from",
  // "https://greensock.com/docs/v3/GSAP/Timeline/fromTo",
  // "https://greensock.com/docs/v3/GSAP/Timeline/getById",
  // "https://greensock.com/docs/v3/GSAP/Timeline/getChildren",
  // "https://greensock.com/docs/v3/GSAP/Timeline/getTweensOf",
  // "https://greensock.com/docs/v3/GSAP/Timeline/globalTime",
  // "https://greensock.com/docs/v3/GSAP/Timeline/invalidate",
  // "https://greensock.com/docs/v3/GSAP/Timeline/isActive",
  // "https://greensock.com/docs/v3/GSAP/Timeline/iteration",
  // "https://greensock.com/docs/v3/GSAP/Timeline/kill",
  // "https://greensock.com/docs/v3/GSAP/Timeline/killTweensOf",
  // "https://greensock.com/docs/v3/GSAP/Timeline/nextLabel",
  // "https://greensock.com/docs/v3/GSAP/Timeline/pause",
  // "https://greensock.com/docs/v3/GSAP/Timeline/paused",
  // "https://greensock.com/docs/v3/GSAP/Timeline/play",
  // "https://greensock.com/docs/v3/GSAP/Timeline/previousLabel",
  // "https://greensock.com/docs/v3/GSAP/Timeline/progress",
  // "https://greensock.com/docs/v3/GSAP/Timeline/recent",
  // "https://greensock.com/docs/v3/GSAP/Timeline/remove",
  // "https://greensock.com/docs/v3/GSAP/Timeline/removeLabel",
  // "https://greensock.com/docs/v3/GSAP/Timeline/removePause",
  // "https://greensock.com/docs/v3/GSAP/Timeline/repeat",
  // "https://greensock.com/docs/v3/GSAP/Timeline/repeatDelay",
  // "https://greensock.com/docs/v3/GSAP/Timeline/restart",
  // "https://greensock.com/docs/v3/GSAP/Timeline/resume",
  // "https://greensock.com/docs/v3/GSAP/Timeline/reverse",
  // "https://greensock.com/docs/v3/GSAP/Timeline/reversed",
  // "https://greensock.com/docs/v3/GSAP/Timeline/revert",
  // "https://greensock.com/docs/v3/GSAP/Timeline/seek",
  // "https://greensock.com/docs/v3/GSAP/Timeline/set",
  // "https://greensock.com/docs/v3/GSAP/Timeline/shiftChildren",
  // "https://greensock.com/docs/v3/GSAP/Timeline/startTime",
  // "https://greensock.com/docs/v3/GSAP/Timeline/then",
  // "https://greensock.com/docs/v3/GSAP/Timeline/time",
  // "https://greensock.com/docs/v3/GSAP/Timeline/timeScale",
  // "https://greensock.com/docs/v3/GSAP/Timeline/to",
  // "https://greensock.com/docs/v3/GSAP/Timeline/totalDuration",
  // "https://greensock.com/docs/v3/GSAP/Timeline/totalProgress",
  // "https://greensock.com/docs/v3/GSAP/Timeline/totalTime",
  // "https://greensock.com/docs/v3/GSAP/Timeline/tweenFromTo",
  // "https://greensock.com/docs/v3/GSAP/Timeline/tweenTo",
  // "https://greensock.com/docs/v3/GSAP/Timeline/yoyo",
];

async function getHtml(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle0" });

  const main = await page.evaluate(
    (el) => el.innerHTML,
    await page.$(".docs-content")
  );

  return main;
}

function getStringAfterLastSlash(str) {
  // Find the index of the last occurrence of '/'
  const index = str.lastIndexOf("/");
  // Return the part of the string after the last '/', with any '.' characters replaced with '-', or an empty string if '/' is not found
  return index !== -1 ? str.substring(index + 1).replace(/\./g, "-") : "";
}

async function generateMarkdown(data, i) {
  // set the title of the markdown file
  let title = getStringAfterLastSlash(pages[i]);

  // Load the HTML as a cheerio instance
  const $ = cheerio.load(data);

  // Grab the main content
  const mainElements = $(".main-content:not(.main-content *)");

  // set up our frontmatter
  let sideBarCustomProps = {};

  sideBarCustomProps.id = title;
  sideBarCustomProps.sidebar_custom_props = {};

  let propsTitle = title.replace(/\(|\)/g, "");
  sideBarCustomProps.sidebar_custom_props.title = propsTitle;

  console.log("this is the title", propsTitle);

  // grab our summary and only do stuff if it exists
  const summaryElem = $(".element-box p");
  if (summaryElem.length) {
    let summary = summaryElem.text();
    sideBarCustomProps.sidebar_custom_props.summary = summary;
  }

  // samsies
  const propSummaryElem = $(".element-box span");
  if (propSummaryElem.length) {
    let propSummary = propSummaryElem.first().text();
    sideBarCustomProps.sidebar_custom_props.propSummary = propSummary;
  }

  // how about that - more samsies
  const propsArray = $(".prop.element");
  if (propsArray.length) {
    // except this time we're looping the loop
    let params = [];
    propsArray.each(function () {
      let prop = {};
      const h2 = $(this).find("h2").text().trim().split(":")[0];
      const span = $(this).find("h2 span").text().trim();
      const p = $(this).find("p").text();
      prop.name = h2;
      prop.data = span;
      prop.description = p;
      params.push(prop);
    });

    sideBarCustomProps.sidebar_custom_props.params = params;
  }

  // yaml magics
  const doc = new YAML.Document();
  doc.contents = sideBarCustomProps;

  // console.log(doc.toString());

  const frontMatter = `---

  ${doc.toString()}

  ---

  `;

  let imports = `

    <PropDetails items={frontMatter.sidebar_custom_props}/>

    `;

  const htmlSnippets = [];

  mainElements.each((index, element) => {
    const main = $(element);
    // Get the HTML snippet of the current main content element
    const htmlSnippet = main.html();
    // Add the HTML snippet to the array
    htmlSnippets.push(htmlSnippet);
  });

  // Join the HTML snippets into a single string
  let joinedHTML = htmlSnippets.join("");

  // Set language to JavaScript for code snippets
  // const jsCodeRegex = /<pre>/g;
  // joinedHTML = joinedHTML.replace(jsCodeRegex, '<pre class="language-js">');

  // console.log(joinedHTML);

  const main$ = cheerio.load(joinedHTML);

  const codepenIframes = main$('iframe[src*="codepen"]');

  // console.log(codepenIframes);

  codepenIframes.each(function (i, elem) {
    const src = $(this).prop("src");

    const embedCode = src.match(/embed\/(\w+)/)[1];

    // Replace the current iframe with the new Codepen element
    $(this).replaceWith(
      `<code>replaceMeStart Codepen height="400" id="${embedCode}" replaceMeEnd</code>`
    );
  });

  const vimeoIframes = main$('iframe[src*="vimeo"]');

  // console.log(codepenIframes);

  vimeoIframes.each(function (i, elem) {
    const src = $(this).prop("src");

    // Replace the current iframe with the new Codepen element
    $(this).replaceWith(
      `<code>replaceMeStart iframe allow="autoplay; fullscreen" allowfullscreen="" frameborder="0" src="${src}" class="fr-draggable video" replaceVimeoEnd</code>`
    );
  });

  // Get the modified HTML string
  const modifiedHtml = main$.html();

  console.log(modifiedHtml, "🔥🔥🔥🔥🔥");

  let md = html2md(
    modifiedHtml,
    {
      tagListener: (tagName, props) => {
        return {
          ...props,
          language: "js",
        };
      },
    },
    false
  );

  console.log(md, "🙈🙈🙈🙈🙈");

  md = md
    .replace(/`replaceMeStart /g, "<")
    .replace(/replaceMeEnd`/g, "/>")
    .replace(/replaceVimeoEnd`/g, "></iframe>");

  const file = path.join(".", `${title}.md`);

  await fs.appendFile(file, frontMatter);

  // We only need imports if it's a props page but it feels messy to check this way. meh. There's checks in the component too tbh
  if (summaryElem.length) {
    await fs.appendFile(file, imports);
  }
  await fs.appendFile(file, md);
}

async function go() {
  for (let i = 0; i < pages.length; i++) {
    const html = await getHtml(pages[i]);
    const markdown = await generateMarkdown(html, i);
    console.log(chalk.green("Done!"));
  }
}

go();
