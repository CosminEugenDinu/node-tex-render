const express = require("express");
const TeXToSVG = require("tex-to-svg");

const myTeXEquation = "\\frac{n!}{k!(n-k)!} = \\binom{n}{k}";

const options = {
  width: 1280,
  ex: 8,
  em: 16,
};

const SVGEquation = TeXToSVG(myTeXEquation, options);

const app = express();
app.get("/", (req, res) => {
  res.send(SVGEquation);
});
app.listen(8080, () => {
  console.log("server started on port 8080");
});
