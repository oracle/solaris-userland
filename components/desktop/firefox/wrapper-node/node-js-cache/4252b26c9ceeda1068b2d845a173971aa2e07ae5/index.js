"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrettyPrintDispatcher = void 0;

var _workerUtils = require("devtools/client/shared/worker-utils");

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

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

  prettyPrint(options) {
    return _classPrivateFieldGet(this, _prettyPrintTask).call(this, options);
  }

  prettyPrintInlineScript(options) {
    return _classPrivateFieldGet(this, _prettyPrintInlineScriptTask).call(this, options);
  }

  getSourceMap(taskId) {
    return _classPrivateFieldGet(this, _getSourceMapForTask).call(this, taskId);
  }

}

exports.PrettyPrintDispatcher = PrettyPrintDispatcher;

var _prettyPrintTask = new WeakMap();

var _prettyPrintInlineScriptTask = new WeakMap();

var _getSourceMapForTask = new WeakMap();