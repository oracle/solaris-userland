"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = update;
exports.resourceAsSourceActor = resourceAsSourceActor;
exports.stringToSourceActorId = stringToSourceActorId;
exports.hasSourceActor = hasSourceActor;
exports.getSourceActor = getSourceActor;
exports.getSourceActors = getSourceActors;
exports.getSourceActorsForThread = getSourceActorsForThread;
exports.getThreadsBySource = getThreadsBySource;

var _resource = require("../utils/resource/index");

const initial = (0, _resource.createInitial)(); /* This Source Code Form is subject to the terms of the Mozilla Public
                                                 * License, v. 2.0. If a copy of the MPL was not distributed with this
                                                 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function update(state = initial, action) {
  switch (action.type) {
    case "INSERT_SOURCE_ACTORS":
      {
        const { items } = action;
        state = (0, _resource.insertResources)(state, items);
        break;
      }
    case "REMOVE_SOURCE_ACTORS":
      {
        const { items } = action;
        state = (0, _resource.removeResources)(state, items);
        break;
      }

    case "NAVIGATE":
      {
        state = initial;
        break;
      }
  }

  return state;
}

function resourceAsSourceActor(r) {
  return r;
}

// Because we are using an opaque type for our source actor IDs, these
// functions are required to convert back and forth in order to get a string
// version of the IDs. That should be super rarely used, but it means that
// we can very easily see where we're relying on the string version of IDs.
function stringToSourceActorId(s) {
  return s;
}

function hasSourceActor(state, id) {
  return (0, _resource.hasResource)(state.sourceActors, id);
}

function getSourceActor(state, id) {
  return (0, _resource.getResource)(state.sourceActors, id);
}

/**
 * Get all of the source actors for a set of IDs. Caches based on the identity
 * of "ids" when possible.
 */
const querySourceActorsById = (0, _resource.makeIdQuery)(resourceAsSourceActor);

function getSourceActors(state, ids) {
  return querySourceActorsById(state.sourceActors, ids);
}

const querySourcesByThreadID = (0, _resource.makeReduceAllQuery)(resourceAsSourceActor, actors => {
  return actors.reduce((acc, actor) => {
    acc[actor.thread] = acc[actor.thread] || [];
    acc[actor.thread].push(actor);
    return acc;
  }, {});
});
function getSourceActorsForThread(state, ids) {
  const sourcesByThread = querySourcesByThreadID(state.sourceActors);

  let sources = [];
  for (const id of Array.isArray(ids) ? ids : [ids]) {
    sources = sources.concat(sourcesByThread[id] || []);
  }
  return sources;
}

const queryThreadsBySourceObject = (0, _resource.makeReduceAllQuery)(actor => ({ thread: actor.thread, source: actor.source }), actors => actors.reduce((acc, { source, thread }) => {
  let sourceThreads = acc[source];
  if (!sourceThreads) {
    sourceThreads = [];
    acc[source] = sourceThreads;
  }

  sourceThreads.push(thread);
  return acc;
}, {}));

function getThreadsBySource(state) {
  return queryThreadsBySourceObject(state.sourceActors);
}