"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addExpression = addExpression;
exports.autocomplete = autocomplete;
exports.clearAutocomplete = clearAutocomplete;
exports.updateExpression = updateExpression;
exports.deleteExpression = deleteExpression;
exports.evaluateExpressionsForCurrentContext = evaluateExpressionsForCurrentContext;
exports.evaluateExpressions = evaluateExpressions;
exports.getMappedExpression = getMappedExpression;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/utils/expressions");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Add expression for debugger to watch
 *
 * @param {string} input
 */
function addExpression(input) {
  return async ({
    dispatch,
    getState
  }) => {
    if (!input) {
      return null;
    } // If the expression already exists, only update its evaluation


    let expression = (0, _index.getExpression)(getState(), input);

    if (!expression) {
      // This will only display the expression input,
      // evaluateExpression will update its value.
      dispatch({
        type: "ADD_EXPRESSION",
        input
      });
      expression = (0, _index.getExpression)(getState(), input); // When there is an expression error, we won't store the expression

      if (!expression) {
        return null;
      }
    }

    return dispatch(evaluateExpression(expression));
  };
}

function autocomplete(input, cursor) {
  return async ({
    dispatch,
    getState,
    client
  }) => {
    if (!input) {
      return;
    }

    const thread = (0, _index.getCurrentThread)(getState());
    const selectedFrame = (0, _index.getSelectedFrame)(getState());
    const result = await client.autocomplete(input, cursor, selectedFrame?.id); // Pass both selectedFrame and thread in case selectedFrame is null

    dispatch({
      type: "AUTOCOMPLETE",
      selectedFrame,
      thread,
      input,
      result
    });
  };
}

function clearAutocomplete() {
  return {
    type: "CLEAR_AUTOCOMPLETE"
  };
}

function updateExpression(input, expression) {
  return async ({
    dispatch
  }) => {
    if (!input) {
      return;
    }

    dispatch({
      type: "UPDATE_EXPRESSION",
      expression,
      input
    });
    await dispatch(evaluateExpressionsForCurrentContext());
  };
}
/**
 *
 * @param {object} expression
 * @param {string} expression.input
 */


function deleteExpression(expression) {
  return {
    type: "DELETE_EXPRESSION",
    input: expression.input
  };
}

function evaluateExpressionsForCurrentContext() {
  return async ({
    getState,
    dispatch
  }) => {
    const selectedFrame = (0, _index.getSelectedFrame)(getState());
    await dispatch(evaluateExpressions(selectedFrame));
  };
}
/**
 * Update all the expressions by querying the server for updated values.
 *
 * @param {object} selectedFrame
 *        If defined, will evaluate the expression against this given frame,
 *        otherwise it will use the global scope of the thread.
 */


function evaluateExpressions(selectedFrame) {
  return async function ({
    dispatch,
    getState,
    client
  }) {
    const expressions = (0, _index.getExpressions)(getState());
    const inputs = expressions.map(({
      input
    }) => input); // Fallback to global scope of the current thread when selectedFrame is null

    const thread = selectedFrame?.thread || (0, _index.getCurrentThread)(getState());
    const results = await client.evaluateExpressions(inputs, {
      // We will only have a specific frame when passing a Selected frame context.
      frameId: selectedFrame?.id,
      threadId: thread
    }); // Pass both selectedFrame and thread in case selectedFrame is null

    dispatch({
      type: "EVALUATE_EXPRESSIONS",
      selectedFrame,
      // As `selectedFrame` can be null, pass `thread` to help
      // the reducer know what is the related thread of this action.
      thread,
      inputs,
      results
    });
  };
}

function evaluateExpression(expression) {
  return async function (thunkArgs) {
    let {
      input
    } = expression;

    if (!input) {
      console.warn("Expressions should not be empty");
      return null;
    }

    const {
      dispatch,
      getState,
      client
    } = thunkArgs;
    const thread = (0, _index.getCurrentThread)(getState());
    const selectedFrame = (0, _index.getSelectedFrame)(getState());
    const selectedSource = (0, _index.getSelectedSource)(getState()); // Only map when we are paused and if the currently selected source is original,
    // and the paused location is also original.

    if (selectedFrame && selectedSource && selectedFrame.location.source.isOriginal && selectedSource.isOriginal) {
      const mapResult = await getMappedExpression(input, selectedFrame.thread, thunkArgs);

      if (mapResult) {
        input = mapResult.expression;
      }
    } // Pass both selectedFrame and thread in case selectedFrame is null


    return dispatch({
      type: "EVALUATE_EXPRESSION",
      selectedFrame,
      // When we aren't passing a frame, we have to pass a thread to the pause reducer
      thread: selectedFrame ? null : thread,
      input: expression.input,
      [_promise.PROMISE]: client.evaluate((0, _expressions.wrapExpression)(input), {
        // When evaluating against the global scope (when not paused)
        // frameId will be null here.
        frameId: selectedFrame?.id
      })
    });
  };
}
/**
 * Gets information about original variable names from the source map
 * and replaces all possible generated names.
 */


function getMappedExpression(expression, thread, thunkArgs) {
  const {
    getState,
    parserWorker
  } = thunkArgs;
  const mappings = (0, _index.getSelectedScopeMappings)(getState(), thread);
  const bindings = (0, _index.getSelectedFrameBindings)(getState(), thread); // We bail early if we do not need to map the expression. This is important
  // because mapping an expression can be slow if the parserWorker
  // worker is busy doing other work.
  //
  // 1. there are no mappings - we do not need to map original expressions
  // 2. does not contain `await` - we do not need to map top level awaits
  // 3. does not contain `=` - we do not need to map assignments

  const shouldMapScopes = (0, _index.isMapScopesEnabled)(getState()) && mappings;

  if (!shouldMapScopes && !expression.match(/(await|=)/)) {
    return null;
  }

  return parserWorker.mapExpression(expression, mappings, bindings || [], _prefs.features.mapExpressionBindings && (0, _index.getIsPaused)(getState(), thread), _prefs.features.mapAwaitExpression);
}