"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialThreadsState = initialThreadsState;
exports.default = update;
exports.getWorkerByThread = getWorkerByThread;
exports.getMainThread = getMainThread;
exports.getDebuggeeUrl = getDebuggeeUrl;
exports.getThread = getThread;
exports.startsWithThreadActor = startsWithThreadActor;
exports.getAllThreads = exports.getThreads = exports.getWorkerCount = void 0;

var _lodash = require("devtools/client/shared/vendor/lodash");

var _reselect = require("devtools/client/shared/vendor/reselect");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Threads reducer
 * @module reducers/threads
 */
function initialThreadsState() {
  return {
    threads: [],
    isWebExtension: false
  };
}

function update(state = initialThreadsState(), action) {
  switch (action.type) {
    case "CONNECT":
      return { ...state,
        isWebExtension: action.isWebExtension
      };

    case "INSERT_THREAD":
      return { ...state,
        threads: [...state.threads, action.newThread]
      };

    case "REMOVE_THREAD":
      const {
        oldThread
      } = action;
      return { ...state,
        threads: state.threads.filter(thread => oldThread.actor != thread.actor)
      };

    case "UPDATE_SERVICE_WORKER_STATUS":
      const {
        thread,
        status
      } = action;
      return { ...state,
        threads: state.threads.map(t => {
          if (t.actor == thread) {
            return { ...t,
              serviceWorkerStatus: status
            };
          }

          return t;
        })
      };

    default:
      return state;
  }
}

const getWorkerCount = state => getThreads(state).length;

exports.getWorkerCount = getWorkerCount;

function getWorkerByThread(state, thread) {
  return getThreads(state).find(worker => worker.actor == thread);
}

function isMainThread(thread) {
  return thread.isTopLevel;
}

function getMainThread(state) {
  return state.threads.threads.find(isMainThread);
}

function getDebuggeeUrl(state) {
  var _getMainThread;

  return ((_getMainThread = getMainThread(state)) === null || _getMainThread === void 0 ? void 0 : _getMainThread.url) || "";
}

const getThreads = (0, _reselect.createSelector)(state => state.threads.threads, threads => threads.filter(thread => !isMainThread(thread)));
exports.getThreads = getThreads;
const getAllThreads = (0, _reselect.createSelector)(getMainThread, getThreads, (mainThread, threads) => [mainThread, ...(0, _lodash.sortBy)(threads, thread => thread.name)].filter(Boolean));
exports.getAllThreads = getAllThreads;

function getThread(state, threadActor) {
  return getAllThreads(state).find(thread => thread.actor === threadActor);
} // checks if a path begins with a thread actor
// e.g "server1.conn0.child1/workerTarget22/context1/dbg-workers.glitch.me"


function startsWithThreadActor(state, path) {
  const threadActors = getAllThreads(state).map(t => t.actor);
  const match = path.match(new RegExp(`(${threadActors.join("|")})\/(.*)`));
  return match === null || match === void 0 ? void 0 : match[1];
}