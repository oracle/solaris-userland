"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleError = handleError;
exports.promisify = promisify;
exports.endTruncateStr = endTruncateStr;
exports.waitForMs = waitForMs;
exports.downloadFile = downloadFile;


/**
 * Utils for utils, by utils
 * @module utils/utils
 */

/**
 * @memberof utils/utils
 * @static
 */
function handleError(err) {
  console.log("ERROR: ", err);
}

/**
 * @memberof utils/utils
 * @static
 */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function promisify(context, method, ...args) {
  return new Promise((resolve, reject) => {
    args.push(response => {
      if (response.error) {
        reject(response);
      } else {
        resolve(response);
      }
    });
    method.apply(context, args);
  });
}

/**
 * @memberof utils/utils
 * @static
 */
function endTruncateStr(str, size) {
  if (str.length > size) {
    return `…${str.slice(str.length - size)}`;
  }
  return str;
}

function waitForMs(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadFile(content, fileName) {
  if (content.type !== "text") {
    return;
  }

  const data = content.value;
  const { body } = document;
  if (!body) {
    return;
  }

  const a = document.createElement("a");
  body.appendChild(a);
  a.className = "download-anchor";
  a.href = window.URL.createObjectURL(new Blob([data], { type: "text/javascript" }));
  a.setAttribute("download", fileName);
  a.click();
  body.removeChild(a);
}