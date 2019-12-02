"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialPreviewState = initialPreviewState;
exports.getPreview = getPreview;
function initialPreviewState() {
  return {
    preview: null
  };
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function update(state = initialPreviewState(), action) {
  switch (action.type) {
    case "CLEAR_PREVIEW":
      {
        return { ...state, preview: null };
      }

    case "SET_PREVIEW":
      {
        return { ...state, preview: action.value };
      }
  }

  return state;
}

// NOTE: we'd like to have the app state fully typed
// https://github.com/firefox-devtools/debugger/blob/master/src/reducers/sources.js#L179-L185
function getPreview(state) {
  return state.preview.preview;
}

exports.default = update;