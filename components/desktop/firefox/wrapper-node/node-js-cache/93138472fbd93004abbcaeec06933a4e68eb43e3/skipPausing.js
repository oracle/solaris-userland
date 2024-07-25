"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleSkipPausing = toggleSkipPausing;
exports.setSkipPausing = setSkipPausing;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

/**
 * @memberof actions/pause
 * @static
 */
function toggleSkipPausing() {
  return async ({
    dispatch,
    client,
    getState
  }) => {
    const skipPausing = !(0, _index.getSkipPausing)(getState());
    await client.setSkipPausing(skipPausing);
    dispatch({
      type: "TOGGLE_SKIP_PAUSING",
      skipPausing
    });
  };
}
/**
 * @memberof actions/pause
 * @static
 */


function setSkipPausing(skipPausing) {
  return async ({
    dispatch,
    client,
    getState
  }) => {
    const currentlySkipping = (0, _index.getSkipPausing)(getState());

    if (currentlySkipping === skipPausing) {
      return;
    }

    await client.setSkipPausing(skipPausing);
    dispatch({
      type: "TOGGLE_SKIP_PAUSING",
      skipPausing
    });
  };
}