const puppeteer = require("puppeteer");
const fs = require("fs");
import { open } from "fs/promises";

// const articleDirName = "pedagogie1";
const articleDirName = "fai";

const htmlFile = process.argv[1];
// console.log(htmlFile);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const htmlContent = fs.readFileSync("./articles/built/file.html", "utf8");
  await page.setContent(htmlContent);

  // await page.pdf({
  //   path: `./articles/built/${articleDirName}.pdf`,
  //   printBackground: true,
  //   preferCSSPageSize: true,
  // });
  await page.evaluate(() => {
    (window as any).PagedConfig = {};
    (window as any).PagedConfig.auto = true;
    (window as any).PagedConfig.after = () => {
      (window as any).ready = "done";
    };
  });

  const st = await page.addScriptTag({
    path: "public/paged.js",
  });
  const watchDog = await page.waitForFunction('window.ready === "done"');
  await watchDog;
  const innerHTML = await page.evaluate(() => {
    for (const script of document.head.querySelectorAll("script"))
      script.remove();
    return document.body.innerHTML;
  });
  const htmlFinalContent = await page.content();

  let fileHandle = null;
  try {
    fileHandle = await open("./articles/built/html-built.html", "w");
    fileHandle.write(htmlFinalContent);
  } finally {
    fileHandle?.close();
  }

  await browser.close();
})();
