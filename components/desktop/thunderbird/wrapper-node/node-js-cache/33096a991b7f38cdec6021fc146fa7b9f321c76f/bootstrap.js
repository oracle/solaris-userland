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

var search = _interopRequireWildcard(require("../workers/search/index"));

var prettyPrint = _interopRequireWildcard(require("../workers/pretty-print/index"));

loader.lazyRequireGetter(this, "_parser", "devtools/client/debugger/src/workers/parser/index");

var _createStore = _interopRequireDefault(require("../actions/utils/create-store"));

var _reducers = _interopRequireDefault(require("../reducers/index"));

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
} = require("devtools/client/shared/vendor/react-redux");

const {
  AppConstants
} = require("resource://gre/modules/AppConstants.jsm");

const {
  sanitizeBreakpoints
} = require("devtools/client/shared/thread-utils");

let parser;

function bootstrapStore(client, workers, panel, initialState) {
  const debugJsModules = AppConstants.DEBUG_JS_MODULES == "1";
  const createStore = (0, _createStore.default)({
    log: _prefs.prefs.logging || _flags.default.testing,
    timing: debugJsModules,
    makeThunkArgs: (args, state) => {
      return { ...args,
        client,
        ...workers,
        panel
      };
    }
  });
  const store = createStore((0, _redux.combineReducers)(_reducers.default), initialState);
  registerStoreObserver(store, updatePrefs);
  const actions = (0, _redux.bindActionCreators)(require("../actions/index").default, store.dispatch);
  return {
    store,
    actions,
    selectors
  };
}

function bootstrapWorkers(panelWorkers) {
  const workerPath = "resource://devtools/client/debugger/dist";
  prettyPrint.start(`${workerPath}/pretty-print-worker.js`);
  parser = new _parser.ParserDispatcher();
  parser.start(`${workerPath}/parser-worker.js`);
  search.start(`${workerPath}/search-worker.js`);
  return { ...panelWorkers,
    prettyPrint,
    parser,
    search
  };
}

function teardownWorkers() {
  prettyPrint.stop();
  parser.stop();
  search.stop();
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

function registerStoreObserver(store, subscriber) {
  let oldState = store.getState();
  store.subscribe(() => {
    const state = store.getState();
    subscriber(state, oldState);
    oldState = state;
  });
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
}