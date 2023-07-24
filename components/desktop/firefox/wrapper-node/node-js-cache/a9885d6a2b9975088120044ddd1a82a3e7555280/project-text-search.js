"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProjectSearchOperation = getProjectSearchOperation;
exports.getProjectSearchResults = getProjectSearchResults;
exports.getProjectSearchStatus = getProjectSearchStatus;
exports.getProjectSearchQuery = getProjectSearchQuery;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getProjectSearchOperation(state) {
  return state.projectTextSearch.ongoingSearch;
}

function getProjectSearchResults(state) {
  return state.projectTextSearch.results;
}

function getProjectSearchStatus(state) {
  return state.projectTextSearch.status;
}

function getProjectSearchQuery(state) {
  return state.projectTextSearch.query;
}