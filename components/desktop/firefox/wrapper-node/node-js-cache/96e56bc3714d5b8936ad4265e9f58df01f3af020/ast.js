"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setOutOfScopeLocations = setOutOfScopeLocations;

var _selectors = require("../selectors/index");

var _setInScopeLines = require("./ast/setInScopeLines");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function setOutOfScopeLocations(cx) {
  return async ({ dispatch, getState, parser }) => {
    const location = (0, _selectors.getSelectedLocation)(getState());
    if (!location) {
      return;
    }

    const { source, content } = (0, _selectors.getSourceWithContent)(getState(), location.sourceId);

    if (!content) {
      return;
    }

    let locations = null;
    if (location.line && source && !source.isWasm) {
      locations = await parser.findOutOfScopeLocations(source.id, location);
    }

    dispatch({
      type: "OUT_OF_SCOPE_LOCATIONS",
      cx,
      locations
    });
    dispatch((0, _setInScopeLines.setInScopeLines)(cx));
  };
}