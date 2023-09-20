const URL_SEARCH = new URLSearchParams(window.location.search);
const isLocal = URL_SEARCH.has("local");

function getDomain() {
  if (isLocal) {
    return typeof LOCAL_DOMAIN !== "undefined"
      ? LOCAL_DOMAIN
      : "http://127.0.0.1:5500";
  } else {
    return typeof LIVE_DOMAIN !== "undefined"
      ? LIVE_DOMAIN
      : "http://hackathon-fastgen-2023.pages.dev/";
  }
}

function loadScript(url, options = {}) {
  let script = document.createElement("script");
  if (url.startsWith("http")) {
    script.src = url;
  } else {
    script.src = `${getDomain()}${url}`;
  }
  Object.keys(options).forEach(function (key) {
    script.setAttribute(key, options[key]);
  });
  document.body.appendChild(script);
}

function loadScripts(scriptsArr) {
  scriptsArr.forEach((script) => {
    loadScript(script.url, script.options);
  });
}

function loadScriptsRegardingEnv(scriptsToLoad) {
  if (!scriptsToLoad) {
    console.log("No scripts to load");
    return;
  }

  loadScripts(scriptsToLoad);
}

function loadStyleSheet(url) {
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  if (url.startsWith("http")) {
    link.href = url;
  } else {
    link.href = `${getDomain()}${url}`;
  }
  document.head.appendChild(link);
}

function loadStyleSheets(stylesArr) {
  stylesArr.forEach((style) => {
    loadStyleSheet(style.url);
  });
}

function loadStyleSheetsRegardingEnv(stylesToLoad) {
  if (!stylesToLoad) {
    console.log("No styles to load");
    return;
  }

  loadStyleSheets(stylesToLoad);
}