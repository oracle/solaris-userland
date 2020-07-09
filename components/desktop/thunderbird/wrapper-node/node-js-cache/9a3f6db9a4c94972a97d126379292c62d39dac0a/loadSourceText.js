"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadSourceById = loadSourceById;
exports.loadSourceText = void 0;
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_breakpoints", "devtools/client/debugger/src/actions/breakpoints/index");
loader.lazyRequireGetter(this, "_prettyPrint", "devtools/client/debugger/src/actions/sources/prettyPrint");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_memoizableAction", "devtools/client/debugger/src/utils/memoizableAction");

var _telemetry = _interopRequireDefault(require("devtools/client/shared/telemetry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// Measures the time it takes for a source to load
const loadSourceHistogram = "DEVTOOLS_DEBUGGER_LOAD_SOURCE_MS";
const telemetry = new _telemetry.default();

async function loadSource(state, source, {
  sourceMaps,
  client,
  getState
}) {
  if ((0, _source.isPretty)(source) && (0, _source.isOriginal)(source)) {
    const generatedSource = (0, _selectors.getGeneratedSource)(state, source);

    if (!generatedSource) {
      throw new Error("Unable to find minified original.");
    }

    const content = (0, _selectors.getSourceContent)(state, generatedSource.id);

    if (!content || !(0, _asyncValue.isFulfilled)(content)) {
      throw new Error("Cannot pretty-print a file that has not loaded");
    }

    return (0, _prettyPrint.prettyPrintSource)(sourceMaps, generatedSource, content.value, (0, _selectors.getSourceActorsForSource)(state, generatedSource.id));
  }

  if ((0, _source.isOriginal)(source)) {
    const result = await sourceMaps.getOriginalSourceText(source.id);

    if (!result) {
      // The way we currently try to load and select a pending
      // selected location, it is possible that we will try to fetch the
      // original source text right after the source map has been cleared
      // after a navigation event.
      throw new Error("Original source text unavailable");
    }

    return result;
  } // We only need the source text from one actor, but messages sent to retrieve
  // the source might fail if the actor has or is about to shut down. Keep
  // trying with different actors until one request succeeds.


  let response;
  const handledActors = new Set();

  while (true) {
    const actors = (0, _selectors.getSourceActorsForSource)(state, source.id);
    const actor = actors.find(({
      actor: a
    }) => !handledActors.has(a));

    if (!actor) {
      throw new Error("Unknown source");
    }

    handledActors.add(actor.actor);

    try {
      telemetry.start(loadSourceHistogram, source);
      response = await client.sourceContents(actor);
      telemetry.finish(loadSourceHistogram, source);
      break;
    } catch (e) {
      console.warn(`sourceContents failed: ${e}`);
    }
  }

  return {
    text: response.source,
    contentType: response.contentType || "text/javascript"
  };
}

async function loadSourceTextPromise(cx, source, {
  dispatch,
  getState,
  client,
  sourceMaps,
  parser
}) {
  const epoch = (0, _selectors.getSourcesEpoch)(getState());
  await dispatch({
    type: "LOAD_SOURCE_TEXT",
    sourceId: source.id,
    epoch,
    [_promise.PROMISE]: loadSource(getState(), source, {
      sourceMaps,
      client,
      getState
    })
  });
  const newSource = (0, _selectors.getSource)(getState(), source.id);

  if (!newSource) {
    return;
  }

  const content = (0, _selectors.getSourceContent)(getState(), newSource.id);

  if (!newSource.isWasm && content) {
    parser.setSource(newSource.id, (0, _asyncValue.isFulfilled)(content) ? content.value : {
      type: "text",
      value: "",
      contentType: undefined
    }); // Update the text in any breakpoints for this source by re-adding them.

    const breakpoints = (0, _selectors.getBreakpointsForSource)(getState(), source.id);

    for (const {
      location,
      options,
      disabled
    } of breakpoints) {
      await dispatch((0, _breakpoints.addBreakpoint)(cx, location, options, disabled));
    }
  }
}

function loadSourceById(cx, sourceId) {
  return ({
    getState,
    dispatch
  }) => {
    const source = (0, _selectors.getSourceFromId)(getState(), sourceId);
    return dispatch(loadSourceText({
      cx,
      source
    }));
  };
}

const loadSourceText = (0, _memoizableAction.memoizeableAction)("loadSourceText", {
  getValue: ({
    source
  }, {
    getState
  }) => {
    source = source ? (0, _selectors.getSource)(getState(), source.id) : null;

    if (!source) {
      return null;
    }

    const {
      content
    } = (0, _selectors.getSourceWithContent)(getState(), source.id);

    if (!content || content.state === "pending") {
      return content;
    } // This currently swallows source-load-failure since we return fulfilled
    // here when content.state === "rejected". In an ideal world we should
    // propagate that error upward.


    return (0, _asyncValue.fulfilled)(source);
  },
  createKey: ({
    source
  }, {
    getState
  }) => {
    const epoch = (0, _selectors.getSourcesEpoch)(getState());
    return `${epoch}:${source.id}`;
  },
  action: ({
    cx,
    source
  }, thunkArgs) => loadSourceTextPromise(cx, source, thunkArgs)
});
exports.loadSourceText = loadSourceText;