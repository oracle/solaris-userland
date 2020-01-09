"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadSourceText = undefined;
exports.loadSourceById = loadSourceById;

var _promise = require("../utils/middleware/promise");

var _selectors = require("../../selectors/index");

var _breakpoints = require("../breakpoints/index");

var _prettyPrint = require("./prettyPrint");

var _breakableLines = require("./breakableLines");

var _asyncValue = require("../../utils/async-value");

var _source = require("../../utils/source");

var _memoizableAction = require("../../utils/memoizableAction");

var _telemetry = require("devtools/client/shared/telemetry");

var _telemetry2 = _interopRequireDefault(_telemetry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Measures the time it takes for a source to load
const loadSourceHistogram = "DEVTOOLS_DEBUGGER_LOAD_SOURCE_MS"; /* This Source Code Form is subject to the terms of the Mozilla Public
                                                                 * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                                 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const telemetry = new _telemetry2.default();

async function loadSource(state, source, { sourceMaps, client, getState }) {
  if ((0, _source.isPretty)(source) && (0, _source.isOriginal)(source)) {
    const generatedSource = (0, _selectors.getGeneratedSource)(state, source);
    if (!generatedSource) {
      throw new Error("Unable to find minified original.");
    }
    const content = (0, _selectors.getSourceContent)(state, generatedSource.id);
    if (!content || !(0, _asyncValue.isFulfilled)(content)) {
      throw new Error("Cannot pretty-print a file that has not loaded");
    }

    return (0, _prettyPrint.prettyPrintSource)(sourceMaps, generatedSource, content.value, (0, _selectors.getSourceActorsForSource)(state, generatedSource.id));
  }

  if ((0, _source.isOriginal)(source)) {
    const result = await sourceMaps.getOriginalSourceText(source);
    if (!result) {
      // The way we currently try to load and select a pending
      // selected location, it is possible that we will try to fetch the
      // original source text right after the source map has been cleared
      // after a navigation event.
      throw new Error("Original source text unavailable");
    }
    return result;
  }

  const actors = (0, _selectors.getSourceActorsForSource)(state, source.id);
  if (!actors.length) {
    throw new Error("No source actor for loadSource");
  }

  telemetry.start(loadSourceHistogram, source);
  const response = await client.sourceContents(actors[0]);
  telemetry.finish(loadSourceHistogram, source);

  return {
    text: response.source,
    contentType: response.contentType || "text/javascript"
  };
}

async function loadSourceTextPromise(cx, source, { dispatch, getState, client, sourceMaps, parser }) {
  const epoch = (0, _selectors.getSourcesEpoch)(getState());
  await dispatch({
    type: "LOAD_SOURCE_TEXT",
    sourceId: source.id,
    epoch,
    [_promise.PROMISE]: loadSource(getState(), source, { sourceMaps, client, getState })
  });

  const newSource = (0, _selectors.getSource)(getState(), source.id);

  if (!newSource) {
    return;
  }
  const content = (0, _selectors.getSourceContent)(getState(), newSource.id);

  if (!newSource.isWasm && content) {
    parser.setSource(newSource.id, (0, _asyncValue.isFulfilled)(content) ? content.value : { type: "text", value: "", contentType: undefined });

    await dispatch((0, _breakableLines.setBreakableLines)(cx, source.id));
    // Update the text in any breakpoints for this source by re-adding them.
    const breakpoints = (0, _selectors.getBreakpointsForSource)(getState(), source.id);
    for (const { location, options, disabled } of breakpoints) {
      await dispatch((0, _breakpoints.addBreakpoint)(cx, location, options, disabled));
    }
  }

  return newSource;
}

function loadSourceById(cx, sourceId) {
  return ({ getState, dispatch }) => {
    const source = (0, _selectors.getSourceFromId)(getState(), sourceId);
    return dispatch(loadSourceText({ cx, source }));
  };
}

const loadSourceText = exports.loadSourceText = (0, _memoizableAction.memoizeableAction)("loadSourceText", {
  exitEarly: ({ source }) => !source,
  hasValue: ({ source }, { getState }) => {
    return !!((0, _selectors.getSource)(getState(), source.id) && (0, _selectors.getSourceWithContent)(getState(), source.id).content);
  },
  getValue: ({ source }, { getState }) => (0, _selectors.getSource)(getState(), source.id),
  createKey: ({ source }, { getState }) => {
    const epoch = (0, _selectors.getSourcesEpoch)(getState());
    return `${epoch}:${source.id}`;
  },
  action: ({ cx, source }, thunkArgs) => loadSourceTextPromise(cx, source, thunkArgs)
});