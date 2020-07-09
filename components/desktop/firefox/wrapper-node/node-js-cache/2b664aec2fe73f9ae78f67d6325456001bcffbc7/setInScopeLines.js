"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setInScopeLines = setInScopeLines;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

var _lodash = require("devtools/client/shared/vendor/lodash");

loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getOutOfScopeLines(outOfScopeLocations) {
  if (!outOfScopeLocations) {
    return null;
  }

  return (0, _lodash.uniq)((0, _lodash.flatMap)(outOfScopeLocations, location => (0, _lodash.range)(location.start.line, location.end.line)));
}

async function getInScopeLines(cx, location, {
  dispatch,
  getState,
  parser
}) {
  const source = (0, _selectors.getSourceWithContent)(getState(), location.sourceId);
  let locations = null;

  if (location.line && source && !source.isWasm) {
    locations = await parser.findOutOfScopeLocations(source.id, location);
  }

  const linesOutOfScope = getOutOfScopeLines(locations);
  const sourceNumLines = !source.content || !(0, _asyncValue.isFulfilled)(source.content) ? 0 : (0, _source.getSourceLineCount)(source.content.value);
  const sourceLines = (0, _lodash.range)(1, sourceNumLines + 1);
  return !linesOutOfScope ? sourceLines : (0, _lodash.without)(sourceLines, ...linesOutOfScope);
}

function setInScopeLines(cx) {
  return async thunkArgs => {
    const {
      getState,
      dispatch
    } = thunkArgs;
    const visibleFrame = (0, _selectors.getVisibleSelectedFrame)(getState());

    if (!visibleFrame) {
      return;
    }

    const {
      location
    } = visibleFrame;
    const {
      content
    } = (0, _selectors.getSourceWithContent)(getState(), location.sourceId);

    if ((0, _selectors.hasInScopeLines)(getState(), location) || !content) {
      return;
    }

    const lines = await getInScopeLines(cx, location, thunkArgs);
    dispatch({
      type: "IN_SCOPE_LINES",
      cx,
      location,
      lines
    });
  };
}