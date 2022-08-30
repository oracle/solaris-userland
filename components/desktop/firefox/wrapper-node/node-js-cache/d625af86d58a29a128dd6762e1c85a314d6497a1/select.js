"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectSourceURL = selectSourceURL;
exports.selectSource = selectSource;
exports.selectLocation = selectLocation;
exports.selectSpecificLocation = selectSpecificLocation;
exports.jumpToMappedLocation = jumpToMappedLocation;
exports.jumpToMappedSelectedLocation = jumpToMappedSelectedLocation;
exports.clearSelectedLocation = exports.setPendingSelectedLocation = exports.setSelectedLocation = void 0;

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

loader.lazyRequireGetter(this, "_symbols", "devtools/client/debugger/src/actions/sources/symbols");
loader.lazyRequireGetter(this, "_ast", "devtools/client/debugger/src/actions/ast/index");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/actions/ui");
loader.lazyRequireGetter(this, "_prettyPrint", "devtools/client/debugger/src/actions/sources/prettyPrint");
loader.lazyRequireGetter(this, "_tabs", "devtools/client/debugger/src/actions/tabs");
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_pause", "devtools/client/debugger/src/actions/pause/index");
loader.lazyRequireGetter(this, "_", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_sourceMaps", "devtools/client/debugger/src/utils/source-maps");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Redux actions for the sources state
 * @module actions/sources
 */
// This is only used by jest tests (and within this module)
const setSelectedLocation = (cx, source, location) => ({
  type: "SET_SELECTED_LOCATION",
  cx,
  source,
  location
}); // This is only used by jest tests (and within this module)


exports.setSelectedLocation = setSelectedLocation;

const setPendingSelectedLocation = (cx, url, options) => ({
  type: "SET_PENDING_SELECTED_LOCATION",
  cx,
  url,
  line: options === null || options === void 0 ? void 0 : options.line,
  column: options === null || options === void 0 ? void 0 : options.column
}); // This is only used by jest tests (and within this module)


exports.setPendingSelectedLocation = setPendingSelectedLocation;

const clearSelectedLocation = cx => ({
  type: "CLEAR_SELECTED_LOCATION",
  cx
});
/**
 * Deterministically select a source that has a given URL. This will
 * work regardless of the connection status or if the source exists
 * yet.
 *
 * This exists mostly for external things to interact with the
 * debugger.
 */


exports.clearSelectedLocation = clearSelectedLocation;

function selectSourceURL(cx, url, options) {
  return async ({
    dispatch,
    getState,
    sourceMaps
  }) => {
    const source = (0, _selectors.getSourceByURL)(getState(), url);

    if (!source) {
      return dispatch(setPendingSelectedLocation(cx, url, options));
    }

    const sourceId = source.id;
    const location = (0, _location.createLocation)({ ...options,
      sourceId
    });
    return dispatch(selectLocation(cx, location));
  };
}
/**
 * Wrapper around selectLocation, which creates the location object for us.
 * Note that it ignores the currently selected source and will select
 * the precise generated/original source passed as argument.
 *
 * @param {Object} cx
 * @param {String} sourceId
 *        The precise source to select.
 * @param {Object} location
 *        Optional precise location to select, if we need to select
 *        a precise line/column.
 */


function selectSource(cx, sourceId, location = {}) {
  return async ({
    dispatch
  }) => {
    location = (0, _location.createLocation)({ ...location,
      sourceId
    });
    return dispatch(selectSpecificLocation(cx, location));
  };
}
/**
 * Select a new location.
 * This will automatically select the source in the source tree (if visible)
 * and open the source (a new tab and the source editor)
 * as well as highlight a precise line in the editor.
 *
 * Note that by default, this may map your passed location to the original
 * or generated location based on the selected source state. (see keepContext)
 *
 * @param {Object} cx
 * @param {Object} location
 * @param {Object} options
 * @param {boolean} options.keepContext
 *        If false, this will ignore the currently selected source
 *        and select the generated or original location, even if we
 *        were currently selecting the other source type.
 */


function selectLocation(cx, location, {
  keepContext = true
} = {}) {
  return async ({
    dispatch,
    getState,
    sourceMaps,
    client
  }) => {
    const currentSource = (0, _selectors.getSelectedSource)(getState());

    if (!client) {
      // No connection, do nothing. This happens when the debugger is
      // shut down too fast and it tries to display a default source.
      return;
    }

    let source = (0, _selectors.getLocationSource)(getState(), location);

    if (!source) {
      // If there is no source we deselect the current selected source
      return dispatch(clearSelectedLocation(cx));
    }

    const activeSearch = (0, _selectors.getActiveSearch)(getState());

    if (activeSearch && activeSearch !== "file") {
      dispatch((0, _ui.closeActiveSearch)());
    } // Preserve the current source map context (original / generated)
    // when navigating to a new location.
    // i.e. if keepContext isn't manually overriden to false,
    // we will convert the source we want to select to either
    // original/generated in order to match the currently selected one.
    // If the currently selected source is original, we will
    // automatically map `location` to refer to the original source,
    // even if that used to refer only to the generated source.


    const selectedSource = (0, _selectors.getSelectedSource)(getState());

    if (keepContext && selectedSource && selectedSource.isOriginal != (0, _devtoolsSourceMap.isOriginalId)(location.sourceId)) {
      // getRelatedMapLocation will just convert to the related generated/original location.
      // i.e if the original location is passed, the related generated location will be returned and vice versa.
      location = await (0, _sourceMaps.getRelatedMapLocation)(getState(), sourceMaps, location);
      source = (0, _selectors.getLocationSource)(getState(), location);
    }

    if (!(0, _selectors.tabExists)(getState(), source.id)) {
      dispatch((0, _tabs.addTab)(source));
    }

    dispatch(setSelectedLocation(cx, source, location));
    await dispatch((0, _loadSourceText.loadSourceText)({
      cx,
      source
    }));
    await dispatch((0, _.setBreakableLines)(cx, source.id));
    const loadedSource = (0, _selectors.getSource)(getState(), source.id);

    if (!loadedSource) {
      // If there was a navigation while we were loading the loadedSource
      return;
    }

    const sourceTextContent = (0, _selectors.getSourceTextContent)(getState(), source.id);

    if (keepContext && _prefs.prefs.autoPrettyPrint && !(0, _selectors.getPrettySource)(getState(), loadedSource.id) && (0, _selectors.canPrettyPrintSource)(getState(), loadedSource.id) && (0, _source.isMinified)(source, sourceTextContent)) {
      await dispatch((0, _prettyPrint.togglePrettyPrint)(cx, loadedSource.id));
      dispatch((0, _tabs.closeTab)(cx, loadedSource));
    }

    await dispatch((0, _symbols.setSymbols)({
      cx,
      source: loadedSource
    }));
    dispatch((0, _ast.setInScopeLines)(cx));

    if ((0, _selectors.getIsCurrentThreadPaused)(getState())) {
      await dispatch((0, _pause.mapDisplayNames)(cx));
    } // If a new source is selected update the file search results


    const newSource = (0, _selectors.getSelectedSource)(getState());

    if (currentSource && currentSource !== newSource) {
      dispatch((0, _ui.updateActiveFileSearch)(cx));
    }
  };
}
/**
 * Select a location while ignoring the currently selected source.
 * This will select the generated location even if the currently
 * select source is an original source. And the other way around.
 *
 * @param {Object} cx
 * @param {Object} location
 *        The location to select, object which includes enough
 *        information to specify a precise source, line and column.
 */


function selectSpecificLocation(cx, location) {
  return selectLocation(cx, location, {
    keepContext: false
  });
}
/**
 * Select the "mapped location".
 *
 * If the passed location is on a generated source, select the
 * related location in the original source.
 * If the passed location is on an original source, select the
 * related location in the generated source.
 */


function jumpToMappedLocation(cx, location) {
  return async function ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) {
    if (!client) {
      return;
    } // Map to either an original or a generated source location


    const pairedLocation = await (0, _sourceMaps.getRelatedMapLocation)(getState(), sourceMaps, location);
    return dispatch(selectSpecificLocation(cx, pairedLocation));
  };
} // This is only used by tests


function jumpToMappedSelectedLocation(cx) {
  return async function ({
    dispatch,
    getState
  }) {
    const location = (0, _selectors.getSelectedLocation)(getState());

    if (!location) {
      return;
    }

    await dispatch(jumpToMappedLocation(cx, location));
  };
}