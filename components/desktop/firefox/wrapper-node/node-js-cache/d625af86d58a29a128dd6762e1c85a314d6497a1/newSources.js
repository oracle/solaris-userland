"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newQueuedSources = newQueuedSources;
exports.newOriginalSource = newOriginalSource;
exports.newOriginalSources = newOriginalSources;
exports.newGeneratedSource = newGeneratedSource;
exports.newGeneratedSources = newGeneratedSources;
exports.ensureSourceActor = ensureSourceActor;

var _lodash = require("devtools/client/shared/vendor/lodash");

loader.lazyRequireGetter(this, "_sourceActors", "devtools/client/debugger/src/reducers/source-actors");
loader.lazyRequireGetter(this, "_threads", "devtools/client/debugger/src/reducers/threads");
loader.lazyRequireGetter(this, "_sourceActors2", "devtools/client/debugger/src/actions/source-actors");
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");
loader.lazyRequireGetter(this, "_blackbox", "devtools/client/debugger/src/actions/sources/blackbox");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/actions/breakpoints/index");
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_prettyPrint", "devtools/client/debugger/src/actions/sources/prettyPrint");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

var _sourceQueue = _interopRequireDefault(require("../../utils/source-queue"));

loader.lazyRequireGetter(this, "_context", "devtools/client/debugger/src/utils/context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Redux actions for the sources state
 * @module actions/sources
 */
function loadSourceMaps(cx, sources) {
  return async function ({
    dispatch,
    sourceMaps
  }) {
    try {
      const sourceList = await Promise.all(sources.map(async sourceActor => {
        const originalSources = await dispatch(loadSourceMap(cx, sourceActor));

        _sourceQueue.default.queueSources(originalSources.map(data => ({
          type: "original",
          data
        })));

        return originalSources;
      }));
      await _sourceQueue.default.flush();
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


function loadSourceMap(cx, sourceActor) {
  return async function ({
    dispatch,
    getState,
    sourceMaps
  }) {
    if (!_prefs.prefs.clientSourceMapsEnabled || !sourceActor.sourceMapURL) {
      return [];
    }

    let data = null;

    try {
      // Ignore sourceMapURL on scripts that are part of HTML files, since
      // we currently treat sourcemaps as Source-wide, not SourceActor-specific.
      const source = (0, _selectors.getSourceByActorId)(getState(), sourceActor.id);

      if (source) {
        data = await sourceMaps.getOriginalURLs({
          // Using source ID here is historical and eventually we'll want to
          // switch to all of this being per-source-actor.
          id: source.id,
          url: sourceActor.url || "",
          sourceMapBaseURL: sourceActor.sourceMapBaseURL || "",
          sourceMapURL: sourceActor.sourceMapURL || "",
          isWasm: sourceActor.introductionType === "wasm"
        });
      }
    } catch (e) {
      console.error(e);
    }

    if (!data) {
      // If this source doesn't have a sourcemap, enable it for pretty printing
      dispatch({
        type: "CLEAR_SOURCE_ACTOR_MAP_URL",
        cx,
        id: sourceActor.id
      });
      return [];
    }

    (0, _context.validateNavigateContext)(getState(), cx);
    return data;
  };
} // If a request has been made to show this source, go ahead and
// select it.


function checkSelectedSource(cx, sourceId) {
  return async ({
    dispatch,
    getState
  }) => {
    const state = getState();
    const pendingLocation = (0, _selectors.getPendingSelectedLocation)(state);

    if (!pendingLocation || !pendingLocation.url) {
      return;
    }

    const source = (0, _selectors.getSource)(state, sourceId);

    if (!source || !source.url) {
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
  return async ({
    dispatch,
    getState
  }) => {
    // source may have been modified by selectLocation
    const source = (0, _selectors.getSource)(getState(), sourceId);

    if (!source) {
      return;
    }

    const pendingBreakpoints = (0, _selectors.getPendingBreakpointsForSource)(getState(), source);

    if (pendingBreakpoints.length === 0) {
      return;
    } // load the source text if there is a pending breakpoint for it


    await dispatch((0, _loadSourceText.loadSourceText)({
      cx,
      source
    }));
    await dispatch((0, _sources.setBreakableLines)(cx, source.id));
    await Promise.all(pendingBreakpoints.map(bp => {
      return dispatch((0, _breakpoints.syncBreakpoint)(cx, sourceId, bp));
    }));
  };
}

function restoreBlackBoxedSources(cx, sources) {
  return async ({
    dispatch,
    getState
  }) => {
    const tabs = (0, _selectors.getBlackBoxList)(getState());

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
  return async ({
    dispatch
  }) => {
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
  return async ({
    dispatch
  }) => {
    const sources = await dispatch(newOriginalSources([sourceInfo]));
    return sources[0];
  };
}

function newOriginalSources(sourceInfo) {
  return async ({
    dispatch,
    getState
  }) => {
    const state = getState();
    const seen = new Set();
    const sources = [];

    for (const {
      id,
      url
    } of sourceInfo) {
      if (seen.has(id) || (0, _selectors.getSource)(state, id)) {
        continue;
      }

      seen.add(id);
      sources.push({
        id,
        url,
        relativeUrl: url,
        isPrettyPrinted: false,
        isWasm: false,
        isBlackBoxed: false,
        isExtension: false,
        extensionName: null,
        isOriginal: true
      });
    }

    const cx = (0, _selectors.getContext)(state);
    dispatch(addSources(cx, sources));
    await dispatch(checkNewSources(cx, sources));

    for (const source of sources) {
      dispatch(checkPendingBreakpoints(cx, source.id));
    }

    return sources;
  };
}

function newGeneratedSource(sourceInfo) {
  return async ({
    dispatch
  }) => {
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
    // bails early for unnecessary calls to newGeneratedSources. This simplifies the reducers which still create a new state, but don't need to.
    if (sourceInfo.length == 0) {
      return [];
    }

    const resultIds = [];
    const newSourcesObj = {};
    const newSourceActors = [];

    for (const {
      thread,
      isServiceWorker,
      source,
      id
    } of sourceInfo) {
      const newId = id || (0, _create.makeSourceId)(source, isServiceWorker);

      if (!(0, _selectors.getSource)(getState(), newId) && !newSourcesObj[newId]) {
        newSourcesObj[newId] = {
          id: newId,
          url: source.url,
          relativeUrl: source.url,
          isPrettyPrinted: false,
          extensionName: source.extensionName,
          isBlackBoxed: false,
          isWasm: !!(0, _threads.supportsWasm)(getState()) && source.introductionType === "wasm",
          isExtension: source.url && (0, _source.isUrlExtension)(source.url) || false,
          isOriginal: false
        };
      }

      const actorId = (0, _sourceActors.stringToSourceActorId)(source.actor); // We are sometimes notified about a new source multiple times if we
      // request a new source list and also get a source event from the server.

      if (!(0, _selectors.hasSourceActor)(getState(), actorId)) {
        newSourceActors.push({
          id: actorId,
          actor: source.actor,
          thread,
          source: newId,
          isBlackBoxed: source.isBlackBoxed,
          sourceMapBaseURL: source.sourceMapBaseURL,
          sourceMapURL: source.sourceMapURL,
          url: source.url,
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

    (async () => {
      await dispatch(loadSourceMaps(cx, newSourceActors)); // We would like to sync breakpoints after we are done
      // loading source maps as sometimes generated and original
      // files share the same paths.

      for (const {
        source
      } of newSourceActors) {
        dispatch(checkPendingBreakpoints(cx, source));
      }
    })();

    return resultIds.map(id => (0, _selectors.getSourceFromId)(getState(), id));
  };
}

function addSources(cx, sources) {
  return ({
    dispatch,
    getState
  }) => {
    dispatch({
      type: "ADD_SOURCES",
      cx,
      sources
    });
  };
}

function checkNewSources(cx, sources) {
  return async ({
    dispatch,
    getState
  }) => {
    for (const source of sources) {
      dispatch(checkSelectedSource(cx, source.id));
    }

    dispatch(restoreBlackBoxedSources(cx, sources));
    return sources;
  };
}

function ensureSourceActor(thread, sourceActor) {
  return async function ({
    dispatch,
    getState,
    client
  }) {
    await _sourceQueue.default.flush();

    if ((0, _selectors.hasSourceActor)(getState(), sourceActor)) {
      return Promise.resolve();
    }

    const sources = await client.fetchThreadSources(thread);
    await dispatch(newGeneratedSources(sources));
  };
}