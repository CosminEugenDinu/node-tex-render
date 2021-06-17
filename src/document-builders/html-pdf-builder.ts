import { open } from "fs/promises";
const puppeteer = require("puppeteer");
import * as minifyHtml from "@minify-html/js";

async function htmlPdfBuilder(srcHtml: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(srcHtml);

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

  await page.evaluate(() => {
    for (const script of document.head.querySelectorAll("script"))
      script.remove();
  });

  const htmlFinalContent = await page.content();

  const htmlBuff = minifyHtml.minify(
    htmlFinalContent,
    minifyHtml.createConfiguration({
      minifyJs: true,
      minifyCss: true,
    })
  );

  const pdfBuff = await page.pdf({
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();

  return { htmlBuff, pdfBuff };
}

export default htmlPdfBuilder;

async function test() {
  const srcHtml = await readFile("./articles/built/file.html");
  if (srcHtml) {
    const { htmlBuff, pdfBuff } = await htmlPdfBuilder(srcHtml.toString());
    await writeFile("./articles/built/html-built.html", htmlBuff);
    await writeFile("./articles/built/pdf-built.html", pdfBuff);
  }
  async function writeFile(filePath: string, content: Buffer) {
    let fileHandle = null;
    try {
      fileHandle = await open(filePath, "w");
      fileHandle.write(content);
    } catch (e) {
      console.log(e);
    } finally {
      fileHandle?.close();
    }
  }

  async function readFile(filePath: string) {
    let fileHandle = null;
    try {
      fileHandle = await open(filePath, "r");
      return fileHandle.readFile();
    } catch (e) {
      console.log(e);
    } finally {
      fileHandle?.close();
    }
  }
}
// test();
