"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSelectedFrameVisible = isSelectedFrameVisible;

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

var _ = require("./index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function getGeneratedId(sourceId) {
  if ((0, _devtoolsSourceMap.isOriginalId)(sourceId)) {
    return (0, _devtoolsSourceMap.originalToGeneratedId)(sourceId);
  }

  return sourceId;
}

/*
 * Checks to if the selected frame's source is currently
 * selected.
 */
function isSelectedFrameVisible(state) {
  const thread = (0, _.getCurrentThread)(state);
  const selectedLocation = (0, _.getSelectedLocation)(state);
  const selectedFrame = (0, _.getSelectedFrame)(state, thread);

  if (!selectedFrame || !selectedLocation) {
    return false;
  }

  if ((0, _devtoolsSourceMap.isOriginalId)(selectedLocation.sourceId)) {
    return selectedLocation.sourceId === selectedFrame.location.sourceId;
  }

  return selectedLocation.sourceId === getGeneratedId(selectedFrame.location.sourceId);
}