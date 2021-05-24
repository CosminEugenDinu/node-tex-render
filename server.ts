import fs from "fs";
import path from "path";
import express from "express";
import { texToSvg } from "./src/tex-to-svg";
import { parse } from "node-html-parser";
import syntaxHighlight from "./src/highlight";

const app = express();

app.use("/", express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
  fs.readFile("./documents/src/hello.html", "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const root = parse(data);

    // select all <i>LaTeX</i> elements, assuming their text content is TeX code
    const all_i = root.querySelectorAll("i");
    for (const i of all_i) {
      const texStr = i.innerHTML;
      // generate SVG from TeX
      const SVGEquation = texToSvg(texStr);
      // replace text content of element
      i.innerHTML = SVGEquation;
    }

    // select all <pre>markdown</pre> elements
    const all_pre = root.querySelectorAll("pre");
    for (const pre of all_pre) {
      const mdStr = pre.innerHTML;
      // parse markdown content and convert to html with css classes
      const highlighted = await syntaxHighlight(mdStr);
      // replace text content of element
      pre.innerHTML = highlighted.contents;
    }
    res.send(root.toString());
  });
});

app.listen(8080, () => {
  console.log("server started on port 8080");
});
