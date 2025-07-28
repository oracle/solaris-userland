"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basename = basename;
exports.dirname = dirname;
exports.isURL = isURL;
exports.isAbsolute = isAbsolute;
exports.join = join;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function basename(path) {
  return path.split("/").pop();
}

function dirname(path) {
  const idx = path.lastIndexOf("/");
  return path.slice(0, idx);
}

function isURL(str) {
  return str.includes("://");
}

function isAbsolute(str) {
  return str[0] === "/";
}

function join(base, dir) {
  return `${base}/${dir}`;
}