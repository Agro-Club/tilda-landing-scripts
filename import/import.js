"use strict";

const importContainers = $(".importContainer");

importContainers.each((index) => {
  const item = importContainers[index];

  const url = item.dataset.htmlStaticUrl;

  if (url) {
    fetch(url).then((response) => {
      response.text().then((text) => {
        $(item).html(text);
        nodeScriptReplace(item);
      });
    });
  }
});

const nodeScriptReplace = (node) => {
  if (node.tagName === "SCRIPT") return $(node).replaceWith($(node).clone());
  const scripts = $(node).find("script");

  scripts.each((index) => scripts.replaceWith($(scripts[index]).clone()));
};
