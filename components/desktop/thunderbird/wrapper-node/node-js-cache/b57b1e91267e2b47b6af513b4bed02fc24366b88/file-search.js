"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileSearchQuery = getFileSearchQuery;
exports.getFileSearchModifiers = getFileSearchModifiers;
exports.getFileSearchResults = getFileSearchResults;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function getFileSearchQuery(state) {
  return state.fileSearch.query;
}

function getFileSearchModifiers(state) {
  return state.fileSearch.modifiers;
}

function getFileSearchResults(state) {
  return state.fileSearch.searchResults;
}