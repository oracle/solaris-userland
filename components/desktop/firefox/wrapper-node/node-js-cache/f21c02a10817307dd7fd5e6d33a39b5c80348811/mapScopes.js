"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildOriginalScopes = buildOriginalScopes;
exports.toggleMapScopes = toggleMapScopes;
exports.mapScopes = mapScopes;
exports.getMappedScopes = getMappedScopes;
exports.getMappedScopesForLocation = getMappedScopesForLocation;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_loadSourceText", "devtools/client/debugger/src/actions/sources/loadSourceText");
loader.lazyRequireGetter(this, "_context", "devtools/client/debugger/src/utils/context");
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_log", "devtools/client/debugger/src/utils/log");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/utils/pause/mapScopes/index");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_sourceMaps", "devtools/client/debugger/src/utils/source-maps");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const expressionRegex = /\bfp\(\)/g;

async function buildOriginalScopes(selectedFrame, client, generatedScopes) {
  if (!selectedFrame.originalVariables) {
    throw new TypeError("(frame.originalVariables: XScopeVariables)");
  }

  const originalVariables = selectedFrame.originalVariables;
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
    frameId: selectedFrame.id
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
    getState
  }) {
    if ((0, _index.isMapScopesEnabled)(getState())) {
      dispatch({
        type: "TOGGLE_MAP_SCOPES",
        mapScopes: false
      });
      return;
    }

    dispatch({
      type: "TOGGLE_MAP_SCOPES",
      mapScopes: true
    }); // Ignore the call if there is no selected frame (we are not paused?)

    const state = getState();
    const selectedFrame = (0, _index.getSelectedFrame)(state);

    if (!selectedFrame) {
      return;
    }

    if ((0, _index.getOriginalFrameScope)(getState(), selectedFrame)) {
      return;
    } // Also ignore the call if we didn't fetch the scopes for the selected frame


    const scopes = (0, _index.getGeneratedFrameScope)(getState(), selectedFrame);

    if (!scopes) {
      return;
    }

    dispatch(mapScopes(selectedFrame, Promise.resolve(scopes.scope)));
  };
}

function mapScopes(selectedFrame, scopes) {
  return async function (thunkArgs) {
    const {
      getState,
      dispatch,
      client
    } = thunkArgs;
    await dispatch({
      type: "MAP_SCOPES",
      selectedFrame,
      [_promise.PROMISE]: async function () {
        if (selectedFrame.isOriginal && selectedFrame.originalVariables) {
          return buildOriginalScopes(selectedFrame, client, scopes);
        } // getMappedScopes is only specific to the sources where we map the variables
        // in scope and so only need a thread context. Assert that we are on the same thread
        // before retrieving a thread context.


        (0, _context.validateSelectedFrame)(getState(), selectedFrame);
        return dispatch(getMappedScopes(scopes, selectedFrame));
      }()
    });
  };
}
/**
 * Get scopes mapped for a precise location.
 *
 * @param {Promise} scopes
 *        Can be null. Result of Commands.js's client.getFrameScopes
 * @param {Objects locations
 *        Frame object, or custom object with 'location' and 'generatedLocation' attributes.
 */


function getMappedScopes(scopes, locations) {
  return async function (thunkArgs) {
    const {
      getState,
      dispatch
    } = thunkArgs;
    const generatedSource = locations.generatedLocation.source;
    const source = locations.location.source;

    if (!(0, _index.isMapScopesEnabled)(getState()) || !source || !generatedSource || generatedSource.isWasm || source.isPrettyPrinted || !source.isOriginal) {
      return null;
    } // Load source text for the original source


    await dispatch((0, _loadSourceText.loadOriginalSourceText)(source));
    const generatedSourceActor = (0, _index.getFirstSourceActorForGeneratedSource)(getState(), generatedSource.id); // Also load source text for its corresponding generated source

    await dispatch((0, _loadSourceText.loadGeneratedSourceText)(generatedSourceActor));

    try {
      const content = // load original source text content
      (0, _index.getSettledSourceTextContent)(getState(), locations.location);
      return await (0, _index2.buildMappedScopes)(source, content && (0, _asyncValue.isFulfilled)(content) ? content.value : {
        type: "text",
        value: "",
        contentType: undefined
      }, locations, (await scopes), thunkArgs);
    } catch (e) {
      (0, _log.log)(e);
      return null;
    }
  };
}
/**
 * Used to map variables used within conditional and log breakpoints.
 */


function getMappedScopesForLocation(location) {
  return async function (thunkArgs) {
    const {
      dispatch
    } = thunkArgs;
    const mappedLocation = await (0, _sourceMaps.getMappedLocation)(location, thunkArgs);
    return dispatch(getMappedScopes(null, mappedLocation));
  };
}