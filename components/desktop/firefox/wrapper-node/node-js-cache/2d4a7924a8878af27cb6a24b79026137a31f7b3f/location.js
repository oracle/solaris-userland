"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.comparePosition = comparePosition;
exports.createLocation = createLocation;
exports.sortSelectedLocations = sortSelectedLocations;

var _lodash = require("devtools/client/shared/vendor/lodash");

var _selectedLocation = require("./selected-location");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function comparePosition(a, b) {
  return a && b && a.line == b.line && a.column == b.column;
}

function createLocation({
  sourceId,
  line = 1,
  column,
  sourceUrl = ""
}) {
  return {
    sourceId,
    line,
    column,
    sourceUrl
  };
}

function sortSelectedLocations(locations, selectedSource) {
  return (0, _lodash.sortBy)(locations, [
  // Priority: line number, undefined column, column number
  location => (0, _selectedLocation.getSelectedLocation)(location, selectedSource).line, location => {
    const selectedLocation = (0, _selectedLocation.getSelectedLocation)(location, selectedSource);
    return selectedLocation.column === undefined || selectedLocation.column;
  }]);
}