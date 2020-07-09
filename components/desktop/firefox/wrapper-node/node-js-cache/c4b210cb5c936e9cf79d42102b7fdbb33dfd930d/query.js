"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterAllIds = filterAllIds;
exports.makeWeakQuery = makeWeakQuery;
exports.makeShallowQuery = makeShallowQuery;
exports.makeStrictQuery = makeStrictQuery;
exports.makeIdQuery = makeIdQuery;
exports.makeLoadQuery = makeLoadQuery;
exports.makeFilterQuery = makeFilterQuery;
exports.makeReduceQuery = makeReduceQuery;
exports.makeReduceAllQuery = makeReduceAllQuery;
loader.lazyRequireGetter(this, "_baseQuery", "devtools/client/debugger/src/utils/resource/base-query");
loader.lazyRequireGetter(this, "_queryCache", "devtools/client/debugger/src/utils/resource/query-cache");
loader.lazyRequireGetter(this, "_memoize", "devtools/client/debugger/src/utils/resource/memoize");
loader.lazyRequireGetter(this, "_compare", "devtools/client/debugger/src/utils/resource/compare");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function filterAllIds(values) {
  return Object.keys(values);
}
/**
 * Create a query function to take a list of IDs and map each Reduceding
 * resource object into a mapped form.
 */


function makeWeakQuery({
  filter,
  map,
  reduce
}) {
  return (0, _baseQuery.makeResourceQuery)({
    cache: _queryCache.queryCacheWeak,
    filter,
    map: (0, _memoize.memoizeResourceShallow)(map),
    reduce,
    resultCompare: _compare.shallowEqual
  });
}
/**
 * Create a query function to take a list of IDs and map each Reduceding
 * resource object into a mapped form.
 */


function makeShallowQuery({
  filter,
  map,
  reduce
}) {
  return (0, _baseQuery.makeResourceQuery)({
    cache: _queryCache.queryCacheShallow,
    filter,
    map: (0, _memoize.memoizeResourceShallow)(map),
    reduce,
    resultCompare: _compare.shallowEqual
  });
}
/**
 * Create a query function to take a list of IDs and map each Reduceding
 * resource object into a mapped form.
 */


function makeStrictQuery({
  filter,
  map,
  reduce
}) {
  return (0, _baseQuery.makeResourceQuery)({
    cache: _queryCache.queryCacheStrict,
    filter,
    map: (0, _memoize.memoizeResourceShallow)(map),
    reduce,
    resultCompare: _compare.shallowEqual
  });
}
/**
 * Create a query function to take a list of IDs and map each Reduceding
 * resource object into a mapped form.
 */


function makeIdQuery(map) {
  return makeWeakQuery({
    filter: (state, ids) => ids,
    map: (r, identity) => map(r, identity),
    reduce: items => items.slice()
  });
}
/**
 * Create a query function to take a list of IDs and map each Reduceding
 * resource object into a mapped form.
 */


function makeLoadQuery(map) {
  return makeWeakQuery({
    filter: (state, ids) => ids,
    map: (r, identity) => map(r, identity),
    reduce: reduceMappedArrayToObject
  });
}
/**
 * Create a query function that accepts an argument and can filter the
 * resource items to a subset before mapping each reduced resource.
 */


function makeFilterQuery(filter, map) {
  return makeWeakQuery({
    filter: (values, args) => {
      const ids = [];

      for (const id of Object.keys(values)) {
        if (filter(values[id], args)) {
          ids.push(id);
        }
      }

      return ids;
    },
    map,
    reduce: reduceMappedArrayToObject
  });
}
/**
 * Create a query function that accepts an argument and can filter the
 * resource items to a subset before mapping each resulting resource.
 */


function makeReduceQuery(map, reduce) {
  return makeShallowQuery({
    filter: filterAllIds,
    map,
    reduce
  });
}
/**
 * Create a query function that accepts an argument and can filter the
 * resource items to a subset before mapping each resulting resource.
 */


function makeReduceAllQuery(map, reduce) {
  return makeStrictQuery({
    filter: filterAllIds,
    map,
    reduce
  });
}

function reduceMappedArrayToObject(items, ids, args) {
  return items.reduce((acc, item, i) => {
    acc[ids[i]] = item;
    return acc;
  }, {});
}