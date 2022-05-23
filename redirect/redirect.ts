const url = location.pathname;

const regions = {
  us: {
    title: "USA",
    root: "/",
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

//Functions
const setRegionOverride = (region: string) => {
  sessionStorage.setItem("OVERRIDE_REGION", region);
};

const getRegionOverride = () => sessionStorage.getItem("OVERRIDE_REGION");

const getRegionByUrl = () => {
  switch (true) {
    case url.includes(regions.ca.root):
      return "ca";
    case url.includes(regions.es.root):
      return "es";
    case url.includes(regions.ru.root):
      return "ru";
    default:
      return "us";
  }
};

const redirect = (region: string) => {
  location.replace(`${location.origin}${regions[region].root}`);
};

const onCountryDetect = () => {
  const span = $('[data-replace-key="detectedRegion"]');
  const regionByUrl = getRegionByUrl();
  const regionOverride = getRegionOverride();
  const detectedRegion = span.text();

  if (regionKeys.includes(detectedRegion)) {
    if (!regionOverride) {
      setRegionOverride(detectedRegion);
      if (detectedRegion != regionByUrl) redirect(detectedRegion);
    }
  }
};

$(document).ready(() => {
  const span = $('[data-replace-key="detectedRegion"]');
  span.on("DOMSubtreeModified", onCountryDetect);
});
