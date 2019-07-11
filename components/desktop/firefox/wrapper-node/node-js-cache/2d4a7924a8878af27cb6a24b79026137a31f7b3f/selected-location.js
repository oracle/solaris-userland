"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSelectedLocation = getSelectedLocation;

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

function getSelectedLocation(mappedLocation, context) {
  if (!context) {
    return mappedLocation.location;
  }

  // $FlowIgnore
  const sourceId = context.sourceId || context.id;
  return (0, _devtoolsSourceMap.isOriginalId)(sourceId) ? mappedLocation.location : mappedLocation.generatedLocation;
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */