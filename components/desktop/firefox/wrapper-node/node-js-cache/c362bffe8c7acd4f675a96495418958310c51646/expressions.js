"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExpression = getExpression;
exports.getAutocompleteMatchset = getAutocompleteMatchset;
exports.getExpressions = void 0;

var _reselect = require("devtools/client/shared/vendor/reselect");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const getExpressionsWrapper = state => state.expressions;

const getExpressions = (0, _reselect.createSelector)(getExpressionsWrapper, expressions => expressions.expressions);
exports.getExpressions = getExpressions;
const getAutocompleteMatches = (0, _reselect.createSelector)(getExpressionsWrapper, expressions => expressions.autocompleteMatches);

function getExpression(state, input) {
  return getExpressions(state).find(exp => exp.input == input);
}

function getAutocompleteMatchset(state) {
  const input = state.expressions.currentAutocompleteInput;

  if (!input) {
    return null;
  }

  return getAutocompleteMatches(state)[input];
}