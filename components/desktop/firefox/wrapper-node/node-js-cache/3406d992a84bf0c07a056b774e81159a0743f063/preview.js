"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialPreviewState = initialPreviewState;
exports.default = void 0;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function initialPreviewState() {
  return {
    preview: null,
    previewCount: 0
  };
}

function update(state = initialPreviewState(), action) {
  switch (action.type) {
    case "CLEAR_PREVIEW":
      {
        return { ...state,
          preview: null
        };
      }

    case "START_PREVIEW":
      {
        return { ...state,
          previewCount: state.previewCount + 1
        };
      }

    case "SET_PREVIEW":
      {
        return { ...state,
          preview: action.value
        };
      }
  }

  return state;
}

var _default = update;
exports.default = _default;