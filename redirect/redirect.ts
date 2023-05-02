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
    case url.includes(regions.us.root):
      return "us";
    default:
      return null;
  }
};

const redirect = (region: string) => {
  location.replace(`${location.origin}${regions[region].root}`);
};

/**
 * Algorithm
 * 1. If no region is in url (e.g. root) then continue to step 2a, else to 2b
 * 2a. If region from tilda "detectedRegion" is known then go to step 3a, else to 3b
 * 2b. Just redirect to us
 * 3a. If "regionOverride" isn't set in localStorage then set it to detected region and redirect
 * 3b. Redirect to "regionOverride"
 */
const onCountryDetect = () => {
  const regionByUrl = getRegionByUrl();
  if (regionByUrl) return setRegionOverride(regionByUrl);

  const regionOverride = getRegionOverride();
  if (regionOverride) return redirect(regionOverride);

  const span = $('[data-replace-key="detectedRegion"]');
  const detectedRegion = span.text();
  if (regionKeys.includes(detectedRegion)) {
    setRegionOverride(detectedRegion);
    if (detectedRegion !== regionByUrl && detectedRegion !== "us")
      redirect(detectedRegion);
  } else {
    setRegionOverride("us");
  }
};

$(document).ready(() => {
  const span = $('[data-replace-key="detectedRegion"]');
  span.on("DOMSubtreeModified", onCountryDetect);
});
