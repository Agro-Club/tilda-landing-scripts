const pathname = location.pathname;

const regions = {
  us: {
    title: "USA",
    root: "/us",
  },
  ca: {
    title: "Canada",
    root: "/ca",
  },
  br: {
    title: "Brazil",
    root: "/br",
  },
  es: {
    title: "Spain",
    root: "/es",
  },
  ru: {
    title: "Russia",
    root: "/ru",
  },
};

const regionKeys = Object.keys(regions);

const getRegionByUrl = () => {
  return Object.keys(regions).find((key) => {
    return pathname.indexOf(regions[key].root) !== -1;
  });
};

const redirect = (region: string) => {
  location.replace(`${location.origin}${regions[region].root}`);
};

const onCountryDetect = (detectedRegionElement: JQuery<HTMLElement>) => {
  const regionByUrl = getRegionByUrl();
  if (regionByUrl) return;

  const detectedRegion = detectedRegionElement.text();
  if (detectedRegion === "us") return;
  if (regionKeys.includes(detectedRegion)) redirect(detectedRegion);
};

$(document).ready(() => {
  const span = $('[data-replace-key="detectedRegion"]');
  const handler = () => {
    onCountryDetect(span);
    span[0].removeEventListener("DOMSubtreeModified", handler);
  };
  span.on("DOMSubtreeModified", handler);
});
