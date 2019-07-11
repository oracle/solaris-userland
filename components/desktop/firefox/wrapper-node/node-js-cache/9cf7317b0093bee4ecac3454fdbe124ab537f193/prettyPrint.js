"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prettyPrintSource = prettyPrintSource;
exports.createPrettySource = createPrettySource;
exports.togglePrettyPrint = togglePrettyPrint;

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

var _devtoolsSourceMap2 = _interopRequireDefault(_devtoolsSourceMap);

var _assert = require("../../utils/assert");

var _assert2 = _interopRequireDefault(_assert);

var _telemetry = require("../../utils/telemetry");

var _breakpoints = require("../breakpoints/index");

var _symbols = require("./symbols");

var _prettyPrint = require("../../workers/pretty-print/index");

var _source = require("../../utils/source");

var _loadSourceText = require("./loadSourceText");

var _pause = require("../pause/index");

var _sources = require("../sources/index");

var _selectors = require("../../selectors/index");

var _select = require("./select");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

async function prettyPrintSource(sourceMaps, generatedSource, content, actors) {
  if (!(0, _source.isJavaScript)(generatedSource, content) || content.type !== "text") {
    throw new Error("Can't prettify non-javascript files.");
  }

  const url = (0, _source.getPrettySourceURL)(generatedSource.url);
  const { code, mappings } = await (0, _prettyPrint.prettyPrint)({
    text: content.value,
    url: url
  });
  await sourceMaps.applySourceMap(generatedSource.id, url, code, mappings);

  // The source map URL service used by other devtools listens to changes to
  // sources based on their actor IDs, so apply the mapping there too.
  for (const { actor } of actors) {
    await sourceMaps.applySourceMap(actor, url, code, mappings);
  }
  return {
    text: code,
    contentType: "text/javascript"
  };
}

function createPrettySource(cx, sourceId) {
  return async ({ dispatch, getState, sourceMaps }) => {
    const source = (0, _selectors.getSourceFromId)(getState(), sourceId);
    const url = (0, _source.getPrettySourceURL)(source.url);
    const id = (0, _devtoolsSourceMap.generatedToOriginalId)(sourceId, url);

    const prettySource = {
      id,
      url,
      relativeUrl: url,
      isBlackBoxed: false,
      isPrettyPrinted: true,
      isWasm: false,
      introductionUrl: null,
      introductionType: undefined,
      isExtension: false
    };

    dispatch({ type: "ADD_SOURCE", cx, source: prettySource });
    await dispatch((0, _select.selectSource)(cx, prettySource.id));

    return prettySource;
  };
}

function selectPrettyLocation(cx, prettySource) {
  return async ({ dispatch, sourceMaps, getState }) => {
    let location = (0, _selectors.getSelectedLocation)(getState());

    if (location) {
      location = await sourceMaps.getOriginalLocation(location);
      return dispatch((0, _sources.selectSpecificLocation)(cx, { ...location, sourceId: prettySource.id }));
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
  return async ({ dispatch, getState, client, sourceMaps }) => {
    const source = (0, _selectors.getSource)(getState(), sourceId);
    if (!source) {
      return {};
    }

    if (!source.isPrettyPrinted) {
      (0, _telemetry.recordEvent)("pretty_print");
    }

    await dispatch((0, _loadSourceText.loadSourceText)({ cx, source }));

    (0, _assert2.default)((0, _source.isGenerated)(source), "Pretty-printing only allowed on generated sources");

    const url = (0, _source.getPrettySourceURL)(source.url);
    const prettySource = (0, _selectors.getSourceByURL)(getState(), url);

    if (prettySource) {
      return dispatch(selectPrettyLocation(cx, prettySource));
    }

    const newPrettySource = await dispatch(createPrettySource(cx, sourceId));
    await dispatch(selectPrettyLocation(cx, newPrettySource));

    const threadcx = (0, _selectors.getThreadContext)(getState());
    await dispatch((0, _pause.mapFrames)(threadcx));

    await dispatch((0, _symbols.setSymbols)({ cx, source: newPrettySource }));

    await dispatch((0, _breakpoints.remapBreakpoints)(cx, sourceId));

    return newPrettySource;
  };
}