$(document).ready(() => {
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

  const regionByUrl = getRegionByUrl();
  const regionOverride = getRegionOverride();

  const span = $('[data-replace-key="detectedRegion"]');

  const onCountryDetect = () => {
    const detectedRegion = span.text();

    if (regionKeys.includes(detectedRegion)) {
      // Elements
      const notificationRoot = $("#regionNotification__root");
      const notificationCountry = $("#regionNotification__country");
      const notificationForm = $("#regionNotification__form");
      const notificationCloseButton = $("#regionNotification__close");

      //Event handlers
      const onClickClose = () => {
        notificationRoot.removeClass("regionNotification__root__visible");
        setRegionOverride(regionByUrl);
      };

      const onSubmit = (e) => {
        e.preventDefault();
        const code = notificationCountry.val();
        notificationRoot.removeClass("regionNotification__root__visible");

        if (typeof code === "string" && code !== regionByUrl) {
          setRegionOverride(code);
          redirect(code);
        }
      };

      notificationCloseButton.on("pointerup", onClickClose);
      notificationForm.on("submit", onSubmit);

      //Main

      const isRegionMatched = detectedRegion === regionByUrl;

      if (!isRegionMatched && !regionOverride) {
        notificationRoot.addClass("regionNotification__root__visible");
      }
      notificationCountry.html(
        Object.entries(regions).reduce((acc, [key, region]) => {
          acc += `<option value="${key}" ${
            detectedRegion === key ? 'selected="true"' : ""
          }>${region.title}</option>`;
          return acc;
        }, "")
      );
    }
  };

  span.on("DOMSubtreeModified", onCountryDetect);
});
