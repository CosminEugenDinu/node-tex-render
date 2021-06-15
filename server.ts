import path from "path";
import express from "express";
import htmlTexBuilder from "./src/html-tex-builder";
const fsPromise = require("fs").promises;

const app = express();

app.use("/", express.static(path.join(__dirname, "./public")));

app.get("/articles/:name", async (req, res) => {
  const articleHtml = `./articles/src/${req.params.name}/index.html`;
  const articleStyle = `./articles/src/${req.params.name}/style.css`;
  const articleJs = `./articles/src/${req.params.name}/main.js`;
  const embedStyles = [articleStyle];
  const embedJs = [articleJs];
  const parsedHtml = await htmlTexBuilder(articleHtml, embedStyles, embedJs);
  res.send(parsedHtml);
  let fileHandle;
  try {
    fileHandle = await fsPromise.open("articles/built/file.html", "w");
    fileHandle.write(parsedHtml);
    await fileHandle.close();
  } catch {
    if (fileHandle !== undefined) {
      await fileHandle.close();
    }
  }
});

app.listen(8888, () => {
  console.log("server started on port 8888");
});
