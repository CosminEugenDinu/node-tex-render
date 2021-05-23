import fs from "fs";
import path from "path";
import express from "express";
import { texToSvg } from "./src/tex-to-svg";
import { parse } from "node-html-parser";

const app = express();

app.use("/", express.static(path.join(__dirname, "./public")));

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

const head = `<head>
<link rel="stylesheet" href="/github.css">
</head>`;
const str = `
\`\`\`py
print("hello")
\`\`\`
`;

import { process } from "./src/highlight";
app.get("/s", (req, res) => {
  const out = process(str);
  out.then(r=>res.send(head + '<body>'+r.contents+'</body>'));
  // out.then(r=>res.send(r.contents));
  // res.send()
});

app.listen(8080, () => {
  console.log("server started on port 8080");
});
