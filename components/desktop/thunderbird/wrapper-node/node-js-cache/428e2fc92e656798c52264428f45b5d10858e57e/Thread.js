"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Thread = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _actions = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_threads", "devtools/client/debugger/src/utils/threads");

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Thread extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onSelectThread", () => {
      const {
        thread
      } = this.props;
      this.props.selectThread(this.props.cx, thread.actor);
    });
  }

  render() {
    const {
      currentThread,
      isPaused,
      thread
    } = this.props;
    const worker = (0, _threads.isWorker)(thread);
    let label = thread.name;

    if (thread.serviceWorkerStatus) {
      label += ` (${thread.serviceWorkerStatus})`;
    }

    return _react.default.createElement("div", {
      className: (0, _classnames.default)("thread", {
        selected: thread.actor == currentThread
      }),
      key: thread.actor,
      onClick: this.onSelectThread
    }, _react.default.createElement("div", {
      className: "icon"
    }, _react.default.createElement(_AccessibleImage.default, {
      className: worker ? "worker" : "window"
    })), _react.default.createElement("div", {
      className: "label"
    }, label), isPaused ? _react.default.createElement("div", {
      className: "pause-badge"
    }, _react.default.createElement(_AccessibleImage.default, {
      className: "pause"
    })) : null);
  }

}

exports.Thread = Thread;

const mapStateToProps = (state, props) => ({
  cx: (0, _selectors.getContext)(state),
  currentThread: (0, _selectors.getCurrentThread)(state),
  isPaused: (0, _selectors.getIsPaused)(state, props.thread.actor)
});

var _default = (0, _connect.connect)(mapStateToProps, {
  selectThread: _actions.default.selectThread
})(Thread);

exports.default = _default;