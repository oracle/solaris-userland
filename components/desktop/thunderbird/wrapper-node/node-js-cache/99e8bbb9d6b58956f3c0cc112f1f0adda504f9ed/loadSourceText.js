"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadSourceText = loadSourceText;
exports.loadOriginalSourceText = exports.loadGeneratedSourceText = void 0;
loader.lazyRequireGetter(this, "_promise", "devtools/client/debugger/src/actions/utils/middleware/promise");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/actions/breakpoints/index");
loader.lazyRequireGetter(this, "_prettyPrint", "devtools/client/debugger/src/actions/sources/prettyPrint");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_memoizableAction", "devtools/client/debugger/src/utils/memoizableAction");
loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/utils/editor/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
async function loadGeneratedSource(sourceActor, {
  client
}) {
  // If no source actor can be found then the text for the
  // source cannot be loaded.
  if (!sourceActor) {
    throw new Error("Source actor is null or not defined");
  }

  let response;

  try {
    response = await client.sourceContents(sourceActor);
  } catch (e) {
    throw new Error(`sourceContents failed: ${e}`);
  }

  return {
    text: response.source,
    contentType: response.contentType || "text/javascript"
  };
}

async function loadOriginalSource(source, {
  getState,
  sourceMapLoader,
  prettyPrintWorker
}) {
  if ((0, _source.isPretty)(source)) {
    const generatedSource = (0, _index.getGeneratedSource)(getState(), source);

    if (!generatedSource) {
      throw new Error("Unable to find minified original.");
    }

    const content = (0, _index.getSettledSourceTextContent)(getState(), (0, _location.createLocation)({
      source: generatedSource
    }));
    return (0, _prettyPrint.prettyPrintSourceTextContent)(sourceMapLoader, prettyPrintWorker, generatedSource, content, (0, _index.getSourceActorsForSource)(getState(), generatedSource.id));
  }

  const result = await sourceMapLoader.getOriginalSourceText(source.id);

  if (!result) {
    // The way we currently try to load and select a pending
    // selected location, it is possible that we will try to fetch the
    // original source text right after the source map has been cleared
    // after a navigation event.
    throw new Error("Original source text unavailable");
  }

  return result;
}

async function loadGeneratedSourceTextPromise(sourceActor, thunkArgs) {
  const {
    dispatch,
    getState
  } = thunkArgs;
  const epoch = (0, _index.getSourcesEpoch)(getState());
  await dispatch({
    type: "LOAD_GENERATED_SOURCE_TEXT",
    sourceActor,
    epoch,
    [_promise.PROMISE]: loadGeneratedSource(sourceActor, thunkArgs)
  });
  await onSourceTextContentAvailable(sourceActor.sourceObject, sourceActor, thunkArgs);
}

async function loadOriginalSourceTextPromise(source, thunkArgs) {
  const {
    dispatch,
    getState
  } = thunkArgs;
  const epoch = (0, _index.getSourcesEpoch)(getState());
  await dispatch({
    type: "LOAD_ORIGINAL_SOURCE_TEXT",
    source,
    epoch,
    [_promise.PROMISE]: loadOriginalSource(source, thunkArgs)
  });
  await onSourceTextContentAvailable(source, null, thunkArgs);
}
/**
 * Function called everytime a new original or generated source gets its text content
 * fetched from the server and registered in the reducer.
 *
 * @param {Object} source
 * @param {Object} sourceActor (optional)
 *        If this is a generated source, we expect a precise source actor.
 * @param {Object} thunkArgs
 */


async function onSourceTextContentAvailable(source, sourceActor, {
  dispatch,
  getState,
  parserWorker
}) {
  const location = (0, _location.createLocation)({
    source,
    sourceActor
  });
  const content = (0, _index.getSettledSourceTextContent)(getState(), location);

  if (!content) {
    return;
  }

  const contentValue = (0, _asyncValue.isFulfilled)(content) ? content.value : {
    type: "text",
    value: "",
    contentType: undefined
  }; // Lezer parser uses the sources to map the original frame names

  const editor = (0, _index3.getEditor)();

  if (!editor.isWasm) {
    editor.addSource(source.id, contentValue.value); // The babel parser needs the sources to parse scopes

    parserWorker.setSource(source.id, contentValue);
  } // Update the text in any breakpoints for this source by re-adding them.


  const breakpoints = (0, _index.getBreakpointsForSource)(getState(), source);

  for (const breakpoint of breakpoints) {
    await dispatch((0, _index2.addBreakpoint)(breakpoint.location, breakpoint.options, breakpoint.disabled));
  }
}
/**
 * Loads the source text for the generated source based of the source actor
 * @param {Object} sourceActor
 *                 There can be more than one source actor per source
 *                 so the source actor needs to be specified. This is
 *                 required for generated sources but will be null for
 *                 original/pretty printed sources.
 */


const loadGeneratedSourceText = (0, _memoizableAction.memoizeableAction)("loadGeneratedSourceText", {
  getValue: (sourceActor, {
    getState
  }) => {
    if (!sourceActor) {
      return null;
    }

    const sourceTextContent = (0, _index.getSourceTextContent)(getState(), (0, _location.createLocation)({
      source: sourceActor.sourceObject,
      sourceActor
    }));

    if (!sourceTextContent || sourceTextContent.state === "pending") {
      return sourceTextContent;
    } // This currently swallows source-load-failure since we return fulfilled
    // here when content.state === "rejected". In an ideal world we should
    // propagate that error upward.


    return (0, _asyncValue.fulfilled)(sourceTextContent);
  },
  createKey: (sourceActor, {
    getState
  }) => {
    const epoch = (0, _index.getSourcesEpoch)(getState());
    return `${epoch}:${sourceActor.actor}`;
  },
  action: (sourceActor, thunkArgs) => loadGeneratedSourceTextPromise(sourceActor, thunkArgs)
});
/**
 * Loads the source text for an original source and source actor
 * @param {Object} source
 *                 The original source to load the source text
 */

exports.loadGeneratedSourceText = loadGeneratedSourceText;
const loadOriginalSourceText = (0, _memoizableAction.memoizeableAction)("loadOriginalSourceText", {
  getValue: (source, {
    getState
  }) => {
    if (!source) {
      return null;
    }

    const sourceTextContent = (0, _index.getSourceTextContent)(getState(), (0, _location.createLocation)({
      source
    }));

    if (!sourceTextContent || sourceTextContent.state === "pending") {
      return sourceTextContent;
    } // This currently swallows source-load-failure since we return fulfilled
    // here when content.state === "rejected". In an ideal world we should
    // propagate that error upward.


    return (0, _asyncValue.fulfilled)(sourceTextContent);
  },
  createKey: (source, {
    getState
  }) => {
    const epoch = (0, _index.getSourcesEpoch)(getState());
    return `${epoch}:${source.id}`;
  },
  action: (source, thunkArgs) => loadOriginalSourceTextPromise(source, thunkArgs)
});
exports.loadOriginalSourceText = loadOriginalSourceText;

function loadSourceText(source, sourceActor) {
  return async ({
    dispatch,
    getState
  }) => {
    if (!source) {
      return null;
    }

    if (source.isOriginal) {
      return dispatch(loadOriginalSourceText(source));
    }

    if (!sourceActor) {
      sourceActor = (0, _index.getFirstSourceActorForGeneratedSource)(getState(), source.id);
    }

    return dispatch(loadGeneratedSourceText(sourceActor));
  };
}