"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromServerLocation = fromServerLocation;
exports.toServerLocation = toServerLocation;
exports.createFrame = createFrame;
exports.createLoadedObject = createLoadedObject;
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function fromServerLocation(serverLocation) {
  if (serverLocation) {
    return {
      sourceId: serverLocation.scriptId,
      line: serverLocation.lineNumber + 1,
      column: serverLocation.columnNumber,
      sourceUrl: ""
    };
  }
}

function toServerLocation(location) {
  return {
    scriptId: location.sourceId,
    lineNumber: location.line - 1
  };
}

function createFrame(frame) {
  const location = fromServerLocation(frame.location);
  if (!location) {
    return null;
  }

  return {
    id: frame.callFrameId,
    displayName: frame.functionName,
    scopeChain: frame.scopeChain,
    generatedLocation: location,
    location
  };
}

function createLoadedObject(serverObject, parentId) {
  const { value, name } = serverObject;

  return {
    objectId: value.objectId,
    parentId,
    name,
    value
  };
}