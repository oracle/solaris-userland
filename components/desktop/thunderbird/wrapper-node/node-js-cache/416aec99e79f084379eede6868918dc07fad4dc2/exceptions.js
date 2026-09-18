"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialExceptionsState = initialExceptionsState;
exports.default = void 0;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Exceptions reducer
 *
 * @module reducers/exceptionss
 */
function initialExceptionsState() {
  return {
    // Store exception objects created by actions/exceptions.js's addExceptionFromResources()
    // This is keyed by source actor id, and values are arrays of exception objects.
    mutableExceptionsMap: new Map()
  };
}

function update(state = initialExceptionsState(), action) {
  switch (action.type) {
    case "ADD_EXCEPTION":
      return updateExceptions(state, action);

    case "REMOVE_SOURCES":
      {
        return removeExceptionsForSourceActors(state, action.actors);
      }
  }

  return state;
}

function updateExceptions(state, action) {
  const {
    mutableExceptionsMap
  } = state;
  const {
    exception
  } = action;
  const {
    sourceActorId
  } = exception;
  let exceptions = mutableExceptionsMap.get(sourceActorId);

  if (!exceptions) {
    exceptions = [];
    mutableExceptionsMap.set(sourceActorId, exceptions);
  } else if (exceptions.some(({
    lineNumber,
    columnNumber
  }) => {
    return lineNumber == exception.lineNumber && columnNumber == exception.columnNumber;
  })) {
    // Avoid adding duplicated exceptions for the same line/column
    return state;
  } // As these arrays are only used by getSelectedSourceExceptions selector method,
  // which coalesce multiple arrays and always return new array instance,
  // it isn't important to clone these array in case of modification.


  exceptions.push(exception);
  return { ...state
  };
}

function removeExceptionsForSourceActors(state, sourceActors) {
  const {
    mutableExceptionsMap
  } = state;
  const sizeBefore = mutableExceptionsMap.size;

  for (const sourceActor of sourceActors) {
    mutableExceptionsMap.delete(sourceActor.id);
  }

  return mutableExceptionsMap.size != sizeBefore ? { ...state
  } : state;
}

var _default = update;
exports.default = _default;