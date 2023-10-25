"use strict";

var ua = "Mozilla/5.0 (Windows Phone 10; Android 8.1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116 Mobile Safari/537.36";

function rewriteUserAgentHeaderBlocking(e) {
    for (let header of e.requestHeaders) {
        if (header.name.toLowerCase() === "user-agent") {
            header.value = ua;
        }
    }
    return { requestHeaders: e.requestHeaders };
}

if (typeof browser === "undefined") {
    var browser = chrome;
}

browser.webRequest.onBeforeSendHeaders.addListener(rewriteUserAgentHeaderBlocking, { urls: ["*://*.youtube.com/*"] }, ["blocking", "requestHeaders"]);

chrome.webNavigation.onCompleted.addListener(function (details) {
  const mYouTubeIndexPattern = /^https:\/\/m\.youtube\.com(?:\/supported_browsers)?\/?(?:\?.*)?$/;

  if (mYouTubeIndexPattern.test(details.url)) {
    chrome.tabs.update(details.tabId, { url: "https://www.youtube.com/?app=desktop" });
  }
  else if (details.url.startsWith("https://m.youtube.com/")) {
    const url = new URL(details.url);
    const params = new URLSearchParams(url.search);
    params.set("app", "desktop");
    chrome.tabs.update(details.tabId, { url: `https://www.youtube.com/${url.pathname}?${params.toString()}` });
  }
});
