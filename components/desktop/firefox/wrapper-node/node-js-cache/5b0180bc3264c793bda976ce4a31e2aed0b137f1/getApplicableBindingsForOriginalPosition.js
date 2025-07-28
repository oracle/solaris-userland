"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.originalRangeStartsInside = originalRangeStartsInside;
exports.getApplicableBindingsForOriginalPosition = getApplicableBindingsForOriginalPosition;
loader.lazyRequireGetter(this, "_positionCmp", "devtools/client/debugger/src/utils/pause/mapScopes/positionCmp");
loader.lazyRequireGetter(this, "_filtering", "devtools/client/debugger/src/utils/pause/mapScopes/filtering");
loader.lazyRequireGetter(this, "_mappingContains", "devtools/client/debugger/src/utils/pause/mapScopes/mappingContains");
loader.lazyRequireGetter(this, "_sourceMaps", "devtools/client/debugger/src/utils/source-maps");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
async function originalRangeStartsInside({
  start,
  end
}, thunkArgs) {
  const endPosition = await (0, _sourceMaps.getGeneratedLocation)(end, thunkArgs);
  const startPosition = await (0, _sourceMaps.getGeneratedLocation)(start, thunkArgs); // If the start and end positions collapse into eachother, it means that
  // the range in the original content didn't _start_ at the start position.
  // Since this likely means that the range doesn't logically apply to this
  // binding location, we skip it.

  return (0, _positionCmp.positionCmp)(startPosition, endPosition) !== 0;
}

async function getApplicableBindingsForOriginalPosition(generatedAstBindings, source, {
  start,
  end
}, bindingType, locationType, thunkArgs) {
  const {
    sourceMapLoader
  } = thunkArgs;
  const ranges = await sourceMapLoader.getGeneratedRanges(start);
  const resultRanges = ranges.map(mapRange => ({
    start: {
      line: mapRange.line,
      column: mapRange.columnStart
    },
    end: {
      line: mapRange.line,
      // SourceMapConsumer's 'lastColumn' is inclusive, so we add 1 to make
      // it exclusive like all other locations.
      column: mapRange.columnEnd + 1
    }
  })); // When searching for imports, we expand the range to up to the next available
  // mapping to allow for import declarations that are composed of multiple
  // variable statements, where the later ones are entirely unmapped.
  // Babel 6 produces imports in this style, e.g.
  //
  // var _mod = require("mod"); // mapped from import statement
  // var _mod2 = interop(_mod); // entirely unmapped

  if (bindingType === "import" && locationType !== "ref") {
    const endPosition = await (0, _sourceMaps.getGeneratedLocation)(end, thunkArgs);
    const startPosition = await (0, _sourceMaps.getGeneratedLocation)(start, thunkArgs);

    for (const range of resultRanges) {
      if ((0, _mappingContains.mappingContains)(range, {
        start: startPosition,
        end: startPosition
      }) && (0, _positionCmp.positionCmp)(range.end, endPosition) < 0) {
        range.end = {
          line: endPosition.line,
          column: endPosition.column
        };
        break;
      }
    }
  }

  return filterApplicableBindings(generatedAstBindings, resultRanges);
}

function filterApplicableBindings(bindings, ranges) {
  const result = [];

  for (const range of ranges) {
    // Any binding overlapping a part of the mapping range.
    const filteredBindings = (0, _filtering.filterSortedArray)(bindings, binding => {
      if ((0, _positionCmp.positionCmp)(binding.loc.end, range.start) <= 0) {
        return -1;
      }

      if ((0, _positionCmp.positionCmp)(binding.loc.start, range.end) >= 0) {
        return 1;
      }

      return 0;
    });
    let firstInRange = true;
    let firstOnLine = true;
    let line = -1;

    for (const binding of filteredBindings) {
      if (binding.loc.start.line === line) {
        firstOnLine = false;
      } else {
        line = binding.loc.start.line;
        firstOnLine = true;
      }

      result.push({
        binding,
        range,
        firstOnLine,
        firstInRange
      });
      firstInRange = false;
    }
  }

  return result;
}