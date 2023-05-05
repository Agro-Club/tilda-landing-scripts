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
  Object.keys(regions).map((key) => {
    if (pathname === regions[key].root) return key;
  });
  return null;
};

const redirect = (region: string) => {
  console.log(region);
  location.replace(`${location.origin}${regions[region].root}`);
};

const onCountryDetect = () => {
  console.log("Hello!");
  const regionByUrl = getRegionByUrl();
  console.log(regionByUrl);
  if (regionByUrl) return;

  const span = $('[data-replace-key="detectedRegion"]');
  const detectedRegion = span.text();
  console.log(detectedRegion);
  if (detectedRegion === "us") return;
  if (regionKeys.includes(detectedRegion)) redirect(detectedRegion);
};

$(document).ready(() => {
  const span = $('[data-replace-key="detectedRegion"]');
  span.on("DOMSubtreeModified", onCountryDetect);
});
