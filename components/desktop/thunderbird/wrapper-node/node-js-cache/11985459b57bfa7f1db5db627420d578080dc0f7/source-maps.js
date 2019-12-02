"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeneratedLocation = getGeneratedLocation;
exports.getOriginalLocation = getOriginalLocation;
exports.getMappedLocation = getMappedLocation;
exports.mapLocation = mapLocation;
exports.isOriginalSource = isOriginalSource;

var _devtoolsSourceMap = require("devtools/client/shared/source-map/index.js");

var _devtoolsSourceMap2 = _interopRequireDefault(_devtoolsSourceMap);

var _selectors = require("../selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

async function getGeneratedLocation(state, source, location, sourceMaps) {
  if (!(0, _devtoolsSourceMap.isOriginalId)(location.sourceId)) {
    return location;
  }

  const { line, sourceId, column } = await sourceMaps.getGeneratedLocation(location, source);

  const generatedSource = (0, _selectors.getSource)(state, sourceId);
  if (!generatedSource) {
    throw new Error(`Could not find generated source ${sourceId}`);
  }

  return {
    line,
    sourceId,
    column: column === 0 ? undefined : column,
    sourceUrl: generatedSource.url
  };
}

async function getOriginalLocation(generatedLocation, sourceMaps) {
  if ((0, _devtoolsSourceMap.isOriginalId)(generatedLocation.sourceId)) {
    return location;
  }

  return sourceMaps.getOriginalLocation(generatedLocation);
}

async function getMappedLocation(state, sourceMaps, location) {
  const source = (0, _selectors.getSource)(state, location.sourceId);

  if (!source) {
    throw new Error(`no source ${location.sourceId}`);
  }

  if ((0, _devtoolsSourceMap.isOriginalId)(location.sourceId)) {
    const generatedLocation = await getGeneratedLocation(state, source, location, sourceMaps);
    return { location, generatedLocation };
  }

  const generatedLocation = location;
  const originalLocation = await sourceMaps.getOriginalLocation(generatedLocation);

  return { location: originalLocation, generatedLocation };
}

async function mapLocation(state, sourceMaps, location) {
  const source = (0, _selectors.getSource)(state, location.sourceId);

  if (!source) {
    return location;
  }

  if ((0, _devtoolsSourceMap.isOriginalId)(location.sourceId)) {
    return getGeneratedLocation(state, source, location, sourceMaps);
  }

  return sourceMaps.getOriginalLocation(location);
}

function isOriginalSource(source) {
  return source && (0, _devtoolsSourceMap.isOriginalId)(source.id);
}