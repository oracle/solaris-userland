"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapExpression = wrapExpression;
exports.getExpressionResultGripAndFront = getExpressionResultGripAndFront;
loader.lazyRequireGetter(this, "_indentation", "devtools/client/debugger/src/utils/indentation");
loader.lazyRequireGetter(this, "_evaluationResult", "devtools/client/debugger/src/utils/evaluation-result");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const UNAVAILABLE_GRIP = {
  unavailable: true
};
/*
 * wrap the expression input in a try/catch so that it can be safely
 * evaluated.
 *
 * NOTE: we add line after the expression to protect against comments.
 */

function wrapExpression(input) {
  return (0, _indentation.correctIndentation)(`
    try {
      ${input}
    } catch (e) {
      e
    }
  `);
}

function isUnavailable(value) {
  return value && !!value.isError && (value.class === "ReferenceError" || value.class === "TypeError");
}
/**
 *
 * @param {Object} expression: Expression item as stored in state.expressions in reducers/expressions.js
 * @param {String} expression.input: evaluated expression string
 * @param {Object} expression.value: evaluated expression result object as returned from ScriptCommand#execute
 * @param {Object} expression.value.result: expression result, might be a primitive, a grip or a front
 * @param {Object} expression.value.exception: expression result error, might be a primitive, a grip or a front
 * @returns {Object} an object of the following shape:
 *                   - expressionResultGrip: A primitive or a grip
 *                   - expressionResultFront: An object front if it exists, or undefined
 */


function getExpressionResultGripAndFront(expression) {
  const {
    value
  } = expression;

  if (!value) {
    return {
      expressionResultGrip: UNAVAILABLE_GRIP
    };
  }

  const expressionResultReturn = value.exception || value.result;
  const valueGrip = (0, _evaluationResult.getGrip)(expressionResultReturn);

  if (valueGrip == null || isUnavailable(valueGrip)) {
    return {
      expressionResultGrip: UNAVAILABLE_GRIP
    };
  }

  if (valueGrip.isError) {
    const {
      name,
      message
    } = valueGrip.preview;
    return {
      expressionResultGrip: `${name}: ${message}`
    };
  }

  return {
    expressionResultGrip: valueGrip,
    expressionResultFront: (0, _evaluationResult.getFront)(expressionResultReturn)
  };
}