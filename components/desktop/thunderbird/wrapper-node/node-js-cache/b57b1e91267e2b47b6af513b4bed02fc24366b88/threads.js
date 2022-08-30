"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMainThread = getMainThread;
exports.getDebuggeeUrl = getDebuggeeUrl;
exports.getThread = getThread;
exports.startsWithThreadActor = startsWithThreadActor;
exports.getAllThreads = exports.getThreads = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const getThreads = (0, _reselect.createSelector)(state => state.threads.threads, threads => threads.filter(thread => !isMainThread(thread)));
exports.getThreads = getThreads;
const getAllThreads = (0, _reselect.createSelector)(getMainThread, getThreads, (mainThread, threads) => {
  const orderedThreads = Array.from(threads).sort((threadA, threadB) => {
    if (threadA.name === threadB.name) {
      return 0;
    }

    return threadA.name < threadB.name ? -1 : 1;
  });
  return [mainThread, ...orderedThreads].filter(Boolean);
});
exports.getAllThreads = getAllThreads;

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

function getThread(state, threadActor) {
  return getAllThreads(state).find(thread => thread.actor === threadActor);
} // checks if a path begins with a thread actor
// e.g "server1.conn0.child1/workerTarget22/context1/dbg-workers.glitch.me"


function startsWithThreadActor(state, path) {
  const threadActors = getAllThreads(state).map(t => t.actor);
  const match = path.match(new RegExp(`(${threadActors.join("|")})\/(.*)`));
  return match === null || match === void 0 ? void 0 : match[1];
}