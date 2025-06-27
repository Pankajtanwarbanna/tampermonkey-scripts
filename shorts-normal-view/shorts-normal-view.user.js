// ==UserScript==
// @name         UnShort YouTube – Redirect Shorts to Full View
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically redirects YouTube Shorts to the full video watch page for better controls and comments access.
// @author       You
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    // Redirect on initial page load if it's a Shorts URL
    if (window.location.pathname.match(/\/shorts\/.+/)) {
        window.location.replace("https://www.youtube.com/watch?v=" + window.location.pathname.split('/shorts/').pop());
    }

    // Handle SPA (internal navigation) redirects
    document.addEventListener("yt-navigate-start", (event) => {
        const url = event.detail.url.split('/shorts/');
        if (url.length > 1) {
            window.location.replace("https://www.youtube.com/watch?v=" + url.pop());
        }
    });
})();