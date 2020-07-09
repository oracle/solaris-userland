"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sameOrigin = sameOrigin;
exports.parse = void 0;

var _lodash = require("devtools/client/shared/vendor/lodash");

var _whatwgUrl = require("devtools/client/shared/vendor/whatwg-url");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const defaultUrl = {
  hash: "",
  host: "",
  hostname: "",
  href: "",
  origin: "null",
  password: "",
  path: "",
  pathname: "",
  port: "",
  protocol: "",
  search: "",
  // This should be a "URLSearchParams" object
  searchParams: {},
  username: ""
};
const parse = (0, _lodash.memoize)(function parse(url) {
  try {
    const urlObj = new _whatwgUrl.URL(url);
    urlObj.path = urlObj.pathname + urlObj.search;
    return urlObj;
  } catch (err) {
    // If we're given simply a filename...
    if (url) {
      return { ...defaultUrl,
        path: url,
        pathname: url
      };
    }

    return defaultUrl;
  }
});
exports.parse = parse;

function sameOrigin(firstUrl, secondUrl) {
  return parse(firstUrl).origin == parse(secondUrl).origin;
}