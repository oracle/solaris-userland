"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSelectedFrameVisible = isSelectedFrameVisible;

var _index = require("devtools/client/shared/source-map-loader/index");

loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/selectors/sources");
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/selectors/pause");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getGeneratedId(source) {
  if (source.isOriginal) {
    return (0, _index.originalToGeneratedId)(source.id);
  }

  return source.id;
}
/*
 * Checks to if the selected frame's source is currently
 * selected.
 */


function isSelectedFrameVisible(state) {
  const selectedLocation = (0, _sources.getSelectedLocation)(state);
  const selectedFrame = (0, _pause.getSelectedFrame)(state);

  if (!selectedFrame || !selectedLocation) {
    return false;
  }

  if (selectedLocation.source.isOriginal) {
    return selectedLocation.source.id === selectedFrame.location.source.id;
  }

  return selectedLocation.source.id === getGeneratedId(selectedFrame.location.source);
}