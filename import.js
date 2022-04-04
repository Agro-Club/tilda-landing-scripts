"use strict";

const importContainers = $(".importContainer");

importContainers.each((index) => {
  const item = importContainers[index];

  const url = item.dataset.htmlStaticUrl;

  if (url) {
    fetch(url).then((response) => {
      response.text().then((text) => {
        console.log(text);
        $(item).html(text);
        nodeScriptReplace(item);
      });
    });
  }
});

const isScript = (node) => node.tagName === "SCRIPT";

const nodeScriptReplace = (node) => {
  const script = $(node).children("script");
  script.replaceWith(nodeScriptClone(script));
};

const nodeScriptClone = (node) => {
  const script = document.createElement("script");
  script.text = node.innerHTML;

  let i = -1;
  let attr;

  const attrs = node.attributes;
  while (++i < attrs.length) {
    script.setAttribute((attr = attrs[i]).name, attr.value);
  }

  return script;
};
