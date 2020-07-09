"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bootstrapStore = bootstrapStore;
exports.bootstrapWorkers = bootstrapWorkers;
exports.teardownWorkers = teardownWorkers;
exports.bootstrapApp = bootstrapApp;

var _react = _interopRequireDefault(require("devtools/client/shared/vendor/react"));

var _redux = require("devtools/client/shared/vendor/redux");

var _reactDom = _interopRequireDefault(require("devtools/client/shared/vendor/react-dom"));

var _storeProvider = _interopRequireDefault(require("devtools/client/framework/store-provider"));

var _devtoolsEnvironment = require("devtools/client/debugger/dist/vendors").vendored["devtools-environment"];

var _AppConstants = _interopRequireDefault(require("resource://gre/modules/AppConstants.jsm"));

var _devtoolsSourceMap = _interopRequireWildcard(require("devtools/client/shared/source-map/index.js"));

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

let parser;

function renderPanel(component, store, panel) {
  const root = document.createElement("div");
  root.className = "launchpad-root theme-body";
  root.style.setProperty("flex", "1");
  const mount = document.querySelector("#mount");

  if (!mount) {
    return;
  }

  mount.appendChild(root);
  const toolboxDoc = panel.panelWin.parent.document;

  _reactDom.default.render(_react.default.createElement(Provider, {
    store
  }, _react.default.createElement(_storeProvider.default, {
    store: panel.getToolboxStore()
  }, _react.default.createElement(component, {
    toolboxDoc
  }))), root);
}

function bootstrapStore(client, workers, panel, initialState) {
  const debugJsModules = _AppConstants.default.AppConstants.DEBUG_JS_MODULES == "1";
  const createStore = (0, _createStore.default)({
    log: _prefs.prefs.logging || (0, _devtoolsEnvironment.isTesting)(),
    timing: debugJsModules || (0, _devtoolsEnvironment.isDevelopment)(),
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
  const workerPath = (0, _devtoolsEnvironment.isDevelopment)() ? "assets/build" : "resource://devtools/client/debugger/dist";

  if ((0, _devtoolsEnvironment.isDevelopment)()) {
    // When used in Firefox, the toolbox manages the source map worker.
    (0, _devtoolsSourceMap.startSourceMapWorker)(`${workerPath}/source-map-worker.js`, // This is relative to the worker itself.
    "./source-map-worker-assets/");
  }

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
  if (!(0, _devtoolsEnvironment.isFirefoxPanel)()) {
    // When used in Firefox, the toolbox manages the source map worker.
    (0, _devtoolsSourceMap.stopSourceMapWorker)();
  }

  prettyPrint.stop();
  parser.stop();
  search.stop();
}

function bootstrapApp(store, panel) {
  if ((0, _devtoolsEnvironment.isFirefoxPanel)()) {
    renderPanel(_App.default, store, panel);
  } else {
    const {
      renderRoot
    } = require("devtools/shared/flags");

    renderRoot(_react.default, _reactDom.default, _App.default, store);
  }
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
    _prefs.asyncStore.pendingBreakpoints = selectors.getPendingBreakpoints(state);
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

  if (hasChanged(selectors.getBlackBoxList)) {
    _prefs.asyncStore.tabsBlackBoxed = selectors.getBlackBoxList(state);
  }
}