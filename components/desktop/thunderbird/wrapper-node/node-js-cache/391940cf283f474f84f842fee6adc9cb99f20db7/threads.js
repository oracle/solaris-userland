"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTarget = addTarget;
exports.removeTarget = removeTarget;
exports.updateThreads = updateThreads;
exports.ensureHasThread = ensureHasThread;
exports.toggleJavaScriptEnabled = toggleJavaScriptEnabled;

var _lodash = require("devtools/client/shared/vendor/lodash");

loader.lazyRequireGetter(this, "_sourceActors", "devtools/client/debugger/src/actions/source-actors");
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_context", "devtools/client/debugger/src/utils/context");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
async function addThreads({
  dispatch,
  client,
  getState
}, addedThreads) {
  const cx = (0, _selectors.getContext)(getState());
  dispatch({
    type: "INSERT_THREADS",
    cx,
    threads: addedThreads
  }); // Fetch the sources and install breakpoints on any new workers.

  await Promise.all(addedThreads.map(async thread => {
    try {
      const sources = await client.fetchThreadSources(thread.actor);
      (0, _context.validateContext)(getState(), cx);
      await dispatch((0, _sources.newGeneratedSources)(sources));
    } catch (e) {
      // NOTE: This fails quietly because it is pretty easy for sources to
      // throw during the fetch if their thread shuts down,
      // which would cause test failures.
      console.error(e);
    }
  }));
}

function removeThreads({
  dispatch,
  client,
  getState
}, removedThreads) {
  const cx = (0, _selectors.getContext)(getState());
  const sourceActors = (0, _selectors.getSourceActorsForThread)(getState(), removedThreads.map(t => t.actor));
  dispatch((0, _sourceActors.removeSourceActors)(sourceActors));
  dispatch({
    type: "REMOVE_THREADS",
    cx,
    threads: removedThreads.map(t => t.actor)
  });
}

function addTarget(targetFront) {
  return async function (args) {
    const {
      client,
      getState
    } = args;
    const cx = (0, _selectors.getContext)(getState());
    const thread = await client.attachThread(targetFront);
    (0, _context.validateContext)(getState(), cx);
    return addThreads(args, [thread]);
  };
}

function removeTarget(targetFront) {
  return async function (args) {
    const {
      getState
    } = args;
    const currentThreads = (0, _selectors.getThreads)(getState());
    const {
      actorID
    } = targetFront.threadFront;
    const thread = currentThreads.find(t => t.actor == actorID);

    if (thread) {
      return removeThreads(args, [thread]);
    }
  };
}

function updateThreads() {
  return async function (args) {
    const {
      dispatch,
      getState,
      client
    } = args;
    const cx = (0, _selectors.getContext)(getState());
    const threads = await client.fetchThreads();
    (0, _context.validateContext)(getState(), cx); // looking at all the threads includes the mainThread in the list. This will go away in the next set of patches.

    const currentThreads = (0, _selectors.getAllThreads)(getState());
    const addedThreads = (0, _lodash.differenceBy)(threads, currentThreads, t => t.actor);
    const removedThreads = (0, _lodash.differenceBy)(currentThreads, threads, t => t.actor);

    if (removedThreads.length > 0) {
      removeThreads(args, removedThreads);
    }

    if (addedThreads.length > 0) {
      await addThreads(args, addedThreads);
    } // Update the status of any service workers.


    for (const thread of currentThreads) {
      if (thread.serviceWorkerStatus) {
        for (const fetchedThread of threads) {
          if (fetchedThread.actor == thread.actor && fetchedThread.serviceWorkerStatus != thread.serviceWorkerStatus) {
            dispatch({
              type: "UPDATE_SERVICE_WORKER_STATUS",
              cx,
              thread: thread.actor,
              status: fetchedThread.serviceWorkerStatus
            });
          }
        }
      }
    }
  };
}

function ensureHasThread(thread) {
  return async function ({
    dispatch,
    getState,
    client
  }) {
    const currentThreads = (0, _selectors.getAllThreads)(getState());

    if (!currentThreads.some(t => t.actor == thread)) {
      await dispatch(updateThreads());
    }
  };
}

function toggleJavaScriptEnabled(enabled) {
  return async ({
    panel,
    dispatch,
    client
  }) => {
    await client.toggleJavaScriptEnabled(enabled);
    dispatch({
      type: "TOGGLE_JAVASCRIPT_ENABLED",
      value: enabled
    });
  };
}