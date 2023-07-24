"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchDispatcher = void 0;

var _workerUtils = require("devtools/client/shared/worker-utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const WORKER_URL = "resource://devtools/client/debugger/dist/search-worker.js";

class SearchDispatcher extends _workerUtils.WorkerDispatcher {
  constructor(jestUrl) {
    super(jestUrl || WORKER_URL);

    _defineProperty(this, "getMatches", this.task("getMatches"));

    _defineProperty(this, "findSourceMatches", this.task("findSourceMatches"));
  }

}

exports.SearchDispatcher = SearchDispatcher;