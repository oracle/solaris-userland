"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildOriginalScopes = buildOriginalScopes;
exports.toggleMapScopes = toggleMapScopes;
exports.mapScopes = mapScopes;
exports.getMappedScopes = getMappedScopes;
exports.getMappedScopesForLocation = getMappedScopesForLocation;
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");

var _assert = _interopRequireDefault(require("../../utils/assert"));

loader.lazyRequireGetter(this, "_log", "devtools/client/debugger/src/utils/log");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_mapScopes", "devtools/client/debugger/src/utils/pause/mapScopes/index");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_sourceMaps", "devtools/client/debugger/src/utils/source-maps");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const expressionRegex = /\bfp\(\)/g;

async function buildOriginalScopes(frame, client, cx, frameId, generatedScopes) {
  if (!frame.originalVariables) {
    throw new TypeError("(frame.originalVariables: XScopeVariables)");
  }

  const originalVariables = frame.originalVariables;
  const frameBase = originalVariables.frameBase || "";
  const inputs = [];

  for (let i = 0; i < originalVariables.vars.length; i++) {
    const {
      expr
    } = originalVariables.vars[i];
    const expression = expr ? expr.replace(expressionRegex, frameBase) : "void 0";
    inputs[i] = expression;
  }

  const results = await client.evaluateExpressions(inputs, {
    frameId,
    thread: cx.thread
  });
  const variables = {};

  for (let i = 0; i < originalVariables.vars.length; i++) {
    const {
      name
    } = originalVariables.vars[i];
    variables[name] = {
      value: results[i].result
    };
  }

  const bindings = {
    arguments: [],
    variables
  };
  const {
    actor
  } = await generatedScopes;
  const scope = {
    type: "function",
    scopeKind: "",
    actor,
    bindings,
    parent: null,
    function: null,
    block: null
  };
  return {
    mappings: {},
    scope
  };
}

function toggleMapScopes() {
  return async function ({
    dispatch,
    getState,
    client,
    sourceMaps
  }) {
    if ((0, _selectors.isMapScopesEnabled)(getState())) {
      return dispatch({
        type: "TOGGLE_MAP_SCOPES",
        mapScopes: false
      });
    }

    dispatch({
      type: "TOGGLE_MAP_SCOPES",
      mapScopes: true
    });
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
    const {
      dispatch,
      client,
      getState
    } = thunkArgs;
    (0, _assert.default)(cx.thread == frame.thread, "Thread mismatch");
    await dispatch({
      type: "MAP_SCOPES",
      cx,
      thread: cx.thread,
      frame,
      [_promise.PROMISE]: async function () {
        if (frame.isOriginal && frame.originalVariables) {
          const frameId = (0, _selectors.getSelectedFrameId)(getState(), cx.thread);
          return buildOriginalScopes(frame, client, cx, frameId, scopes);
        }

        return dispatch(getMappedScopes(cx, scopes, frame));
      }()
    });
  };
}

function getMappedScopes(cx, scopes, frame) {
  return async function (thunkArgs) {
    const {
      getState,
      dispatch
    } = thunkArgs;
    const generatedSource = (0, _selectors.getSource)(getState(), frame.generatedLocation.sourceId);
    const source = (0, _selectors.getSource)(getState(), frame.location.sourceId);

    if (!(0, _selectors.isMapScopesEnabled)(getState()) || !source || !generatedSource || generatedSource.isWasm || source.isPrettyPrinted || (0, _source.isGenerated)(source)) {
      return null;
    }

    await dispatch((0, _loadSourceText.loadSourceText)({
      cx,
      source
    }));

    if ((0, _source.isOriginal)(source)) {
      await dispatch((0, _loadSourceText.loadSourceText)({
        cx,
        source: generatedSource
      }));
    }

    try {
      const content = (0, _selectors.getSource)(getState(), source.id) && (0, _selectors.getSourceContent)(getState(), source.id);
      return await (0, _mapScopes.buildMappedScopes)(source, content && (0, _asyncValue.isFulfilled)(content) ? content.value : {
        type: "text",
        value: "",
        contentType: undefined
      }, frame, (await scopes), thunkArgs);
    } catch (e) {
      (0, _log.log)(e);
      return null;
    }
  };
}

function getMappedScopesForLocation(location) {
  return async function (thunkArgs) {
    const {
      dispatch,
      getState,
      sourceMaps
    } = thunkArgs;
    const cx = (0, _selectors.getThreadContext)(getState());
    const mappedLocation = await (0, _sourceMaps.getMappedLocation)(getState(), sourceMaps, location);
    return dispatch(getMappedScopes(cx, null, mappedLocation));
  };
}