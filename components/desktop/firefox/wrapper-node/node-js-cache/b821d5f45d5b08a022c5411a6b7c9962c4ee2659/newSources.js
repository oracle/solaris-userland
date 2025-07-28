"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newOriginalSources = newOriginalSources;
exports.newGeneratedSource = newGeneratedSource;
exports.newGeneratedSources = newGeneratedSources;
loader.lazyRequireGetter(this, "_sourceActors", "devtools/client/debugger/src/actions/source-actors");
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");
loader.lazyRequireGetter(this, "_blackbox", "devtools/client/debugger/src/actions/sources/blackbox");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/actions/breakpoints/index");
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_prettyPrint", "devtools/client/debugger/src/actions/sources/prettyPrint");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/actions/ui");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");
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
function loadSourceMapsForSourceActors(sourceActors) {
  return async function ({
    dispatch
  }) {
    try {
      await Promise.all(sourceActors.map(sourceActor => dispatch(loadSourceMap(sourceActor))));
    } catch (error) {
      // This may throw a context error if we navigated while processing the source maps
      if (!(error instanceof _context.ContextError)) {
        throw error;
      }
    } // Once all the source maps, of all the bulk of new source actors are processed,
    // flush the SourceQueue. This help aggregate all the original sources in one action.


    await _sourceQueue.default.flush();
  };
}
/**
 * @memberof actions/sources
 * @static
 */


function loadSourceMap(sourceActor) {
  return async function ({
    dispatch,
    getState,
    sourceMapLoader,
    panel
  }) {
    if (!_prefs.prefs.clientSourceMapsEnabled || !sourceActor.sourceMapURL) {
      return;
    }

    let sources, ignoreListUrls, resolvedSourceMapURL, exception;

    try {
      // Ignore sourceMapURL on scripts that are part of HTML files, since
      // we currently treat sourcemaps as Source-wide, not SourceActor-specific.
      const source = (0, _index3.getSourceByActorId)(getState(), sourceActor.id);

      if (source) {
        ({
          sources,
          ignoreListUrls,
          resolvedSourceMapURL,
          exception
        } = await sourceMapLoader.loadSourceMap({
          // Using source ID here is historical and eventually we'll want to
          // switch to all of this being per-source-actor.
          id: source.id,
          url: sourceActor.url || "",
          sourceMapBaseURL: sourceActor.sourceMapBaseURL || "",
          sourceMapURL: sourceActor.sourceMapURL || "",
          isWasm: sourceActor.introductionType === "wasm"
        }));
      }
    } catch (e) {
      exception = `Internal error: ${e.message}`;
    }

    if (resolvedSourceMapURL) {
      dispatch({
        type: "RESOLVED_SOURCEMAP_URL",
        sourceActor,
        resolvedSourceMapURL
      });
    }

    if (ignoreListUrls?.length) {
      dispatch({
        type: "ADD_SOURCEMAP_IGNORE_LIST_SOURCES",
        ignoreListUrls
      });
    }

    if (exception) {
      // Catch all errors and log them to the Web Console for users to see.
      const message = L10N.getFormatStr("toolbox.sourceMapFailure", exception, sourceActor.url, sourceActor.sourceMapURL);
      panel.toolbox.commands.targetCommand.targetFront.logWarningInPage(message, "source map", resolvedSourceMapURL);
      dispatch({
        type: "SOURCE_MAP_ERROR",
        sourceActor,
        errorMessage: exception
      }); // If this source doesn't have a sourcemap or there are no original files
      // existing, enable it for pretty printing

      dispatch({
        type: "CLEAR_SOURCE_ACTOR_MAP_URL",
        sourceActor
      });
      return;
    } // Before dispatching this action, ensure that the related sourceActor is still registered


    (0, _context.validateSourceActor)(getState(), sourceActor);

    for (const originalSource of sources) {
      // The Source Map worker doesn't set the `sourceActor` attribute,
      // which is handy to know what is the related bundle.
      originalSource.sourceActor = sourceActor;
    } // Register all the new reported original sources in the queue to be flushed once all new bundles are processed.


    _sourceQueue.default.queueOriginalSources(sources);
  };
} // If a request has been made to show this source, go ahead and
// select it.


function checkSelectedSource(sourceId) {
  return async ({
    dispatch,
    getState
  }) => {
    const state = getState();
    const pendingLocation = (0, _index3.getPendingSelectedLocation)(state);

    if (!pendingLocation || !pendingLocation.url) {
      return;
    }

    const source = (0, _index3.getSource)(state, sourceId);

    if (!source || !source.url) {
      return;
    }

    const pendingUrl = pendingLocation.url;
    const rawPendingUrl = (0, _source.getRawSourceURL)(pendingUrl);

    if (rawPendingUrl === source.url) {
      if ((0, _source.isPrettyURL)(pendingUrl)) {
        const prettySource = await dispatch((0, _prettyPrint.prettyPrintAndSelectSource)(source));
        dispatch(checkPendingBreakpoints(prettySource, null));
        return;
      }

      await dispatch((0, _index2.selectLocation)((0, _location.createLocation)({
        source,
        line: typeof pendingLocation.line === "number" ? pendingLocation.line : 0,
        column: pendingLocation.column
      })));
    }
  };
}

function checkPendingBreakpoints(source, sourceActor) {
  return async ({
    dispatch,
    getState
  }) => {
    const pendingBreakpoints = (0, _index3.getPendingBreakpointsForSource)(getState(), source);

    if (pendingBreakpoints.length === 0) {
      return;
    } // load the source text if there is a pending breakpoint for it


    await dispatch((0, _loadSourceText.loadSourceText)(source, sourceActor));
    await dispatch((0, _index2.setBreakableLines)((0, _location.createLocation)({
      source,
      sourceActor
    })));
    await Promise.all(pendingBreakpoints.map(pendingBp => {
      return dispatch((0, _index.syncPendingBreakpoint)(source, pendingBp));
    }));
  };
}

function restoreBlackBoxedSources(sources) {
  return async ({
    dispatch,
    getState
  }) => {
    const currentRanges = (0, _index3.getBlackBoxRanges)(getState());

    if (!Object.keys(currentRanges).length) {
      return;
    }

    for (const source of sources) {
      const ranges = currentRanges[source.url];

      if (ranges) {
        // If the ranges is an empty then the whole source was blackboxed.
        await dispatch((0, _blackbox.toggleBlackBox)(source, true, ranges));
      }
    }

    if (_prefs.prefs.sourceMapIgnoreListEnabled) {
      await dispatch((0, _ui.toggleSourceMapIgnoreList)(true));
    }
  };
}

function newOriginalSources(originalSourcesInfo) {
  return async ({
    dispatch,
    getState
  }) => {
    const state = getState();
    const seen = new Set();
    const actors = [];
    const actorsSources = {};

    for (const {
      id,
      url,
      sourceActor
    } of originalSourcesInfo) {
      if (seen.has(id) || (0, _index3.getSource)(state, id)) {
        continue;
      }

      seen.add(id);

      if (!actorsSources[sourceActor.actor]) {
        actors.push(sourceActor);
        actorsSources[sourceActor.actor] = [];
      }

      actorsSources[sourceActor.actor].push((0, _create.createSourceMapOriginalSource)(id, url));
    } // Add the original sources per the generated source actors that
    // they are primarily from.


    actors.forEach(sourceActor => {
      dispatch({
        type: "ADD_ORIGINAL_SOURCES",
        originalSources: actorsSources[sourceActor.actor],
        generatedSourceActor: sourceActor
      });
    }); // Accumulate the sources back into one list

    const actorsSourcesValues = Object.values(actorsSources);
    let sources = [];

    if (actorsSourcesValues.length) {
      sources = actorsSourcesValues.reduce((acc, sourceList) => acc.concat(sourceList));
    }

    await dispatch(checkNewSources(sources));

    for (const source of sources) {
      dispatch(checkPendingBreakpoints(source, null));
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
    getState
  }) => {
    if (!sourceResources.length) {
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

      if (!(0, _index3.getSource)(getState(), id) && !newSourcesObj[id]) {
        newSourcesObj[id] = (0, _create.createGeneratedSource)(sourceResource);
      }

      const actorId = sourceResource.actor; // We are sometimes notified about a new source multiple times if we
      // request a new source list and also get a source event from the server.

      if (!(0, _index3.hasSourceActor)(getState(), actorId)) {
        newSourceActors.push((0, _create.createSourceActor)(sourceResource, (0, _index3.getSource)(getState(), id) || newSourcesObj[id]));
      }

      resultIds.push(id);
    }

    const newSources = Object.values(newSourcesObj);
    dispatch({
      type: "ADD_SOURCES",
      sources: newSources
    });
    dispatch((0, _sourceActors.insertSourceActors)(newSourceActors));
    await dispatch(checkNewSources(newSources));

    (async () => {
      await dispatch(loadSourceMapsForSourceActors(newSourceActors)); // We have to force fetching the breakable lines for any incoming source actor
      // related to HTML page as we may have the HTML page selected,
      // and already fetched its breakable lines and won't try to update
      // the breakable lines for any late coming inline <script> tag.

      const selectedLocation = (0, _index3.getSelectedLocation)(getState());

      for (const sourceActor of newSourceActors) {
        if (selectedLocation?.source == sourceActor.sourceObject && sourceActor.sourceObject.isHTML) {
          await dispatch((0, _index2.setBreakableLines)((0, _location.createLocation)({
            source: sourceActor.sourceObject,
            sourceActor
          })));
        }
      } // We would like to sync breakpoints after we are done
      // loading source maps as sometimes generated and original
      // files share the same paths.


      for (const sourceActor of newSourceActors) {
        dispatch(checkPendingBreakpoints(sourceActor.sourceObject, sourceActor));
      }
    })();

    return resultIds.map(id => (0, _index3.getSourceFromId)(getState(), id));
  };
}
/**
 * Common operations done against generated and original sources,
 * just after having registered them in the reducers:
 *  - automatically selecting the source if it matches the last known selected source
 *    (i.e. the pending selected location).
 *  - automatically notify the server about new sources that used to be blackboxed.
 *    The blackboxing is per Source Actor and so we need to notify them individually
 *    if the source used to be ignored.
 */


function checkNewSources(sources) {
  return async ({
    dispatch
  }) => {
    // Waiting for `checkSelectedSource` completion is important for pretty printed sources.
    // `checkPendingBreakpoints`, which is called after this method, is expected to be called
    // only after the source is mapped and breakpoints positions are updated with the mapped locations.
    // For source mapped sources, `loadSourceMapsForSourceActors` is called before calling
    // `checkPendingBreakpoints` and will do all that. For pretty printed source, we rely on
    // `checkSelectedSource` to do that. Selecting a minimized source which used to be pretty printed
    // will automatically force pretty printing it and computing the mapped breakpoint positions.
    await Promise.all(sources.map(async source => await dispatch(checkSelectedSource(source.id))));
    await dispatch(restoreBlackBoxedSources(sources));
    return sources;
  };
}