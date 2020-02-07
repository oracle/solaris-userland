"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newQueuedSources = newQueuedSources;
exports.newOriginalSource = newOriginalSource;
exports.newOriginalSources = newOriginalSources;
exports.newGeneratedSource = newGeneratedSource;
exports.newGeneratedSources = newGeneratedSources;

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

var _lodash = require("devtools/client/shared/vendor/lodash");

var _sourceActors = require("../../reducers/source-actors");

var _sourceActors2 = require("../../actions/source-actors");

var _create = require("../../client/firefox/create");

var _blackbox = require("./blackbox");

var _breakpoints = require("../breakpoints/index");

var _loadSourceText = require("./loadSourceText");

var _prettyPrint = require("./prettyPrint");

var _sources = require("../sources/index");

var _source = require("../../utils/source");

var _selectors = require("../../selectors/index");

var _prefs = require("../../utils/prefs");

var _sourceQueue = require("../../utils/source-queue");

var _sourceQueue2 = _interopRequireDefault(_sourceQueue);

var _context = require("../../utils/context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadSourceMaps(cx, sources) {
  return async function ({
    dispatch,
    sourceMaps
  }) {
    try {
      const sourceList = await Promise.all(sources.map(async ({ id }) => {
        const originalSources = await dispatch(loadSourceMap(cx, id));
        _sourceQueue2.default.queueSources(originalSources.map(data => ({
          type: "original",
          data
        })));
        return originalSources;
      }));

      await _sourceQueue2.default.flush();

      // We would like to sync breakpoints after we are done
      // loading source maps as sometimes generated and original
      // files share the same paths.
      for (const source of sources) {
        dispatch(checkPendingBreakpoints(cx, source.id));
      }

      return (0, _lodash.flatten)(sourceList);
    } catch (error) {
      if (!(error instanceof _context.ContextError)) {
        throw error;
      }
    }
  };
}

/**
 * @memberof actions/sources
 * @static
 */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Redux actions for the sources state
 * @module actions/sources
 */

function loadSourceMap(cx, sourceId) {
  return async function ({
    dispatch,
    getState,
    sourceMaps
  }) {
    const source = (0, _selectors.getSource)(getState(), sourceId);

    if (!_prefs.prefs.clientSourceMapsEnabled || !source || (0, _source.isOriginal)(source) || !source.sourceMapURL) {
      return [];
    }

    let urls = null;
    try {
      // Unable to correctly type the result of a spread on a union type.
      const urlInfo = { ...source };
      if (!urlInfo.url && typeof urlInfo.introductionUrl === "string") {
        // If the source was dynamically generated (via eval, dynamically
        // created script elements, and so forth), it won't have a URL, so that
        // it is not collapsed into other sources from the same place. The
        // introduction URL will include the point it was constructed at,
        // however, so use that for resolving any source maps in the source.
        urlInfo.url = urlInfo.introductionUrl;
      }
      urls = await sourceMaps.getOriginalURLs(urlInfo);
    } catch (e) {
      console.error(e);
    }

    if (!urls) {
      // If this source doesn't have a sourcemap, enable it for pretty printing
      dispatch({
        type: "CLEAR_SOURCE_MAP_URL",
        cx,
        sourceId
      });
      return [];
    }

    (0, _context.validateNavigateContext)(getState(), cx);
    return urls.map(url => ({
      id: (0, _devtoolsSourceMap.generatedToOriginalId)(source.id, url),
      url
    }));
  };
}

// If a request has been made to show this source, go ahead and
// select it.
function checkSelectedSource(cx, sourceId) {
  return async ({ dispatch, getState }) => {
    const source = (0, _selectors.getSource)(getState(), sourceId);
    const pendingLocation = (0, _selectors.getPendingSelectedLocation)(getState());

    if (!pendingLocation || !pendingLocation.url || !source || !source.url) {
      return;
    }

    const pendingUrl = pendingLocation.url;
    const rawPendingUrl = (0, _source.getRawSourceURL)(pendingUrl);

    if (rawPendingUrl === source.url) {
      if ((0, _source.isPrettyURL)(pendingUrl)) {
        const prettySource = await dispatch((0, _prettyPrint.togglePrettyPrint)(cx, source.id));
        return dispatch(checkPendingBreakpoints(cx, prettySource.id));
      }

      await dispatch((0, _sources.selectLocation)(cx, {
        sourceId: source.id,
        line: typeof pendingLocation.line === "number" ? pendingLocation.line : 0,
        column: pendingLocation.column
      }));
    }
  };
}

function checkPendingBreakpoints(cx, sourceId) {
  return async ({ dispatch, getState }) => {
    // source may have been modified by selectLocation
    const source = (0, _selectors.getSource)(getState(), sourceId);
    if (!source) {
      return;
    }

    const pendingBreakpoints = (0, _selectors.getPendingBreakpointsForSource)(getState(), source);

    if (pendingBreakpoints.length === 0) {
      return;
    }

    // load the source text if there is a pending breakpoint for it
    await dispatch((0, _loadSourceText.loadSourceText)({ cx, source }));

    await Promise.all(pendingBreakpoints.map(bp => {
      return dispatch((0, _breakpoints.syncBreakpoint)(cx, sourceId, bp));
    }));
  };
}

function restoreBlackBoxedSources(cx, sources) {
  return async ({ dispatch }) => {
    const tabs = (0, _selectors.getBlackBoxList)();
    if (tabs.length == 0) {
      return;
    }
    for (const source of sources) {
      if (tabs.includes(source.url) && !source.isBlackBoxed) {
        dispatch((0, _blackbox.toggleBlackBox)(cx, source));
      }
    }
  };
}

function newQueuedSources(sourceInfo) {
  return async ({ dispatch }) => {
    const generated = [];
    const original = [];
    for (const source of sourceInfo) {
      if (source.type === "generated") {
        generated.push(source.data);
      } else {
        original.push(source.data);
      }
    }

    if (generated.length > 0) {
      await dispatch(newGeneratedSources(generated));
    }
    if (original.length > 0) {
      await dispatch(newOriginalSources(original));
    }
  };
}

function newOriginalSource(sourceInfo) {
  return async ({ dispatch }) => {
    const sources = await dispatch(newOriginalSources([sourceInfo]));
    return sources[0];
  };
}
function newOriginalSources(sourceInfo) {
  return async ({ dispatch, getState }) => {
    const sources = sourceInfo.map(({ id, url }) => ({
      id,
      url,
      relativeUrl: url,
      isPrettyPrinted: false,
      isWasm: false,
      isBlackBoxed: false,
      introductionUrl: null,
      introductionType: undefined,
      isExtension: false
    }));

    const cx = (0, _selectors.getContext)(getState());
    dispatch(addSources(cx, sources));

    await dispatch(checkNewSources(cx, sources));

    return sources;
  };
}

function newGeneratedSource(sourceInfo) {
  return async ({ dispatch }) => {
    const sources = await dispatch(newGeneratedSources([sourceInfo]));
    return sources[0];
  };
}
function newGeneratedSources(sourceInfo) {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    const supportsWasm = client.hasWasmSupport();

    const resultIds = [];
    const newSourcesObj = {};
    const newSourceActors = [];

    for (const { thread, source, id } of sourceInfo) {
      const newId = id || (0, _create.makeSourceId)(source);

      if (!(0, _selectors.getSource)(getState(), newId) && !newSourcesObj[newId]) {
        newSourcesObj[newId] = {
          id: newId,
          url: source.url,
          relativeUrl: source.url,
          isPrettyPrinted: false,
          sourceMapURL: source.sourceMapURL,
          introductionUrl: source.introductionUrl,
          introductionType: source.introductionType,
          isBlackBoxed: false,
          isWasm: !!supportsWasm && source.introductionType === "wasm",
          isExtension: source.url && (0, _source.isUrlExtension)(source.url) || false
        };
      }

      const actorId = (0, _sourceActors.stringToSourceActorId)(source.actor);

      // We are sometimes notified about a new source multiple times if we
      // request a new source list and also get a source event from the server.
      if (!(0, _selectors.hasSourceActor)(getState(), actorId)) {
        newSourceActors.push({
          id: actorId,
          actor: source.actor,
          thread,
          source: newId,
          isBlackBoxed: source.isBlackBoxed,
          sourceMapURL: source.sourceMapURL,
          url: source.url,
          introductionUrl: source.introductionUrl,
          introductionType: source.introductionType
        });
      }

      resultIds.push(newId);
    }

    const newSources = Object.values(newSourcesObj);

    const cx = (0, _selectors.getContext)(getState());
    dispatch(addSources(cx, newSources));
    dispatch((0, _sourceActors2.insertSourceActors)(newSourceActors));

    for (const newSourceActor of newSourceActors) {
      // Fetch breakable lines for new HTML scripts
      // when the HTML file has started loading
      if ((0, _source.isInlineScript)(newSourceActor) && (0, _selectors.isSourceLoadingOrLoaded)(getState(), newSourceActor.source)) {
        dispatch((0, _sources.setBreakableLines)(cx, newSourceActor.source)).catch(error => {
          if (!(error instanceof _context.ContextError)) {
            throw error;
          }
        });
      }
    }
    await dispatch(checkNewSources(cx, newSources));

    return resultIds.map(id => (0, _selectors.getSourceFromId)(getState(), id));
  };
}

function addSources(cx, sources) {
  return ({ dispatch, getState }) => {
    dispatch({ type: "ADD_SOURCES", cx, sources });
  };
}

function checkNewSources(cx, sources) {
  return async ({ dispatch, getState }) => {
    for (const source of sources) {
      dispatch(checkSelectedSource(cx, source.id));
    }

    dispatch(restoreBlackBoxedSources(cx, sources));
    dispatch(loadSourceMaps(cx, sources));

    return sources;
  };
}