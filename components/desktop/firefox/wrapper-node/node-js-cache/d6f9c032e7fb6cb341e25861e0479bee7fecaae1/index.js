"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParserDispatcher = void 0;

var _workerUtils = require("devtools/client/shared/worker-utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const WORKER_URL = "resource://devtools/client/debugger/dist/parser-worker.js";

class ParserDispatcher extends _workerUtils.WorkerDispatcher {
  constructor(jestUrl) {
    super(jestUrl || WORKER_URL);

    _defineProperty(this, "findOutOfScopeLocations", this.task("findOutOfScopeLocations"));

    _defineProperty(this, "findBestMatchExpression", this.task("findBestMatchExpression"));

    _defineProperty(this, "getScopes", this.task("getScopes"));

    _defineProperty(this, "getSymbols", this.task("getSymbols"));

    _defineProperty(this, "getFunctionSymbols", this.task("getFunctionSymbols"));

    _defineProperty(this, "getClassSymbols", this.task("getClassSymbols"));

    _defineProperty(this, "getClosestFunctionName", this.task("getClosestFunctionName"));

    _defineProperty(this, "mapExpression", this.task("mapExpression"));

    _defineProperty(this, "clearSources", this.task("clearSources"));
  }

  async setSource(sourceId, content) {
    const astSource = {
      id: sourceId,
      text: content.type === "wasm" ? "" : content.value,
      contentType: content.contentType || null,
      isWasm: content.type === "wasm"
    };
    return this.invoke("setSource", astSource);
  }

  /**
   * Reports if the location's source can be parsed by this worker.
   *
   * @param {Object} location
   *        A debugger frontend location object. See createLocation().
   * @return {Boolean}
   *         True, if the worker may be able to parse this source.
   */
  isLocationSupported(location) {
    // There might be more sources that the worker doesn't support,
    // like original sources which aren't JavaScript.
    // But we can only know with the source's content type,
    // which isn't available right away.
    // These source will be ignored from within the worker.
    return !location.source.isWasm;
  }

}

exports.ParserDispatcher = ParserDispatcher;