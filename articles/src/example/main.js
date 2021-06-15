window.PagedConfig = {
  auto: false,
};

var script = document.createElement("script");
script.src = "/paged.js";
script.onload = function () {
  window.PagedPolyfill.preview();
};
document.head.appendChild(script);
