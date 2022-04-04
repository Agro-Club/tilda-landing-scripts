"use strict";

const url = location.pathname;

const regions = {
  us: {
    title: "USA",
    root: "/",
  },
  ca: {
    title: "Canada",
    root: "/ca/",
  },
  es: {
    title: "Spain",
    root: "/es/",
  },
  ru: {
    title: "Russia",
    root: "/ru/",
  },
};

//Functions
const setRegionOverride = (region) => {
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

const redirect = (region) => {
  location.replace(`${location.origin}${regions[region].root}`);
};

const regionByUrl = getRegionByUrl();
const regionOverride = getRegionOverride();

const span = $('[data-replace-key="detectedRegion"]');

span.on("DOMSubtreeModified", () => {
  const detectedRegion = span.text();
  if (detectedRegion) {
    // Elements
    const notificationRoot = document.getElementById("regionNotification_root");
    const notificationCountry = document.getElementById(
      "regionNotification_country"
    );
    const notificationForm = document.getElementById("regionNotification_form");
    const notificationCloseButton = document.getElementById(
      "regionNotification_close"
    );

    //Event handlers
    const onClickClose = () => {
      notificationRoot.classList.remove("regionNotification_root_visible");
      setRegionOverride(regionByUrl);
    };

    const onSubmit = (e) => {
      e.preventDefault();
      const code = regionNotification_form.country.value;
      setRegionOverride(code);
      notificationRoot.classList.remove("regionNotification_root_visible");

      if (code !== regionByUrl) {
        redirect(code);
      }
    };

    notificationCloseButton.addEventListener("pointerup", onClickClose);
    notificationForm.addEventListener("submit", onSubmit);

    //Main

    const isRegionMatched = detectedRegion === regionByUrl;
    const isRegionOverrideMatched = regionOverride === regionByUrl;

    if (!isRegionMatched && !regionOverride) {
      notificationRoot.classList.add("regionNotification_root_visible");
    }
    notificationCountry.innerHTML = Object.entries(regions).reduce(
      (acc, [key, region]) => {
        acc += `<option value="${key}" ${
          detectedRegion === key ? 'selected="true"' : ""
        }>${region.title}</option>`;
        return acc;
      },
      ""
    );
  }
});
