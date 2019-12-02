"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThreads = exports.getWorkerCount = exports.getWorkers = undefined;
exports.initialDebuggeeState = initialDebuggeeState;
exports.default = debuggee;
exports.getWorkerByThread = getWorkerByThread;
exports.getMainThread = getMainThread;
exports.getDebuggeeUrl = getDebuggeeUrl;

var _lodash = require("devtools/client/shared/vendor/lodash");

var _reselect = require("devtools/client/debugger/dist/vendors").vendored["reselect"];

var _workers = require("../utils/workers");

function initialDebuggeeState() {
  return {
    workers: [],
    mainThread: { actor: "", url: "", type: -1, name: "" },
    isWebExtension: false
  };
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Debuggee reducer
 * @module reducers/debuggee
 */

function debuggee(state = initialDebuggeeState(), action) {
  switch (action.type) {
    case "CONNECT":
      return {
        ...state,
        mainThread: { ...action.mainThread, name: L10N.getStr("mainThread") },
        isWebExtension: action.isWebExtension
      };
    case "INSERT_WORKERS":
      return insertWorkers(state, action.workers);
    case "REMOVE_WORKERS":
      const { workers } = action;
      return {
        ...state,
        workers: state.workers.filter(w => !workers.includes(w.actor))
      };
    case "NAVIGATE":
      return {
        ...initialDebuggeeState(),
        mainThread: action.mainThread
      };
    default:
      return state;
  }
}

function insertWorkers(state, workers) {
  const formatedWorkers = workers.map(worker => ({
    ...worker,
    name: (0, _workers.getDisplayName)(worker)
  }));

  return {
    ...state,
    workers: [...state.workers, ...formatedWorkers]
  };
}

const getWorkers = exports.getWorkers = state => state.debuggee.workers;

const getWorkerCount = exports.getWorkerCount = state => getWorkers(state).length;

function getWorkerByThread(state, thread) {
  return getWorkers(state).find(worker => worker.actor == thread);
}

function getMainThread(state) {
  return state.debuggee.mainThread;
}

function getDebuggeeUrl(state) {
  return getMainThread(state).url;
}

const getThreads = exports.getThreads = (0, _reselect.createSelector)(getMainThread, getWorkers, (mainThread, workers) => [mainThread, ...(0, _lodash.sortBy)(workers, _workers.getDisplayName)]);