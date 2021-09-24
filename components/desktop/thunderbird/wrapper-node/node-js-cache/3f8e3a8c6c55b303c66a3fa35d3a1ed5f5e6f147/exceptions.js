"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialExceptionsState = initialExceptionsState;
exports.getExceptionsMap = getExceptionsMap;
exports.hasException = hasException;
exports.getSelectedException = getSelectedException;
exports.default = exports.getSelectedSourceExceptions = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Exceptions reducer
 * @module reducers/exceptionss
 */
function initialExceptionsState() {
  return {
    exceptions: {}
  };
}

function update(state = initialExceptionsState(), action) {
  switch (action.type) {
    case "ADD_EXCEPTION":
      return updateExceptions(state, action);
  }

  return state;
}

function updateExceptions(state, action) {
  const {
    exception
  } = action;
  const sourceActorId = exception.sourceActorId;

  if (state.exceptions[sourceActorId]) {
    const sourceExceptions = state.exceptions[sourceActorId];
    return { ...state,
      exceptions: { ...state.exceptions,
        [sourceActorId]: [...sourceExceptions, exception]
      }
    };
  }

  return { ...state,
    exceptions: { ...state.exceptions,
      [sourceActorId]: [exception]
    }
  };
} // Selectors


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
  const selectedSource = (0, _selectors.getSelectedSource)(state);

  if (!selectedSource) {
    return [];
  }

  return (0, _selectors.getSourceActorsForSource)(state, selectedSource.id);
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

var _default = update;
exports.default = _default;