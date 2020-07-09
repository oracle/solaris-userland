"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasResource = hasResource;
exports.getResourceIds = getResourceIds;
exports.getResource = getResource;
exports.getMappedResource = getMappedResource;
loader.lazyRequireGetter(this, "_core", "devtools/client/debugger/src/utils/resource/core");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function hasResource(state, id) {
  return !!(0, _core.getValidatedResource)(state, id);
}

function getResourceIds(state) {
  return Object.keys((0, _core.getResourceValues)(state));
}

function getResource(state, id) {
  const validatedState = (0, _core.getValidatedResource)(state, id);

  if (!validatedState) {
    throw new Error(`Resource ${id} does not exist`);
  }

  return validatedState.values[id];
}

function getMappedResource(state, id, map) {
  const validatedState = (0, _core.getValidatedResource)(state, id);

  if (!validatedState) {
    throw new Error(`Resource ${id} does not exist`);
  }

  return map(validatedState.values[id], validatedState.identity[id]);
}