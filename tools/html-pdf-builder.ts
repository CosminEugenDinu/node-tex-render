const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:8080/articles/subj", {
    waitUntil: "networkidle0",
  });
  await page.pdf({
    path: "./articles/built/FAI-Subiecte.pdf",
    format: "A6",
    printBackground: true,
  });

  await browser.close();
})();
