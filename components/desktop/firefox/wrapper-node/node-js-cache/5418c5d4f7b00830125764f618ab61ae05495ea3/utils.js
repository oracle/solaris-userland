"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRelativePath = getRelativePath;
exports.safeDecodeItemName = safeDecodeItemName;
loader.lazyRequireGetter(this, "_url", "devtools/client/debugger/src/utils/url");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Get the relative path of the url
 * Does not include any query parameters or fragment parts
 *
 * @param string url
 * @returns string path
 */
function getRelativePath(url) {
  const {
    pathname
  } = (0, _url.parse)(url);

  if (!pathname) {
    return url;
  }

  const index = pathname.indexOf("/");

  if (index !== -1) {
    const path = pathname.slice(index + 1); // If the path is empty this is likely the index file.
    // e.g http://foo.com/

    if (path == "") {
      return "(index)";
    }

    return path;
  }

  return "";
}
/**
 *
 * @param {String} name: Name (e.g. computed in SourcesTreeItem renderItemName),
 *                       which might include URI search.
 * @returns {String} result of `decodedURI(name)`, or name if it `name` is malformed.
 */


function safeDecodeItemName(name) {
  try {
    return decodeURI(name);
  } catch (e) {
    return name;
  }
}