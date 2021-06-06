import path from "path";
import express from "express";
import htmlTexBuilder from "./src/html-tex-builder";

const app = express();

app.use("/", express.static(path.join(__dirname, "./public")));

app.get("/articles/:name", async (req, res) => {
  const articleRelPath = `./articles/src/${req.params.name}.html`;
  const embedStyles = ["./public/style.css", "./public/syntax-light.css"];
  const parsedHtml = await htmlTexBuilder(articleRelPath, embedStyles);
  res.send(parsedHtml);
});

app.listen(8080, () => {
  console.log("server started on port 8080");
});
