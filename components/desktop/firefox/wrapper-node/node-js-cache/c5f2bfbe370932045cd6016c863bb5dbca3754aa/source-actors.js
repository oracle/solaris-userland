"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertSourceActor = insertSourceActor;
exports.insertSourceActors = insertSourceActors;
exports.removeSourceActor = removeSourceActor;
exports.removeSourceActors = removeSourceActors;
exports.loadSourceActorBreakableLines = exports.loadSourceActorBreakpointColumns = void 0;
loader.lazyRequireGetter(this, "_sourceActors", "devtools/client/debugger/src/reducers/source-actors");
loader.lazyRequireGetter(this, "_memoizableAction", "devtools/client/debugger/src/utils/memoizableAction");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function insertSourceActor(item) {
  return insertSourceActors([item]);
}

function insertSourceActors(items) {
  return function ({
    dispatch
  }) {
    dispatch({
      type: "INSERT_SOURCE_ACTORS",
      items
    });
  };
}

function removeSourceActor(item) {
  return removeSourceActors([item]);
}

function removeSourceActors(items) {
  return function ({
    dispatch
  }) {
    dispatch({
      type: "REMOVE_SOURCE_ACTORS",
      items
    });
  };
}

const loadSourceActorBreakpointColumns = (0, _memoizableAction.memoizeableAction)("loadSourceActorBreakpointColumns", {
  createKey: ({
    id,
    line
  }) => `${id}:${line}`,
  getValue: ({
    id,
    line
  }, {
    getState
  }) => (0, _sourceActors.getSourceActorBreakpointColumns)(getState(), id, line),
  action: async ({
    id,
    line
  }, {
    dispatch,
    getState,
    client
  }) => {
    await dispatch({
      type: "SET_SOURCE_ACTOR_BREAKPOINT_COLUMNS",
      sourceId: id,
      line,
      [_promise.PROMISE]: (async () => {
        const positions = await client.getSourceActorBreakpointPositions((0, _sourceActors.getSourceActor)(getState(), id), {
          start: {
            line,
            column: 0
          },
          end: {
            line: line + 1,
            column: 0
          }
        });
        return positions[line] || [];
      })()
    });
  }
});
exports.loadSourceActorBreakpointColumns = loadSourceActorBreakpointColumns;
const loadSourceActorBreakableLines = (0, _memoizableAction.memoizeableAction)("loadSourceActorBreakableLines", {
  createKey: args => args.id,
  getValue: ({
    id
  }, {
    getState
  }) => (0, _sourceActors.getSourceActorBreakableLines)(getState(), id),
  action: async ({
    id
  }, {
    dispatch,
    getState,
    client
  }) => {
    await dispatch({
      type: "SET_SOURCE_ACTOR_BREAKABLE_LINES",
      sourceId: id,
      [_promise.PROMISE]: client.getSourceActorBreakableLines((0, _sourceActors.getSourceActor)(getState(), id))
    });
  }
});
exports.loadSourceActorBreakableLines = loadSourceActorBreakableLines;