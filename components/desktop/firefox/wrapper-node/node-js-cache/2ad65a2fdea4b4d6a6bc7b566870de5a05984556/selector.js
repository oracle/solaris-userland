"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasResource = hasResource;
exports.getResourceIds = getResourceIds;
exports.getResource = getResource;
exports.getMappedResource = getMappedResource;

var _core = require("./core");

function hasResource(state, id) {
  return !!(0, _core.getResourcePair)(state, id);
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function getResourceIds(state) {
  return Object.keys((0, _core.getResourceValues)(state));
}

function getResource(state, id) {
  const pair = (0, _core.getResourcePair)(state, id);
  if (!pair) {
    throw new Error(`Resource ${id} does not exist`);
  }
  return pair.value;
}

function getMappedResource(state, id, map) {
  const pair = (0, _core.getResourcePair)(state, id);
  if (!pair) {
    throw new Error(`Resource ${id} does not exist`);
  }

  return map(pair.value, pair.identity);
}