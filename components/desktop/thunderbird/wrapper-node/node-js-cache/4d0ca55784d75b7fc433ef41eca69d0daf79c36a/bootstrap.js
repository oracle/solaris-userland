"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bootstrapStore = bootstrapStore;
exports.bootstrapWorkers = bootstrapWorkers;
exports.teardownWorkers = teardownWorkers;
exports.bootstrapApp = bootstrapApp;
exports.unmountRoot = unmountRoot;

var _react = _interopRequireDefault(require("devtools/client/shared/vendor/react"));

var _redux = require("devtools/client/shared/vendor/redux");

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

var _storeProvider = _interopRequireDefault(require("devtools/client/framework/store-provider"));

var _flags = _interopRequireDefault(require("devtools/shared/flags"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/workers/search/index");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/workers/pretty-print/index");

var _createStore = _interopRequireDefault(require("../actions/utils/create-store"));

var _index3 = _interopRequireDefault(require("../reducers/index"));

var selectors = _interopRequireWildcard(require("../selectors/index"));

var _App = _interopRequireDefault(require("../components/App"));

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_tabs", "devtools/client/debugger/src/utils/tabs");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const {
  Provider
} = require("resource://devtools/client/shared/vendor/react-redux.js");

const {
  registerStoreObserver
} = require("resource://devtools/client/shared/redux/subscriber.js");

const {
  AppConstants
} = ChromeUtils.importESModule("resource://gre/modules/AppConstants.sys.mjs");

const {
  sanitizeBreakpoints
} = require("resource://devtools/client/shared/thread-utils.js");

const {
  visibilityHandlerStore
} = require("resource://devtools/client/shared/redux/visibilityHandlerStore.js");

let gWorkers;

function bootstrapStore(client, workers, panel, initialState) {
  const debugJsModules = AppConstants.DEBUG_JS_MODULES == "1";
  const createStore = (0, _createStore.default)({
    log: _prefs.prefs.logging || _flags.default.testing,
    timing: debugJsModules,
    makeThunkArgs: args => {
      return { ...args,
        client,
        ...workers,
        panel
      };
    }
  });
  let store = createStore((0, _redux.combineReducers)(_index3.default), initialState); // Also wrap the store in order to pause store update notifications while the panel is hidden.

  store = visibilityHandlerStore(store);
  registerStoreObserver(store, updatePrefs);
  const actions = (0, _redux.bindActionCreators)( // eslint-disable-next-line mozilla/reject-relative-requires
  require("../actions/index").default, store.dispatch);
  return {
    store,
    actions,
    selectors
  };
}

function bootstrapWorkers(panelWorkers) {
  // The panel worker will typically be the source map and parser workers.
  // Both will be managed by the toolbox.
  gWorkers = {
    prettyPrintWorker: new _index2.PrettyPrintDispatcher(),
    searchWorker: new _index.SearchDispatcher()
  };
  return { ...panelWorkers,
    ...gWorkers
  };
}

function teardownWorkers() {
  gWorkers.prettyPrintWorker.stop();
  gWorkers.searchWorker.stop();
}
/**
 * Create and mount the root App component.
 *
 * @param {ReduxStore} store
 * @param {ReduxStore} toolboxStore
 * @param {Object} appComponentAttributes
 * @param {Array} appComponentAttributes.fluentBundles
 * @param {Document} appComponentAttributes.toolboxDoc
 */


function bootstrapApp(store, toolboxStore, appComponentAttributes = {}) {
  const mount = getMountElement();

  if (!mount) {
    return;
  }

  _reactDom.default.render(_react.default.createElement(Provider, {
    store
  }, _react.default.createElement(_storeProvider.default, {
    store: toolboxStore
  }, _react.default.createElement(_App.default, appComponentAttributes))), mount);
}

function getMountElement() {
  return document.querySelector("#mount");
} // This is the opposite of bootstrapApp


function unmountRoot() {
  _reactDom.default.unmountComponentAtNode(getMountElement());
}

function updatePrefs(state, oldState) {
  const hasChanged = selector => selector(oldState) && selector(oldState) !== selector(state);

  if (hasChanged(selectors.getPendingBreakpoints)) {
    _prefs.asyncStore.pendingBreakpoints = sanitizeBreakpoints(selectors.getPendingBreakpoints(state));
  }

  if (oldState.eventListenerBreakpoints && oldState.eventListenerBreakpoints !== state.eventListenerBreakpoints) {
    _prefs.asyncStore.eventListenerBreakpoints = state.eventListenerBreakpoints;
  }

  if (hasChanged(selectors.getTabs)) {
    _prefs.asyncStore.tabs = (0, _tabs.persistTabs)(selectors.getTabs(state));
  }

  if (hasChanged(selectors.getXHRBreakpoints)) {
    _prefs.asyncStore.xhrBreakpoints = selectors.getXHRBreakpoints(state);
  }

  if (hasChanged(selectors.getBlackBoxRanges)) {
    _prefs.asyncStore.blackboxedRanges = selectors.getBlackBoxRanges(state);
  }

  if (hasChanged(selectors.getMainThreadProjectDirectoryRoots)) {
    _prefs.asyncStore.directoryRoots = selectors.getMainThreadProjectDirectoryRoots(state);
  }
}