import path from "path";
import express from "express";
import htmlTexBuilder from "./src/html-tex-builder";
import { open } from "fs/promises";
import htmlPdfBuilder from "./src/document-builders/html-pdf-builder";

const app = express();

app.use("/", express.static(path.join(__dirname, "./public")));

app.get("/articles/:name", async (req, res) => {
  const articleName = req.params.name;
  const articleHtml = `./articles/src/${articleName}/index.html`;
  const articleStyle = `./articles/src/${articleName}/style.css`;
  const articleJs = `./articles/src/${articleName}/main.js`;
  const embedStyles = [articleStyle];
  const embedJs = [articleJs];
  const parsedHtml = await htmlTexBuilder(articleHtml, embedStyles, embedJs);
  if (parsedHtml) {
    const { htmlBuff, pdfBuff } = await htmlPdfBuilder(parsedHtml);
    res.send(htmlBuff.toString());
    await writeFile(`./articles/built/${articleName}-built.html`, htmlBuff);
    await writeFile(`./articles/built/${articleName}-built.pdf`, pdfBuff);
  }
});

app.listen(8888, () => {
  console.log("server started on port 8888");
});

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
