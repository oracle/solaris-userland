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
exports.getAllThreadsBySource = getAllThreadsBySource;
exports.getSourceActorBreakableLines = getSourceActorBreakableLines;
exports.getSourceActorBreakpointColumns = getSourceActorBreakpointColumns;
exports.getBreakableLinesForSourceActors = exports.initial = void 0;
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_resource", "devtools/client/debugger/src/utils/resource/index");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const initial = (0, _resource.createInitial)();
exports.initial = initial;

function update(state = initial, action) {
  switch (action.type) {
    case "INSERT_SOURCE_ACTORS":
      {
        const {
          items
        } = action;
        state = (0, _resource.insertResources)(state, items.map(item => ({ ...item,
          breakpointPositions: new Map(),
          breakableLines: null
        })));
        break;
      }

    case "REMOVE_SOURCE_ACTORS":
      {
        state = (0, _resource.removeResources)(state, action.items);
        break;
      }

    case "NAVIGATE":
      {
        state = initial;
        break;
      }

    case "SET_SOURCE_ACTOR_BREAKPOINT_COLUMNS":
      state = updateBreakpointColumns(state, action);
      break;

    case "SET_SOURCE_ACTOR_BREAKABLE_LINES":
      state = updateBreakableLines(state, action);
      break;

    case "CLEAR_SOURCE_ACTOR_MAP_URL":
      state = clearSourceActorMapURL(state, action.id);
      break;
  }

  return state;
}

function clearSourceActorMapURL(state, id) {
  if (!(0, _resource.hasResource)(state, id)) {
    return state;
  }

  return (0, _resource.updateResources)(state, [{
    id,
    sourceMapURL: ""
  }]);
}

function updateBreakpointColumns(state, action) {
  const {
    sourceId,
    line
  } = action;
  const value = (0, _promise.asyncActionAsValue)(action);

  if (!(0, _resource.hasResource)(state, sourceId)) {
    return state;
  }

  const breakpointPositions = new Map((0, _resource.getResource)(state, sourceId).breakpointPositions);
  breakpointPositions.set(line, value);
  return (0, _resource.updateResources)(state, [{
    id: sourceId,
    breakpointPositions
  }]);
}

function updateBreakableLines(state, action) {
  const value = (0, _promise.asyncActionAsValue)(action);
  const {
    sourceId
  } = action;

  if (!(0, _resource.hasResource)(state, sourceId)) {
    return state;
  }

  return (0, _resource.updateResources)(state, [{
    id: sourceId,
    breakableLines: value
  }]);
}

function resourceAsSourceActor({
  breakpointPositions,
  breakableLines,
  ...sourceActor
}) {
  return sourceActor;
} // Because we are using an opaque type for our source actor IDs, these
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
  return (0, _resource.getMappedResource)(state.sourceActors, id, resourceAsSourceActor);
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

const queryThreadsBySourceObject = (0, _resource.makeReduceAllQuery)(actor => ({
  thread: actor.thread,
  source: actor.source
}), actors => actors.reduce((acc, {
  source,
  thread
}) => {
  let sourceThreads = acc[source];

  if (!sourceThreads) {
    sourceThreads = [];
    acc[source] = sourceThreads;
  }

  sourceThreads.push(thread);
  return acc;
}, {}));

function getAllThreadsBySource(state) {
  return queryThreadsBySourceObject(state.sourceActors);
}

function getSourceActorBreakableLines(state, id) {
  const {
    breakableLines
  } = (0, _resource.getResource)(state.sourceActors, id);
  return (0, _asyncValue.asSettled)(breakableLines);
}

function getSourceActorBreakpointColumns(state, id, line) {
  const {
    breakpointPositions
  } = (0, _resource.getResource)(state.sourceActors, id);
  return (0, _asyncValue.asSettled)(breakpointPositions.get(line) || null);
}

const getBreakableLinesForSourceActors = (0, _resource.makeWeakQuery)({
  filter: (state, ids) => ids,
  map: ({
    breakableLines
  }) => breakableLines,
  reduce: items => Array.from(items.reduce((acc, item) => {
    if (item && item.state === "fulfilled") {
      acc = acc.concat(item.value);
    }

    return acc;
  }, []))
});
exports.getBreakableLinesForSourceActors = getBreakableLinesForSourceActors;