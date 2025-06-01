// ==UserScript==
// @name         Shame Meter
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Roasts you brutally while you waste time. Now meaner, darker, and more effective.
// @author       Pankaj Tanwar
// @match        *://*.youtube.com/*
// @match        *://*.reddit.com/*
// @match        *://*.x.com/*
// @match        *://*.linkedin.com/*
// @match        *://news.ycombinator.com/*
// @match        *://*.instagram.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const brutalRoasts = [
        "You're not even procrastinating productively. This is just sad.",
        "You've scrolled so long even your ancestors are embarrassed.",
        "Dreams? Goals? Nah, you chose this pit instead.",
        "Elon builds rockets. You refresh Twitter.",
        "This is the highlight of your day, isn't it?",
        "You're basically free labor for Big Tech's engagement metrics.",
        "At this point, you're just furniture for the algorithm.",
        "Somewhere out there, your to-do list is sobbing.",
        "Doomscroll harder, maybe you'll find purpose at the bottom.",
        "Imagine explaining this session to your therapist.",
        "Each scroll is one step away from your potential.",
        "You're wasting pixels and potential simultaneously.",
        "If regret was currency, you’d be a billionaire.",
        "Wow, 10 minutes of absolutely nothing. Iconic.",
        "You vs productivity: 0–37 today. Keep going, champ.",
        "This is why your smart devices are disappointed in you.",
        "You're the main character… in a cautionary tale.",
        "Your career arc is currently a flatline.",
        "How’s that dopamine hit working out, champ?",
        "This page is more active than your ambition.",
        "You skipped leg day and now this too?",
        "Hope you're proud of this legacy of scrolls.",
        "By all means, keep feeding the content monster.",
        "Every second here is a victory for entropy.",
        "Your FBI agent just rolled their eyes again.",
        "If time was money, you're in deep debt."
    ];

    let secondsSpent = 0;

    const shameBox = document.createElement('div');
    shameBox.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    padding: 16px 20px;
    width: 360px;
    background: rgba(20, 20, 20, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    font-family: 'Segoe UI', sans-serif;
    color: #fff;
    backdrop-filter: blur(12px);
  `;

    shameBox.innerHTML = `
    <div style="font-size: 18px; font-weight: 700; margin-bottom: 4px; color: #ff5252;">💀 Shame Meter</div>
    <div id="roast-time" style="font-size: 14px; margin-bottom: 10px;">Time wasted: 0s</div>
    <div id="roast-bar-container" style="background:#333; border-radius:8px; height:12px; width:100%; overflow:hidden;">
      <div id="roast-bar" style="background:linear-gradient(90deg, #ff4d4d, #ff9900); height:100%; width:0%; border-radius:8px; transition: width 0.4s ease;"></div>
    </div>
    <div id="roast-quote" style="font-size: 13px; font-style: italic; margin-top:10px; color:#ddd;"></div>
  `;

    document.body.appendChild(shameBox);

    function getBrutalRoast() {
        return brutalRoasts[Math.floor(Math.random() * brutalRoasts.length)];
    }

    function updateRoastUI() {
        secondsSpent += 1;
        const percent = Math.min((secondsSpent / 300) * 100, 100);
        document.getElementById("roast-time").textContent = `Time wasted: ${secondsSpent}s`;
        document.getElementById("roast-bar").style.width = percent + "%";

        if (secondsSpent % 15 === 0) {
            document.getElementById("roast-quote").textContent = getBrutalRoast();
        }
    }

    setInterval(updateRoastUI, 1000);
})();
