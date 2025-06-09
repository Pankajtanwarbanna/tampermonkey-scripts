// ==UserScript==
// @name         Auto Accept LinkedIn Requests
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically accept all pending LinkedIn connection requests
// @author       Pankaj
// @match        https://www.linkedin.com/mynetwork/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    
    function clickAcceptButtons() {
        const buttons = document.querySelectorAll('button');
        let acceptedCount = 0;

        buttons.forEach(button => {
            if (button.innerText.trim().toLowerCase() === 'accept') {
                button.click();
                acceptedCount++;
            }
        });

        if (acceptedCount > 0) {
            console.log(`✅ Accepted ${acceptedCount} connection request(s).`);
        } else {
            console.log('ℹ️ No accept buttons found.');
        }
    }

    // Run every 3 seconds to catch newly loaded requests
    setInterval(clickAcceptButtons, 10);
})();