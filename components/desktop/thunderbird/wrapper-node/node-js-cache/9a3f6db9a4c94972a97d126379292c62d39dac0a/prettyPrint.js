"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prettyPrintSource = prettyPrintSource;
exports.createPrettySource = createPrettySource;
exports.togglePrettyPrint = togglePrettyPrint;

var _devtoolsSourceMap = _interopRequireWildcard(require("devtools/client/shared/source-map/index.js"));

var _assert = _interopRequireDefault(require("../../utils/assert"));

loader.lazyRequireGetter(this, "_telemetry", "devtools/client/debugger/src/utils/telemetry");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/actions/breakpoints/index");
loader.lazyRequireGetter(this, "_symbols", "devtools/client/debugger/src/actions/sources/symbols");
loader.lazyRequireGetter(this, "_prettyPrint", "devtools/client/debugger/src/workers/pretty-print/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/actions/pause/index");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_select", "devtools/client/debugger/src/actions/sources/select");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
async function prettyPrintSource(sourceMaps, generatedSource, content, actors) {
  if (!(0, _source.isJavaScript)(generatedSource, content) || content.type !== "text") {
    throw new Error("Can't prettify non-javascript files.");
  }

  const url = (0, _source.getPrettySourceURL)(generatedSource.url);
  const {
    code,
    mappings
  } = await (0, _prettyPrint.prettyPrint)({
    text: content.value,
    url
  });
  await sourceMaps.applySourceMap(generatedSource.id, url, code, mappings); // The source map URL service used by other devtools listens to changes to
  // sources based on their actor IDs, so apply the mapping there too.

  for (const {
    actor
  } of actors) {
    await sourceMaps.applySourceMap(actor, url, code, mappings);
  }

  return {
    text: code,
    contentType: "text/javascript"
  };
}

function createPrettySource(cx, sourceId) {
  return async ({
    dispatch,
    getState,
    sourceMaps
  }) => {
    const source = (0, _selectors.getSourceFromId)(getState(), sourceId);
    const url = (0, _source.getPrettySourceURL)(source.url || source.id);
    const id = (0, _devtoolsSourceMap.generatedToOriginalId)(sourceId, url);
    const prettySource = {
      id,
      url,
      relativeUrl: url,
      isBlackBoxed: false,
      isPrettyPrinted: true,
      isWasm: false,
      isExtension: false,
      extensionName: null,
      isOriginal: true
    };
    dispatch({
      type: "ADD_SOURCE",
      cx,
      source: prettySource
    });
    await dispatch((0, _select.selectSource)(cx, id));
    return prettySource;
  };
}

function selectPrettyLocation(cx, prettySource, generatedLocation) {
  return async ({
    dispatch,
    sourceMaps,
    getState
  }) => {
    let location = generatedLocation ? generatedLocation : (0, _selectors.getSelectedLocation)(getState());

    if (location && location.line >= 1) {
      location = await sourceMaps.getOriginalLocation(location);
      return dispatch((0, _sources.selectSpecificLocation)(cx, { ...location,
        sourceId: prettySource.id
      }));
    }

    return dispatch((0, _select.selectSource)(cx, prettySource.id));
  };
}
/**
 * Toggle the pretty printing of a source's text. All subsequent calls to
 * |getText| will return the pretty-toggled text. Nothing will happen for
 * non-javascript files.
 *
 * @memberof actions/sources
 * @static
 * @param string id The source form from the RDP.
 * @returns Promise
 *          A promise that resolves to [aSource, prettyText] or rejects to
 *          [aSource, error].
 */


function togglePrettyPrint(cx, sourceId) {
  return async ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) => {
    const source = (0, _selectors.getSource)(getState(), sourceId);

    if (!source) {
      return {};
    }

    if (!source.isPrettyPrinted) {
      (0, _telemetry.recordEvent)("pretty_print");
    }

    await dispatch((0, _loadSourceText.loadSourceText)({
      cx,
      source
    }));
    (0, _assert.default)((0, _source.isGenerated)(source), "Pretty-printing only allowed on generated sources");
    const url = (0, _source.getPrettySourceURL)(source.url);
    const prettySource = (0, _selectors.getSourceByURL)(getState(), url);

    if (prettySource) {
      return dispatch(selectPrettyLocation(cx, prettySource));
    }

    const selectedLocation = (0, _selectors.getSelectedLocation)(getState());
    const newPrettySource = await dispatch(createPrettySource(cx, sourceId));
    dispatch(selectPrettyLocation(cx, newPrettySource, selectedLocation));
    const threadcx = (0, _selectors.getThreadContext)(getState());
    await dispatch((0, _pause.mapFrames)(threadcx));
    await dispatch((0, _symbols.setSymbols)({
      cx,
      source: newPrettySource
    }));
    await dispatch((0, _breakpoints.remapBreakpoints)(cx, sourceId));
    return newPrettySource;
  };
}