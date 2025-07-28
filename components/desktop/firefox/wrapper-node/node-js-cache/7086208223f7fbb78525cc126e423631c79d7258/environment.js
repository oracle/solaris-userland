"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNode = isNode;
exports.isNodeTest = isNodeTest;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function isNode() {
  try {
    return process.release.name == "node";
  } catch (e) {
    return false;
  }
}

function isNodeTest() {
  return isNode() && process.env.NODE_ENV != "production";
}