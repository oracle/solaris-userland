"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleMapScopes = toggleMapScopes;
exports.mapScopes = mapScopes;

var _selectors = require("../../selectors/index");

var _loadSourceText = require("../sources/loadSourceText");

var _promise = require("../utils/middleware/promise");

var _assert = require("../../utils/assert");

var _assert2 = _interopRequireDefault(_assert);

var _log = require("../../utils/log");

var _source = require("../../utils/source");

var _mapScopes = require("../../utils/pause/mapScopes/index");

var _asyncValue = require("../../utils/async-value");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function toggleMapScopes() {
  return async function ({ dispatch, getState, client, sourceMaps }) {
    if ((0, _selectors.isMapScopesEnabled)(getState())) {
      return dispatch({ type: "TOGGLE_MAP_SCOPES", mapScopes: false });
    }

    dispatch({ type: "TOGGLE_MAP_SCOPES", mapScopes: true });

    const cx = (0, _selectors.getThreadContext)(getState());

    if ((0, _selectors.getSelectedOriginalScope)(getState(), cx.thread)) {
      return;
    }

    const scopes = (0, _selectors.getSelectedGeneratedScope)(getState(), cx.thread);
    const frame = (0, _selectors.getSelectedFrame)(getState(), cx.thread);
    if (!scopes || !frame) {
      return;
    }

    dispatch(mapScopes(cx, Promise.resolve(scopes.scope), frame));
  };
}

function mapScopes(cx, scopes, frame) {
  return async function (thunkArgs) {
    const { dispatch, getState } = thunkArgs;
    (0, _assert2.default)(cx.thread == frame.thread, "Thread mismatch");

    const generatedSource = (0, _selectors.getSource)(getState(), frame.generatedLocation.sourceId);

    const source = (0, _selectors.getSource)(getState(), frame.location.sourceId);

    await dispatch({
      type: "MAP_SCOPES",
      cx,
      thread: cx.thread,
      frame,
      [_promise.PROMISE]: async function () {
        if (!(0, _selectors.isMapScopesEnabled)(getState()) || !source || !generatedSource || generatedSource.isWasm || source.isPrettyPrinted || (0, _source.isGenerated)(source)) {
          return null;
        }

        await dispatch((0, _loadSourceText.loadSourceText)({ cx, source }));
        if ((0, _source.isOriginal)(source)) {
          await dispatch((0, _loadSourceText.loadSourceText)({ cx, source: generatedSource }));
        }

        try {
          const content = (0, _selectors.getSource)(getState(), source.id) && (0, _selectors.getSourceContent)(getState(), source.id);

          return await (0, _mapScopes.buildMappedScopes)(source, content && (0, _asyncValue.isFulfilled)(content) ? content.value : { type: "text", value: "", contentType: undefined }, frame, (await scopes), thunkArgs);
        } catch (e) {
          (0, _log.log)(e);
          return null;
        }
      }()
    });
  };
}