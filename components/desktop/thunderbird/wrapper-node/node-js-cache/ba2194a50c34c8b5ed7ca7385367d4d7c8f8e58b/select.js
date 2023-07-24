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

var _index = require("devtools/client/shared/source-map-loader/index");

loader.lazyRequireGetter(this, "_symbols", "devtools/client/debugger/src/actions/sources/symbols");
loader.lazyRequireGetter(this, "_ast", "devtools/client/debugger/src/actions/ast/index");
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
const setSelectedLocation = (cx, location, shouldSelectOriginalLocation) => ({
  type: "SET_SELECTED_LOCATION",
  cx,
  location,
  shouldSelectOriginalLocation
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
    getState
  }) => {
    const source = (0, _selectors.getSourceByURL)(getState(), url);

    if (!source) {
      return dispatch(setPendingSelectedLocation(cx, url, options));
    }

    const location = (0, _location.createLocation)({ ...options,
      source
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
 * @param {String} source
 *        The precise source to select.
 * @param {String} sourceActor
 *        The specific source actor of the source to
 *        select the source text. This is optional.
 */


function selectSource(cx, source, sourceActor) {
  return async ({
    dispatch
  }) => {
    // `createLocation` requires a source object, but we may use selectSource to close the last tab,
    // where source will be null and the location will be an empty object.
    const location = source ? (0, _location.createLocation)({
      source,
      sourceActor
    }) : {};
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
  return async thunkArgs => {
    const {
      dispatch,
      getState,
      client
    } = thunkArgs;

    if (!client) {
      // No connection, do nothing. This happens when the debugger is
      // shut down too fast and it tries to display a default source.
      return;
    }

    let source = location.source;

    if (!source) {
      // If there is no source we deselect the current selected source
      dispatch(clearSelectedLocation(cx));
      return;
    } // Preserve the current source map context (original / generated)
    // when navigating to a new location.
    // i.e. if keepContext isn't manually overriden to false,
    // we will convert the source we want to select to either
    // original/generated in order to match the currently selected one.
    // If the currently selected source is original, we will
    // automatically map `location` to refer to the original source,
    // even if that used to refer only to the generated source.


    let shouldSelectOriginalLocation = (0, _selectors.getShouldSelectOriginalLocation)(getState());

    if (keepContext) {
      if (shouldSelectOriginalLocation != (0, _index.isOriginalId)(location.sourceId)) {
        // getRelatedMapLocation will convert to the related generated/original location.
        // i.e if the original location is passed, the related generated location will be returned and vice versa.
        location = await (0, _sourceMaps.getRelatedMapLocation)(location, thunkArgs); // Note that getRelatedMapLocation may return the exact same location.
        // For example, if the source-map is half broken, it may return a generated location
        // while we were selecting original locations. So we may be seeing bundles intermittently
        // when stepping through broken source maps. And we will see original sources when stepping
        // through functional original sources.

        source = location.source;
      }
    } else {
      shouldSelectOriginalLocation = (0, _index.isOriginalId)(location.sourceId);
    }

    let sourceActor = location.sourceActor;

    if (!sourceActor) {
      sourceActor = (0, _selectors.getFirstSourceActorForGeneratedSource)(getState(), source.id);
      location = (0, _location.createLocation)({ ...location,
        sourceActor
      });
    }

    if (!(0, _selectors.tabExists)(getState(), source.id)) {
      dispatch((0, _tabs.addTab)(source, sourceActor));
    }

    dispatch(setSelectedLocation(cx, location, shouldSelectOriginalLocation));
    await dispatch((0, _loadSourceText.loadSourceText)(cx, source, sourceActor));
    await dispatch((0, _.setBreakableLines)(cx, location));
    const loadedSource = (0, _selectors.getSource)(getState(), source.id);

    if (!loadedSource) {
      // If there was a navigation while we were loading the loadedSource
      return;
    }

    const sourceTextContent = (0, _selectors.getSourceTextContent)(getState(), location);

    if (keepContext && _prefs.prefs.autoPrettyPrint && !(0, _selectors.getPrettySource)(getState(), loadedSource.id) && (0, _selectors.canPrettyPrintSource)(getState(), location) && (0, _source.isMinified)(source, sourceTextContent)) {
      await dispatch((0, _prettyPrint.togglePrettyPrint)(cx, loadedSource.id));
      dispatch((0, _tabs.closeTab)(cx, loadedSource));
    }

    await dispatch((0, _symbols.setSymbols)({
      cx,
      location
    }));
    dispatch((0, _ast.setInScopeLines)(cx));

    if ((0, _selectors.getIsCurrentThreadPaused)(getState())) {
      await dispatch((0, _pause.mapDisplayNames)(cx));
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
  return async function (thunkArgs) {
    const {
      client,
      dispatch
    } = thunkArgs;

    if (!client) {
      return null;
    } // Map to either an original or a generated source location


    const pairedLocation = await (0, _sourceMaps.getRelatedMapLocation)(location, thunkArgs);
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