const puppeteer = require("puppeteer");

const articleDirName = "pedagogie1";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:8080/articles/${articleDirName}`, {
    waitUntil: "networkidle0",
  });
  await page.pdf({
    path: `./articles/built/${articleDirName}.pdf`,
    format: "A6",
    printBackground: true,
  });

  await browser.close();
})();
