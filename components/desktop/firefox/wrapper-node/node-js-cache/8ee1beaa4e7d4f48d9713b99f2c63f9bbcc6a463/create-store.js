"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _redux = require("devtools/client/shared/vendor/redux");

loader.lazyRequireGetter(this, "_waitService", "devtools/client/debugger/src/actions/utils/middleware/wait-service");
loader.lazyRequireGetter(this, "_log", "devtools/client/debugger/src/actions/utils/middleware/log");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_thunk", "devtools/client/debugger/src/actions/utils/middleware/thunk");
loader.lazyRequireGetter(this, "_timing", "devtools/client/debugger/src/actions/utils/middleware/timing");
loader.lazyRequireGetter(this, "_context", "devtools/client/debugger/src/actions/utils/middleware/context");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/* global window */

/**
 * Redux store utils
 * @module utils/create-store
 */

/**
 * @memberof utils/create-store
 * @static
 */

/**
 * This creates a dispatcher with all the standard middleware in place
 * that all code requires. It can also be optionally configured in
 * various ways, such as logging and recording.
 *
 * @param {object} opts:
 *        - log: log all dispatched actions to console
 *        - history: an array to store every action in. Should only be
 *                   used in tests.
 *        - middleware: array of middleware to be included in the redux store
 * @memberof utils/create-store
 * @static
 */
const configureStore = (opts = {}) => {
  const middleware = [(0, _thunk.thunk)(opts.makeThunkArgs), _context.context, _promise.promise, // Order is important: services must go last as they always
  // operate on "already transformed" actions. Actions going through
  // them shouldn't have any special fields like promises, they
  // should just be normal JSON objects.
  _waitService.waitUntilService];

  if (opts.middleware) {
    opts.middleware.forEach(fn => middleware.push(fn));
  }

  if (opts.log) {
    middleware.push(_log.log);
  }

  if (opts.timing) {
    middleware.push(_timing.timing);
  } // Hook in the redux devtools browser extension if it exists


  const devtoolsExt = typeof window === "object" && window.devToolsExtension ? window.devToolsExtension() : f => f;
  return (0, _redux.applyMiddleware)(...middleware)(devtoolsExt(_redux.createStore));
};

var _default = configureStore;
exports.default = _default;