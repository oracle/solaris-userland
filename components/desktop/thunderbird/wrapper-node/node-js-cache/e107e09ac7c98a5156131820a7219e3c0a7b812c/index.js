"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrettyPrintDispatcher = void 0;

var _string = require("devtools/shared/string");

var _workerUtils = require("devtools/client/shared/worker-utils");

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

const MAX_SCRIPT_LOG_LENGTH = 500;
const WORKER_URL = "resource://devtools/client/debugger/dist/pretty-print-worker.js";

class PrettyPrintDispatcher extends _workerUtils.WorkerDispatcher {
  constructor(jestUrl) {
    super(jestUrl || WORKER_URL);

    _prettyPrintTask.set(this, {
      writable: true,
      value: this.task("prettyPrint")
    });

    _prettyPrintInlineScriptTask.set(this, {
      writable: true,
      value: this.task("prettyPrintInlineScript")
    });

    _getSourceMapForTask.set(this, {
      writable: true,
      value: this.task("getSourceMapForTask")
    });
  }

  async prettyPrint(options) {
    try {
      return await _classPrivateFieldGet(this, _prettyPrintTask).call(this, options);
    } catch (e) {
      console.error(`[pretty-print] Failed to pretty print script (${options.url}):\n`, (0, _string.truncateString)(options.sourceText, MAX_SCRIPT_LOG_LENGTH));
      throw e;
    }
  }

  async prettyPrintInlineScript(options) {
    try {
      return await _classPrivateFieldGet(this, _prettyPrintInlineScriptTask).call(this, options);
    } catch (e) {
      console.error(`[pretty-print] Failed to pretty print inline script (${options.url}):\n`, (0, _string.truncateString)(options.sourceText, MAX_SCRIPT_LOG_LENGTH));
      throw e;
    }
  }

  getSourceMap(taskId) {
    return _classPrivateFieldGet(this, _getSourceMapForTask).call(this, taskId);
  }

}

exports.PrettyPrintDispatcher = PrettyPrintDispatcher;

var _prettyPrintTask = new WeakMap();

var _prettyPrintInlineScriptTask = new WeakMap();

var _getSourceMapForTask = new WeakMap();