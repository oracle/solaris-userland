"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertSourceActors = insertSourceActors;
exports.loadSourceActorBreakableLines = void 0;
loader.lazyRequireGetter(this, "_sourceActors", "devtools/client/debugger/src/selectors/source-actors");
loader.lazyRequireGetter(this, "_memoizableAction", "devtools/client/debugger/src/utils/memoizableAction");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
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