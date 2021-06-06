import { mathjax } from "mathjax-full/js/mathjax";
import { TeX } from "mathjax-full/js/input/tex";
import { SVG } from "mathjax-full/js/output/svg";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages";
import { liteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";

const adaptor = liteAdaptor();
const handler = RegisterHTMLHandler(adaptor);
const tex = new TeX({ packages: AllPackages });

const svg = new SVG({fontCache: 'local'});
const html = mathjax.document("", { InputJax: tex, OutputJax: svg });

export function texToSvg(str: string) {
  const node = html.convert(str,
    {
    display: true,
    // em: 16,
    // ex: 8,
    // containerWidth: 1280,
  }
  );
  const svgString = adaptor.innerHTML(node);
  return svgString;
}
