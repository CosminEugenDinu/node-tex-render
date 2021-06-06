import { readFile } from "fs/promises";
import { texToSvg } from "./text-processors/tex2svg";
import { parse, HTMLElement } from "node-html-parser";
import syntaxHighlight from "./text-processors/md2html";

export default async function htmlTexBuilder(
  htmlFilePath: string,
  cssFilePaths: string[]
) {
  try {
    const documentBuffer = await readFile(htmlFilePath);
    const document = parse(documentBuffer.toString());
    const cssFileBufPromises = cssFilePaths.map((cssPath) => {
      return readFile(cssPath);
    });

    // embed styles
    const headElem = document.querySelector("head");
    const style = new HTMLElement("style", {}, "", headElem);

    style.textContent = (await Promise.all(cssFileBufPromises)).map(buf => {
      return buf.toString();
    }).join('');
    headElem.appendChild(style);

    // convert html-latex to svg
    // select all <i>LaTeX</i> elements, assuming their text content is TeX code
    const all_i = document.querySelectorAll("i");
    for (const i of all_i) {
      const texStr = i.innerHTML;
      // generate SVG from TeX
      const SVGEquation = texToSvg(texStr);
      // replace text content of element
      i.innerHTML = SVGEquation;
    }

    // css highlight code from html-markdown
    // select all <pre>markdown</pre> elements
    const all_pre = document.querySelectorAll("pre");
    for (const pre of all_pre) {
      const mdStr = pre.innerHTML;
      // parse markdown content and convert to html with css classes
      const highlighted = await syntaxHighlight(mdStr);
      // replace text content of element
      pre.innerHTML = highlighted.contents;
    }
    return document.toString();
  } catch (err) {
    // When a request is aborted - err is an AbortError
    console.error(err);
  }
}
