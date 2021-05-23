import fs from "fs";
import express from "express";
import { texToSvg } from "./src/tex-to-svg";
import { parse } from "node-html-parser";

const app = express();

app.get("/", (req, res) => {
  fs.readFile("./documents/src/hello.html", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const root = parse(data);
    const all_i = root.querySelectorAll("i");
    for (const i of all_i) {
      const texStr = i.innerHTML;
      const SVGEquation = texToSvg(texStr);
      i.innerHTML = SVGEquation;
    }
    res.send(root.toString());
  });
});

app.listen(8080, () => {
  console.log("server started on port 8080");
});
