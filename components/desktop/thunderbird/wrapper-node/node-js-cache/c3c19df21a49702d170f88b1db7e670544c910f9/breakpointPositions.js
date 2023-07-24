"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findPosition = findPosition;
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_selectedLocation", "devtools/client/debugger/src/utils/selected-location");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function findPosition(positions, location) {
  if (!positions) {
    return null;
  }

  const lineBps = positions[location.line];

  if (!lineBps) {
    return null;
  }

  return lineBps.find(pos => (0, _location.comparePosition)((0, _selectedLocation.getSelectedLocation)(pos, location), location));
}