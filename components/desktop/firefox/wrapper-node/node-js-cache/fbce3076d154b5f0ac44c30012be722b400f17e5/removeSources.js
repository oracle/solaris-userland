"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeSources = removeSources;
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function removeSources(sources, actors, {
  resetSelectedLocation = true
} = {}) {
  return async ({
    parserWorker,
    dispatch,
    sourceMapLoader
  }) => {
    // Remove the sources from the reducers first, and most importantly before any async work
    // as we may otherwise remove the source at an unexpected time.
    dispatch({
      type: "REMOVE_SOURCES",
      sources,
      actors,
      resetSelectedLocation
    });
    const sourceIds = sources.map(source => source.id); // Clear the ParserWorker

    parserWorker.clearSources(sourceIds); // Clear the shared editor module from related CodeMirror instances

    const editor = (0, _index.getEditor)();
    editor.clearSources(sourceIds); // Clear the Source Map Loader/Worker from any potential bundle data

    const generatedSourceIds = new Set();

    for (const source of sources) {
      if (source.isOriginal) {
        generatedSourceIds.add(source.generatedSource.id);
      }
    }

    await sourceMapLoader.clearSourceMapForGeneratedSources(Array.from(generatedSourceIds));
  };
}