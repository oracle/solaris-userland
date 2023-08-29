"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTarget = addTarget;
exports.removeTarget = removeTarget;
exports.toggleJavaScriptEnabled = toggleJavaScriptEnabled;
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function addTarget(targetFront) {
  return {
    type: "INSERT_THREAD",
    newThread: (0, _create.createThread)(targetFront)
  };
}

function removeTarget(targetFront) {
  return ({
    getState,
    dispatch
  }) => {
    const threadActorID = targetFront.targetForm.threadActor; // Just before emitting the REMOVE_THREAD action,
    // synchronously compute the list of source and source actor objects
    // which should be removed as that one target get removed.
    //
    // The list of source objects isn't trivial to compute as these objects
    // are shared across targets/threads.

    const {
      actors,
      sources
    } = (0, _selectors.getSourcesToRemoveForThread)(getState(), threadActorID);
    dispatch({
      type: "REMOVE_THREAD",
      threadActorID,
      actors,
      sources
    });
  };
}

function toggleJavaScriptEnabled(enabled) {
  return async ({
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