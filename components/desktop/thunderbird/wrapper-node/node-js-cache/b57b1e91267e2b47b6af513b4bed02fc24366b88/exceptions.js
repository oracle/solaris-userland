"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasException = hasException;
exports.getSelectedException = getSelectedException;
exports.getSelectedSourceExceptions = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getExceptionsMap(state) {
  return state.exceptions.exceptions;
}

const getSelectedSourceExceptions = (0, _reselect.createSelector)(getSelectedSourceActors, getExceptionsMap, (sourceActors, exceptions) => {
  const sourceExceptions = [];
  sourceActors.forEach(sourceActor => {
    const actorId = sourceActor.id;

    if (exceptions[actorId]) {
      sourceExceptions.push(...exceptions[actorId]);
    }
  });
  return sourceExceptions;
});
exports.getSelectedSourceExceptions = getSelectedSourceExceptions;

function getSelectedSourceActors(state) {
  const selectedSource = (0, _.getSelectedSource)(state);

  if (!selectedSource) {
    return [];
  }

  return (0, _.getSourceActorsForSource)(state, selectedSource.id);
}

function hasException(state, line, column) {
  return !!getSelectedException(state, line, column);
}

function getSelectedException(state, line, column) {
  const sourceExceptions = getSelectedSourceExceptions(state);

  if (!sourceExceptions) {
    return;
  }

  return sourceExceptions.find(sourceExc => sourceExc.lineNumber === line && sourceExc.columnNumber === column);
}