"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareSourcePayload = prepareSourcePayload;
exports.createFrame = createFrame;
exports.makeSourceId = makeSourceId;
exports.createPause = createPause;
exports.createThread = createThread;
loader.lazyRequireGetter(this, "_commands", "devtools/client/debugger/src/client/firefox/commands");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// This module converts Firefox specific types to the generic types
function prepareSourcePayload(threadFront, source) {
  const {
    isServiceWorker
  } = threadFront.parentFront; // We populate the set of sources as soon as we hear about them. Note that
  // this means that we have seen an actor, but it might still be in the
  // debounced queue for creation, so the Redux store itself might not have
  // a source actor with this ID yet.

  _commands.clientCommands.registerSourceActor(source.actor, makeSourceId(source, isServiceWorker));

  source = { ...source
  }; // Maintain backward-compat with servers that only return introductionUrl and
  // not sourceMapBaseURL.

  if (typeof source.sourceMapBaseURL === "undefined" && typeof source.introductionUrl !== "undefined") {
    source.sourceMapBaseURL = source.url || source.introductionUrl || null;
    delete source.introductionUrl;
  }

  return {
    thread: threadFront.actor,
    isServiceWorker,
    source
  };
}

function createFrame(thread, frame, index = 0) {
  if (!frame) {
    return null;
  }

  const location = {
    sourceId: _commands.clientCommands.getSourceForActor(frame.where.actor),
    line: frame.where.line,
    column: frame.where.column
  };
  return {
    id: frame.actorID,
    thread,
    displayName: frame.displayName,
    location,
    generatedLocation: location,
    this: frame.this,
    source: null,
    index,
    asyncCause: frame.asyncCause,
    state: frame.state
  };
}

function makeSourceId(source, isServiceWorker) {
  // Source actors with the same URL will be given the same source ID and
  // grouped together under the same source in the client. There is an exception
  // for sources from service workers, where there may be multiple service
  // worker threads running at the same time which use different versions of the
  // same URL.
  return source.url && !isServiceWorker ? `sourceURL-${source.url}` : `source-${source.actor}`;
}

function createPause(thread, packet) {
  return { ...packet,
    thread,
    frame: createFrame(thread, packet.frame)
  };
}

function getTargetType(target) {
  if (target.isWorkerTarget) {
    return "worker";
  }

  if (target.isContentProcess) {
    return "contentProcess";
  }

  return "mainThread";
}

function createThread(actor, target) {
  return {
    actor,
    url: target.url,
    type: getTargetType(target),
    name: target.name,
    serviceWorkerStatus: target.debuggerServiceWorkerStatus
  };
}