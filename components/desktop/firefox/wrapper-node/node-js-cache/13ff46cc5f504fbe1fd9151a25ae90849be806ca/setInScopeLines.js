"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setInScopeLines = setInScopeLines;

var _selectors = require("../../selectors/index");

var _source = require("../../utils/source");

var _lodash = require("devtools/client/shared/vendor/lodash");

var _asyncValue = require("../../utils/async-value");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function getOutOfScopeLines(outOfScopeLocations) {
  if (!outOfScopeLocations) {
    return null;
  }

  return (0, _lodash.uniq)((0, _lodash.flatMap)(outOfScopeLocations, location => (0, _lodash.range)(location.start.line, location.end.line)));
}

function setInScopeLines(cx) {
  return ({ dispatch, getState }) => {
    const sourceWithContent = (0, _selectors.getSelectedSourceWithContent)(getState());
    const outOfScopeLocations = (0, _selectors.getOutOfScopeLocations)(getState());

    if (!sourceWithContent || !sourceWithContent.content) {
      return;
    }
    const content = sourceWithContent.content;

    const linesOutOfScope = getOutOfScopeLines(outOfScopeLocations);

    const sourceNumLines = (0, _asyncValue.isFulfilled)(content) ? (0, _source.getSourceLineCount)(content.value) : 0;
    const sourceLines = (0, _lodash.range)(1, sourceNumLines + 1);

    const inScopeLines = !linesOutOfScope ? sourceLines : (0, _lodash.without)(sourceLines, ...linesOutOfScope);

    dispatch({
      type: "IN_SCOPE_LINES",
      cx,
      lines: inScopeLines
    });
  };
}