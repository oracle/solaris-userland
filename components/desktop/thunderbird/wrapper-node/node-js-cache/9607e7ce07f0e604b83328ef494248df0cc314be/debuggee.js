"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateWorkers = updateWorkers;

var _lodash = require("devtools/client/shared/vendor/lodash");

var _sourceActors = require("./source-actors");

var _selectors = require("../selectors/index");

function updateWorkers() {
  return async function ({ dispatch, getState, client }) {
    const cx = (0, _selectors.getContext)(getState());
    const workers = await client.fetchWorkers();

    const currentWorkers = (0, _selectors.getWorkers)(getState());

    const addedWorkers = (0, _lodash.differenceBy)(workers, currentWorkers, w => w.actor);
    const removedWorkers = (0, _lodash.differenceBy)(currentWorkers, workers, w => w.actor);
    if (removedWorkers.length > 0) {
      const sourceActors = (0, _selectors.getSourceActorsForThread)(getState(), removedWorkers.map(w => w.actor));
      dispatch((0, _sourceActors.removeSourceActors)(sourceActors));
      dispatch({
        type: "REMOVE_WORKERS",
        cx,
        workers: removedWorkers.map(w => w.actor)
      });
    }
    if (addedWorkers.length > 0) {
      dispatch({ type: "INSERT_WORKERS", cx, workers: addedWorkers });
    }
  };
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */