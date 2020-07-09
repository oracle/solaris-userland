"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.previewPausedLocation = previewPausedLocation;
exports.clearPreviewPausedLocation = clearPreviewPausedLocation;
loader.lazyRequireGetter(this, "_sources", "devtools/client/debugger/src/actions/sources/index");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function previewPausedLocation(location) {
  return ({
    dispatch,
    getState
  }) => {
    const cx = (0, _selectors.getContext)(getState());
    const source = (0, _selectors.getSourceByURL)(getState(), location.sourceUrl);

    if (!source) {
      return;
    }

    const sourceLocation = {
      line: location.line,
      column: location.column,
      sourceId: source.id
    };
    dispatch((0, _sources.selectLocation)(cx, sourceLocation));
    dispatch({
      type: "PREVIEW_PAUSED_LOCATION",
      location: sourceLocation
    });
  };
}

function clearPreviewPausedLocation() {
  return {
    type: "CLEAR_PREVIEW_PAUSED_LOCATION"
  };
}