// ==UserScript==
// @name         GitHub CI Artifacts Tag Copier
// @namespace    https://github.com/
// @version      1.1
// @description  Adds copy buttons for Docker Image tag and Helm version tag on GitHub PR Checks page for work repos
// @author       Pankaj Tanwar
// @match        https://github.com/*/*/pull/*/checks
// @grant        GM_setClipboard
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // Add CSS for toast notification
    const style = document.createElement('style');
    style.textContent = `
        .copy-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            max-width: 300px;
            word-break: break-all;
        }

        .copy-toast.show {
            opacity: 1;
            transform: translateY(0);
        }

        .copy-toast::before {
            content: '✓ ';
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);

    // Function to show toast notification
    function showToast(message) {
        // Remove any existing toast
        const existingToast = document.querySelector('.copy-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create new toast
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = `Copied: ${message}`;

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Remove after 2 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 2000);
    }

    // Helper to create copy button
    function createCopyBtn(textToCopy) {
        const btn = document.createElement('button');
        btn.textContent = '📋 Copy';
        btn.style.cursor = 'pointer';
        btn.style.marginLeft = '8px';
        btn.title = 'Copy to clipboard';

        // Style for a nicer button
        btn.style.border = '1px solid #ccc';
        btn.style.borderRadius = '4px';
        btn.style.fontSize = '14px';
        btn.style.lineHeight = '1.5';

        btn.addEventListener('click', () => {
            if (typeof GM_setClipboard === 'function') {
                GM_setClipboard(textToCopy);
                showToast(textToCopy);
            } else {
                // fallback
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(textToCopy);
                }).catch(() => {
                    showToast('Failed to copy!');
                });
            }
        });

        return btn;
    }

    // Wait for the artifact table to load (observe DOM changes or wait a bit)
    function waitForArtifacts() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                // The Docker Images section is a table row with text "Docker Images"
                const dockerHeader = [...document.querySelectorAll('th')]
                    .find(th => th.textContent.trim() === 'Docker Images');
                const helmHeader = [...document.querySelectorAll('th')]
                    .find(th => th.textContent.trim() === 'Helm');

                if (dockerHeader && helmHeader) {
                    clearInterval(interval);
                    resolve({ dockerHeader, helmHeader });
                }
            }, 500);

            // Timeout after 10s just in case
            setTimeout(() => clearInterval(interval), 10000);
        });
    }

    waitForArtifacts().then(({ dockerHeader, helmHeader }) => {
        // Docker Images first tag
        try {
            // The docker images tags are inside <td> sibling of the dockerHeader <th>
            const dockerTd = dockerHeader.nextElementSibling;
            if (dockerTd) {
                // Find first <li> inside dockerTd, extract the image tag part after colon :
                const firstDockerLi = dockerTd.querySelector('li');
                if (firstDockerLi) {
                    const fullText = firstDockerLi.textContent.trim();
                    const tagMatch = fullText.match(/:(\S+)\s/);
                    if (tagMatch) {
                        const tag = tagMatch[1];
                        // Append copy button after the tag in the <li>
                        // We find the text node containing tag and insert after it
                        const textNode = [...firstDockerLi.childNodes]
                            .find(n => n.nodeType === Node.TEXT_NODE && n.textContent.includes(tag));
                        if (textNode) {
                            // Insert button right after tag text
                            // We'll split the textNode into beforeTag, tag, afterTag
                            const idx = textNode.textContent.indexOf(tag);
                            const before = textNode.textContent.slice(0, idx + tag.length);
                            const after = textNode.textContent.slice(idx + tag.length);

                            // Replace original textNode with before text node
                            const beforeNode = document.createTextNode(before);
                            firstDockerLi.replaceChild(beforeNode, textNode);

                            // Insert copy button
                            const btn = createCopyBtn(tag);
                            firstDockerLi.insertBefore(btn, null);

                            // Insert after text node if any
                            if (after.length > 0) {
                                const afterNode = document.createTextNode(after);
                                firstDockerLi.insertBefore(afterNode, null);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('Docker copy button error', e);
        }

        // Helm first version tag
        try {
            const helmTd = helmHeader.nextElementSibling;
            if (helmTd) {
                // The helm tags seem to be inside <li> with text like eidos-0.1.90-198e5e9e-2.tgz [4 KB]
                // Or inside the oci URLs with eidos:0.1.90-198e5e9e-2
                // We'll pick the first <li> text, and extract the version tag matching regex like 0.1.90-198e5e9e-2
                const firstHelmLi = helmTd.querySelector('li');
                if (firstHelmLi) {
                    const text = firstHelmLi.textContent.trim();
                    // regex for version: digits.digits.digits-<hash>
                    const versionMatch = text.match(/\b(\d+\.\d+\.\d+-[a-z0-9\-]+)\b/);
                    if (versionMatch) {
                        const version = versionMatch[1];

                        // Insert copy button after the version string in the <li>
                        const textNode = [...firstHelmLi.childNodes]
                            .find(n => n.nodeType === Node.TEXT_NODE && n.textContent.includes(version));
                        if (textNode) {
                            const idx = textNode.textContent.indexOf(version);
                            const before = textNode.textContent.slice(0, idx + version.length);
                            const after = textNode.textContent.slice(idx + version.length);

                            const beforeNode = document.createTextNode(before);
                            firstHelmLi.replaceChild(beforeNode, textNode);

                            const btn = createCopyBtn(version);
                            firstHelmLi.insertBefore(btn, null);

                            if (after.length > 0) {
                                const afterNode = document.createTextNode(after);
                                firstHelmLi.insertBefore(afterNode, null);
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.warn('Helm copy button error', e);
        }
    });
    console.log("done")

})();