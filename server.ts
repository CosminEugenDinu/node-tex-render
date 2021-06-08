import path from "path";
import express from "express";
import htmlTexBuilder from "./src/html-tex-builder";

const app = express();

app.use("/", express.static(path.join(__dirname, "./public")));

app.get("/articles/:name", async (req, res) => {
  const articleRelPath = `./articles/src/${req.params.name}`;
  const articleHtml = path.join(articleRelPath, "index.html");
  const articleStyle = path.join(articleRelPath, "style.css");
  const embedStyles = [articleStyle];
  const parsedHtml = await htmlTexBuilder(articleHtml, embedStyles);
  res.send(parsedHtml);
});

app.listen(8080, () => {
  console.log("server started on port 8080");
});
