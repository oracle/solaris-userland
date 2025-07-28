"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Thread = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _index = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");

var _AccessibleImage = _interopRequireDefault(require("../shared/AccessibleImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

class Thread extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onSelectThread", () => {
      this.props.selectThread(this.props.thread.actor);
    });
  }

  static get propTypes() {
    return {
      currentThread: _reactPropTypes.default.string.isRequired,
      isPaused: _reactPropTypes.default.bool.isRequired,
      selectThread: _reactPropTypes.default.func.isRequired,
      thread: _reactPropTypes.default.object.isRequired
    };
  }

  render() {
    const {
      currentThread,
      isPaused,
      thread
    } = this.props;
    const {
      targetType
    } = thread;
    let iconClassname;

    if (targetType.includes("worker")) {
      iconClassname = "worker";
    } else if (targetType.includes("content_script")) {
      iconClassname = "extension";
    } else {
      iconClassname = "window";
    }

    let label = thread.name;

    if (thread.serviceWorkerStatus) {
      label += ` (${thread.serviceWorkerStatus})`;
    }

    return (0, _reactDomFactories.div)({
      className: classnames("thread", {
        selected: thread.actor == currentThread,
        paused: isPaused
      }),
      key: thread.actor,
      onClick: this.onSelectThread
    }, (0, _reactDomFactories.div)({
      className: "icon"
    }, _react.default.createElement(_AccessibleImage.default, {
      className: iconClassname
    })), (0, _reactDomFactories.div)({
      className: "label"
    }, label), isPaused ? (0, _reactDomFactories.span)({
      className: "pause-badge",
      role: "status"
    }, L10N.getStr("pausedThread")) : null);
  }

}

exports.Thread = Thread;

const mapStateToProps = (state, props) => ({
  currentThread: (0, _index2.getCurrentThread)(state),
  isPaused: (0, _index2.getIsPaused)(state, props.thread.actor)
});

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  selectThread: _index.default.selectThread
})(Thread);

exports.default = _default;