const url = location.pathname;

const regions = {
  us: {
    title: "USA",
    root: "/us",
  },
  ca: {
    title: "Canada",
    root: "/ca",
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
  console.log(location.pathname);
  switch (true) {
    case url.includes(regions.ca.root):
      return "ca";
    case url.includes(regions.es.root):
      return "es";
    case url.includes(regions.ru.root):
      return "ru";
    case url.includes(regions.us.root):
      return "us";
    default:
      return null;
  }
};

const redirect = (region: string) => {
  location.replace(`${location.origin}${regions[region].root}`);
};

const onCountryDetect = () => {
  const regionByUrl = getRegionByUrl();
  if (regionByUrl) return;

  const span = $('[data-replace-key="detectedRegion"]');
  const detectedRegion = span.text();
  if (regionKeys.includes(detectedRegion) && detectedRegion !== "us")
    redirect(detectedRegion);
};

$(document).ready(() => {
  const span = $('[data-replace-key="detectedRegion"]');
  span.on("DOMSubtreeModified", onCountryDetect);
});
