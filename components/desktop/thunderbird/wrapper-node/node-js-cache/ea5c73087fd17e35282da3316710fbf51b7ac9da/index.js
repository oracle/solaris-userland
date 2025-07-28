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

    _defineProperty(this, "getScopes", this.task("getScopes"));

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

}

exports.ParserDispatcher = ParserDispatcher;