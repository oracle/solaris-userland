"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareSourcePayload = prepareSourcePayload;
exports.createFrame = createFrame;
exports.makeSourceId = makeSourceId;
exports.createPause = createPause;
exports.createWorker = createWorker;

var _commands = require("./commands");

function prepareSourcePayload(client, source) {
  // We populate the set of sources as soon as we hear about them. Note that
  // this means that we have seen an actor, but it might still be in the
  // debounced queue for creation, so the Redux store itself might not have
  // a source actor with this ID yet.
  _commands.clientCommands.registerSourceActor(source.actor, makeSourceId(source));

  return { thread: client.actor, source };
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

// This module converts Firefox specific types to the generic types

function createFrame(thread, frame) {
  if (!frame) {
    return null;
  }

  const location = {
    sourceId: _commands.clientCommands.getSourceForActor(frame.where.actor),
    line: frame.where.line,
    column: frame.where.column
  };

  return {
    id: frame.actor,
    thread,
    displayName: frame.displayName,
    location,
    generatedLocation: location,
    this: frame.this,
    source: null,
    scope: frame.environment
  };
}

function makeSourceId(source) {
  return source.url ? `sourceURL-${source.url}` : `source-${source.actor}`;
}

function createPause(thread, packet, response) {
  // NOTE: useful when the debugger is already paused
  const frame = packet.frame || response.frames[0];

  return {
    ...packet,
    thread,
    frame: createFrame(thread, frame),
    frames: response.frames.map(createFrame.bind(null, thread))
  };
}

function createWorker(actor, url) {
  return {
    actor,
    url,
    // Ci.nsIWorkerDebugger.TYPE_DEDICATED
    type: 0,
    name: ""
  };
}