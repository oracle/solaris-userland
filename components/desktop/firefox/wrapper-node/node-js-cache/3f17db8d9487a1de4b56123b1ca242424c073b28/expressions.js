"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExpression = getExpression;
exports.getAutocompleteMatchset = getAutocompleteMatchset;
exports.default = exports.getExpressionError = exports.getAutocompleteMatches = exports.getExpressions = exports.createExpressionState = void 0;

var _lodash = require("devtools/client/shared/vendor/lodash");

var _reselect = require("devtools/client/shared/vendor/reselect");

loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * Expressions reducer
 * @module reducers/expressions
 */
const createExpressionState = () => ({
  expressions: restoreExpressions(),
  expressionError: false,
  autocompleteMatches: {},
  currentAutocompleteInput: null
});

exports.createExpressionState = createExpressionState;

function update(state = createExpressionState(), action) {
  switch (action.type) {
    case "ADD_EXPRESSION":
      if (action.expressionError) {
        return { ...state,
          expressionError: !!action.expressionError
        };
      }

      return appendExpressionToList(state, {
        input: action.input,
        value: null,
        updating: true
      });

    case "UPDATE_EXPRESSION":
      const key = action.expression.input;
      const newState = updateExpressionInList(state, key, {
        input: action.input,
        value: null,
        updating: true
      });
      return { ...newState,
        expressionError: !!action.expressionError
      };

    case "EVALUATE_EXPRESSION":
      return updateExpressionInList(state, action.input, {
        input: action.input,
        value: action.value,
        updating: false
      });

    case "EVALUATE_EXPRESSIONS":
      const {
        inputs,
        results
      } = action;
      return (0, _lodash.zip)(inputs, results).reduce((_state, [input, result]) => updateExpressionInList(_state, input, {
        input,
        value: result,
        updating: false
      }), state);

    case "DELETE_EXPRESSION":
      return deleteExpression(state, action.input);

    case "CLEAR_EXPRESSION_ERROR":
      return { ...state,
        expressionError: false
      };

    case "AUTOCOMPLETE":
      const {
        matchProp,
        matches
      } = action.result;
      return { ...state,
        currentAutocompleteInput: matchProp,
        autocompleteMatches: { ...state.autocompleteMatches,
          [matchProp]: matches
        }
      };

    case "CLEAR_AUTOCOMPLETE":
      return { ...state,
        autocompleteMatches: {},
        currentAutocompleteInput: ""
      };
  }

  return state;
}

function restoreExpressions() {
  const exprs = _prefs.prefs.expressions;

  if (exprs.length == 0) {
    return [];
  }

  return exprs;
}

function storeExpressions({
  expressions
}) {
  _prefs.prefs.expressions = expressions.map(expression => (0, _lodash.omit)(expression, "value"));
}

function appendExpressionToList(state, value) {
  const newState = { ...state,
    expressions: [...state.expressions, value]
  };
  storeExpressions(newState);
  return newState;
}

function updateExpressionInList(state, key, value) {
  const list = [...state.expressions];
  const index = list.findIndex(e => e.input == key);
  list[index] = value;
  const newState = { ...state,
    expressions: list
  };
  storeExpressions(newState);
  return newState;
}

function deleteExpression(state, input) {
  const list = [...state.expressions];
  const index = list.findIndex(e => e.input == input);
  list.splice(index, 1);
  const newState = { ...state,
    expressions: list
  };
  storeExpressions(newState);
  return newState;
}

const getExpressionsWrapper = state => state.expressions;

const getExpressions = (0, _reselect.createSelector)(getExpressionsWrapper, expressions => expressions.expressions);
exports.getExpressions = getExpressions;
const getAutocompleteMatches = (0, _reselect.createSelector)(getExpressionsWrapper, expressions => expressions.autocompleteMatches);
exports.getAutocompleteMatches = getAutocompleteMatches;

function getExpression(state, input) {
  return getExpressions(state).find(exp => exp.input == input);
}

function getAutocompleteMatchset(state) {
  const input = state.expressions.currentAutocompleteInput;

  if (input) {
    return getAutocompleteMatches(state)[input];
  }
}

const getExpressionError = (0, _reselect.createSelector)(getExpressionsWrapper, expressions => expressions.expressionError);
exports.getExpressionError = getExpressionError;
var _default = update;
exports.default = _default;