"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapExpression = wrapExpression;
exports.getValue = getValue;
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

function getValue(expression) {
  const {
    value,
    exception,
    error
  } = expression;

  if (error) {
    return error;
  }

  if (!value) {
    return UNAVAILABLE_GRIP;
  }

  if (exception) {
    if (isUnavailable(exception)) {
      return UNAVAILABLE_GRIP;
    }

    return exception;
  }

  const valueGrip = (0, _evaluationResult.getGrip)(value.result);

  if (valueGrip && typeof valueGrip === "object" && valueGrip.isError) {
    if (isUnavailable(valueGrip)) {
      return UNAVAILABLE_GRIP;
    }

    const {
      name,
      message
    } = valueGrip.preview;
    return `${name}: ${message}`;
  }

  return valueGrip;
}