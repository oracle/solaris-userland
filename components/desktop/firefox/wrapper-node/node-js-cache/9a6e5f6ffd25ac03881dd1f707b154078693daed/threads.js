"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTarget = addTarget;
exports.removeTarget = removeTarget;
exports.toggleJavaScriptEnabled = toggleJavaScriptEnabled;
loader.lazyRequireGetter(this, "_create", "devtools/client/debugger/src/client/firefox/create");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_sourceDocuments", "devtools/client/debugger/src/utils/editor/source-documents");

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
    dispatch,
    parserWorker
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
    } = (0, _index.getSourcesToRemoveForThread)(getState(), threadActorID); // CodeMirror documents aren't stored in redux reducer,
    // so we need this manual function call in order to ensure clearing them.

    (0, _sourceDocuments.clearDocumentsForSources)(sources); // Notify the reducers that a target/thread is being removed
    // and that all related resources should be cleared.
    // This action receives the list of related source actors and source objects
    // related to that to-be-removed target.
    // This will be fired on navigation for all existing targets.
    // That except the top target, when pausing on unload, where the top target may still hold longer.
    // Also except for service worker targets, which may be kept alive.

    dispatch({
      type: "REMOVE_THREAD",
      threadActorID,
      actors,
      sources
    });
    parserWorker.clearSources(sources.map(source => source.id));
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