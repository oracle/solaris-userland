"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertSourceActor = insertSourceActor;
exports.insertSourceActors = insertSourceActors;
exports.removeSourceActor = removeSourceActor;
exports.removeSourceActors = removeSourceActors;
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function insertSourceActor(item) {
  return insertSourceActors([item]);
}
function insertSourceActors(items) {
  return function ({ dispatch }) {
    dispatch({
      type: "INSERT_SOURCE_ACTORS",
      items
    });
  };
}

function removeSourceActor(item) {
  return removeSourceActors([item]);
}
function removeSourceActors(items) {
  return function ({ dispatch }) {
    dispatch({
      type: "REMOVE_SOURCE_ACTORS",
      items
    });
  };
}