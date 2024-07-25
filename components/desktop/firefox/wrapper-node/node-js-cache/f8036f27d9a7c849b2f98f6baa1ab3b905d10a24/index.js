"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Frames = exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _Frame = _interopRequireDefault(require("./Frame"));

var _Group = _interopRequireDefault(require("./Group"));

var _index = _interopRequireDefault(require("../../../actions/index"));

loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/utils/pause/frames/index");
loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const NUM_FRAMES_SHOWN = 7;

class Frames extends _react.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "toggleFramesDisplay", () => {
      this.setState(prevState => ({
        showAllFrames: !prevState.showAllFrames
      }));
    });

    this.state = {
      showAllFrames: !!props.disableFrameTruncate
    };
  }

  static get propTypes() {
    return {
      disableContextMenu: _reactPropTypes.default.bool.isRequired,
      disableFrameTruncate: _reactPropTypes.default.bool.isRequired,
      displayFullUrl: _reactPropTypes.default.bool.isRequired,
      frames: _reactPropTypes.default.array.isRequired,
      frameworkGroupingOn: _reactPropTypes.default.bool.isRequired,
      getFrameTitle: _reactPropTypes.default.func,
      panel: _reactPropTypes.default.oneOf(["debugger", "webconsole"]).isRequired,
      selectFrame: _reactPropTypes.default.func.isRequired,
      selectLocation: _reactPropTypes.default.func,
      selectedFrame: _reactPropTypes.default.object,
      showFrameContextMenu: _reactPropTypes.default.func,
      shouldDisplayOriginalLocation: _reactPropTypes.default.bool
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      frames,
      selectedFrame,
      frameworkGroupingOn,
      shouldDisplayOriginalLocation
    } = this.props;
    const {
      showAllFrames
    } = this.state;
    return frames !== nextProps.frames || selectedFrame !== nextProps.selectedFrame || showAllFrames !== nextState.showAllFrames || frameworkGroupingOn !== nextProps.frameworkGroupingOn || shouldDisplayOriginalLocation !== nextProps.shouldDisplayOriginalLocation;
  }

  collapseFrames(frames) {
    const {
      frameworkGroupingOn
    } = this.props;

    if (!frameworkGroupingOn) {
      return frames;
    }

    return (0, _index2.collapseFrames)(frames);
  }

  truncateFrames(frames) {
    const numFramesToShow = this.state.showAllFrames ? frames.length : NUM_FRAMES_SHOWN;
    return frames.slice(0, numFramesToShow);
  }

  renderFrames(frames) {
    const {
      selectFrame,
      selectLocation,
      selectedFrame,
      displayFullUrl,
      getFrameTitle,
      disableContextMenu,
      panel,
      shouldDisplayOriginalLocation,
      showFrameContextMenu
    } = this.props;
    const framesOrGroups = this.truncateFrames(this.collapseFrames(frames)); // We're not using a <ul> because it adds new lines before and after when
    // the user copies the trace. Needed for the console which has several
    // places where we don't want to have those new lines.

    return _react.default.createElement("div", {
      role: "list"
    }, framesOrGroups.map(frameOrGroup => frameOrGroup.id ? _react.default.createElement(_Frame.default, {
      frame: frameOrGroup,
      showFrameContextMenu,
      selectFrame,
      selectLocation,
      selectedFrame,
      shouldDisplayOriginalLocation,
      key: String(frameOrGroup.id),
      displayFullUrl,
      getFrameTitle,
      disableContextMenu,
      panel
    }) : _react.default.createElement(_Group.default, {
      group: frameOrGroup,
      showFrameContextMenu,
      selectFrame,
      selectLocation,
      selectedFrame,
      key: frameOrGroup[0].id,
      displayFullUrl,
      getFrameTitle,
      disableContextMenu,
      panel
    })));
  }

  renderToggleButton(frames) {
    const {
      l10n
    } = this.context;
    const buttonMessage = this.state.showAllFrames ? l10n.getStr("callStack.collapse") : l10n.getStr("callStack.expand");
    frames = this.collapseFrames(frames);

    if (frames.length <= NUM_FRAMES_SHOWN) {
      return null;
    }

    return _react.default.createElement("div", {
      className: "show-more-container"
    }, _react.default.createElement("button", {
      className: "show-more",
      onClick: this.toggleFramesDisplay
    }, buttonMessage));
  }

  render() {
    const {
      frames,
      disableFrameTruncate
    } = this.props;

    if (!frames) {
      return _react.default.createElement("div", {
        className: "pane frames"
      }, _react.default.createElement("div", {
        className: "pane-info empty"
      }, L10N.getStr("callStack.notPaused")));
    }

    return _react.default.createElement("div", {
      className: "pane frames"
    }, this.renderFrames(frames), disableFrameTruncate ? null : this.renderToggleButton(frames));
  }

}

exports.Frames = Frames;
Frames.contextTypes = {
  l10n: _reactPropTypes.default.object
};

const mapStateToProps = state => ({
  frames: (0, _index3.getCurrentThreadFrames)(state),
  frameworkGroupingOn: (0, _index3.getFrameworkGroupingState)(state),
  selectedFrame: (0, _index3.getSelectedFrame)(state, (0, _index3.getCurrentThread)(state)),
  shouldDisplayOriginalLocation: (0, _index3.getShouldSelectOriginalLocation)(state),
  disableFrameTruncate: false,
  disableContextMenu: false,
  displayFullUrl: false
});

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  selectFrame: _index.default.selectFrame,
  selectLocation: _index.default.selectLocation,
  showFrameContextMenu: _index.default.showFrameContextMenu
})(Frames); // Export the non-connected component in order to use it outside of the debugger
// panel (e.g. console, netmonitor, …).


exports.default = _default;