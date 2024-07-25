"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMainThread = getMainThread;
exports.getMainThreadHost = getMainThreadHost;
exports.getThread = getThread;
exports.getIsThreadCurrentlyTracing = getIsThreadCurrentlyTracing;
exports.getAllThreads = exports.getThreads = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_url", "devtools/client/debugger/src/utils/url");

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
/*
 * Gets domain from the main thread url (without www prefix)
 */


function getMainThreadHost(state) {
  const url = getMainThread(state)?.url;

  if (!url) {
    return null;
  }

  const {
    host
  } = (0, _url.parse)(url);

  if (!host) {
    return null;
  }

  return host.startsWith("www.") ? host.substring("www.".length) : host;
}

function getThread(state, threadActor) {
  return getAllThreads(state).find(thread => thread.actor === threadActor);
}

function getIsThreadCurrentlyTracing(state, thread) {
  return state.threads.mutableTracingThreads.has(thread);
}