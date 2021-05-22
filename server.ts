import fs from "fs";
import express from "express";
import { texToSvg } from "./src/tex-to-svg"
import { parse } from 'node-html-parser';

const myTeXEquation = "\\frac{n!}{k!(n-k)!} = \\binom{n}{k}";

// const SVGEquation = texToSvg(myTeXEquation);

const app = express();

const root = parse(`
<i style="font-size:xxx-large">\\frac{n!}{k!(n-k)!} = \\binom{n}{k};</i>
<i style="font-size:small">\\frac{n!}{k!(n-k)!} = \\binom{n}{k};</i>
`);
app.get("/", (req, res) => {
  const allP = root.querySelectorAll("i");
  for (const el of allP) {
    el.innerHTML = texToSvg(el.innerHTML);
  }
  res.send(allP.join(''));
});

app.get("/html", (req, res) => {
  fs.readFile('./documents/hello.html', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    const root = parse(data);
    const all_i = root.querySelectorAll("i");
    for (const i of all_i) {
      i.innerHTML = texToSvg(i.innerHTML);
    }
    res.send(root.toString());
    // console.log(root.toString())
  })
})


app.listen(8080, () => {
  console.log("server started on port 8080");
});
