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
  // await page.goto(`http://localhost:8888/articles/${articleDirName}`, {
  //   waitUntil: "networkidle2",
  // });
  const htmlContent = fs.readFileSync("./articles/built/file.html", "utf8");
  await page.setContent(htmlContent, {
    // waitUntil: "networkidle2",
    // waitUntil: "domcontentloaded",
    // waitUntil: "load",
  });
  // await page.goto(
  //   `file:///home/cos/nodejs-tex-render/articles/built/file.html`,
  //   {
  //     waitUntil: "networkidle2",
  //   }
  // );

  // await page.pdf({
  //   path: `./articles/built/${articleDirName}.pdf`,
  //   printBackground: true,
  //   preferCSSPageSize: true,
  // });
  // page.evaluate(() => ((window as any).PagedConfig = { auto: false }));
  await page.evaluate(() => {
    // (window as any).PagedConfig = (window as any).PagedConfig || {};
    (window as any).PagedConfig = {};
    (window as any).PagedConfig.auto = true;
    (window as any).PagedConfig.after = () => {
      (window as any).ready = "done";
    };
  });

  const st = await page.addScriptTag({
    path: "public/paged.js",
  });

  let fileHandle = null;
  try {
    fileHandle = await open("./articles/built/html-built.html", "w");
    const watchDog = await page.waitForFunction('window.ready === "done"');
    await watchDog;
    const innerHTML = await page.evaluate(() => {
      for (const script of document.head.querySelectorAll("script"))
        script.remove();
      return document.body.innerHTML;
    });
    const htmlFinalContent = await page.content();
    fileHandle.write(htmlFinalContent);
  } finally {
    fileHandle?.close();
  }

  await browser.close();
})();
