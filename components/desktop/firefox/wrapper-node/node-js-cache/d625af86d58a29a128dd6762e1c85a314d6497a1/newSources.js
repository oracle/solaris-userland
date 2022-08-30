"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newOriginalSource = newOriginalSource;
exports.newOriginalSources = newOriginalSources;
exports.newGeneratedSource = newGeneratedSource;
exports.newGeneratedSources = newGeneratedSources;
loader.lazyRequireGetter(this, "_sourceActors", "devtools/client/debugger/src/actions/source-actors");
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
        const originalSourcesInfo = await dispatch(loadSourceMap(cx, sourceActor));
        originalSourcesInfo.forEach(sourceInfo => sourceInfo.thread = sourceActor.thread);

        _sourceQueue.default.queueOriginalSources(originalSourcesInfo);

        return originalSourcesInfo;
      }));
      await _sourceQueue.default.flush();
      return sourceList.flat();
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
    const currentRanges = (0, _selectors.getBlackBoxRanges)(getState());

    if (Object.keys(currentRanges).length == 0) {
      return;
    }

    for (const source of sources) {
      const ranges = currentRanges[source.url];

      if (ranges) {
        // If the ranges is an empty then the whole source was blackboxed.
        await dispatch((0, _blackbox.toggleBlackBox)(cx, source, true, ranges));
      }
    }
  };
} // Wrapper around newOriginalSources, only used by tests


function newOriginalSource(sourceInfo) {
  return async ({
    dispatch
  }) => {
    const sources = await dispatch(newOriginalSources([sourceInfo]));
    return sources[0];
  };
}

function newOriginalSources(originalSourcesInfo) {
  return async ({
    dispatch,
    getState
  }) => {
    const state = getState();
    const seen = new Set();
    const sources = [];

    for (const {
      id,
      url,
      thread
    } of originalSourcesInfo) {
      if (seen.has(id) || (0, _selectors.getSource)(state, id)) {
        continue;
      }

      seen.add(id);
      sources.push((0, _create.createSourceMapOriginalSource)(id, url, thread));
    }

    const cx = (0, _selectors.getContext)(state);
    dispatch(addSources(cx, sources));
    await dispatch(checkNewSources(cx, sources));

    for (const source of sources) {
      dispatch(checkPendingBreakpoints(cx, source.id));
    }

    return sources;
  };
} // Wrapper around newGeneratedSources, only used by tests


function newGeneratedSource(sourceInfo) {
  return async ({
    dispatch
  }) => {
    const sources = await dispatch(newGeneratedSources([sourceInfo]));
    return sources[0];
  };
}

function newGeneratedSources(sourceResources) {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    if (sourceResources.length == 0) {
      return [];
    }

    const resultIds = [];
    const newSourcesObj = {};
    const newSourceActors = [];

    for (const sourceResource of sourceResources) {
      // By the time we process the sources, the related target
      // might already have been destroyed. It means that the sources
      // are also about to be destroyed, so ignore them.
      // (This is covered by browser_toolbox_backward_forward_navigation.js)
      if (sourceResource.targetFront.isDestroyed()) {
        continue;
      }

      const id = (0, _create.makeSourceId)(sourceResource);

      if (!(0, _selectors.getSource)(getState(), id) && !newSourcesObj[id]) {
        newSourcesObj[id] = (0, _create.createGeneratedSource)(sourceResource);
      }

      const actorId = sourceResource.actor; // We are sometimes notified about a new source multiple times if we
      // request a new source list and also get a source event from the server.

      if (!(0, _selectors.hasSourceActor)(getState(), actorId)) {
        newSourceActors.push((0, _create.createSourceActor)(sourceResource));
      }

      resultIds.push(id);
    }

    const newSources = Object.values(newSourcesObj);
    const cx = (0, _selectors.getContext)(getState());
    dispatch(addSources(cx, newSources));
    dispatch((0, _sourceActors.insertSourceActors)(newSourceActors));

    for (const newSourceActor of newSourceActors) {
      // Fetch breakable lines for new HTML scripts
      // when the HTML file has started loading
      if ((0, _source.isInlineScript)(newSourceActor) && (0, _selectors.getSourceTextContent)(getState(), newSourceActor.source) != null) {
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

    await dispatch(restoreBlackBoxedSources(cx, sources));
    return sources;
  };
}