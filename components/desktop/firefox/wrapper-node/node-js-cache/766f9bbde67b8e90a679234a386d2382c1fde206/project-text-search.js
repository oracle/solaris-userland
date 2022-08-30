"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTextSearchOperation = getTextSearchOperation;
exports.getTextSearchResults = getTextSearchResults;
exports.getTextSearchStatus = getTextSearchStatus;
exports.getTextSearchQuery = getTextSearchQuery;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getTextSearchOperation(state) {
  return state.projectTextSearch.ongoingSearch;
}

function getTextSearchResults(state) {
  return state.projectTextSearch.results;
}

function getTextSearchStatus(state) {
  return state.projectTextSearch.status;
}

function getTextSearchQuery(state) {
  return state.projectTextSearch.query;
}