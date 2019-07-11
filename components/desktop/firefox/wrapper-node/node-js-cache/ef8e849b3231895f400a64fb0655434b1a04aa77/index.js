"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Frames = undefined;

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../../../utils/connect");

var _propTypes = require("devtools/client/shared/vendor/react-prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Frame = require("./Frame");

var _Frame2 = _interopRequireDefault(_Frame);

var _Group = require("./Group");

var _Group2 = _interopRequireDefault(_Group);

var _actions = require("../../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _frames = require("../../../utils/pause/frames/index");

var _clipboard = require("../../../utils/clipboard");

var _selectors = require("../../../selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NUM_FRAMES_SHOWN = 7; /* This Source Code Form is subject to the terms of the Mozilla Public
                             * License, v. 2.0. If a copy of the MPL was not distributed with this
                             * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

class Frames extends _react.Component {

  constructor(props) {
    super(props);

    this.toggleFramesDisplay = () => {
      this.setState(prevState => ({
        showAllFrames: !prevState.showAllFrames
      }));
    };

    this.copyStackTrace = () => {
      const { frames } = this.props;
      const { l10n } = this.context;
      const framesToCopy = frames.map(f => (0, _frames.formatCopyName)(f, l10n)).join("\n");
      (0, _clipboard.copyToTheClipboard)(framesToCopy);
    };

    this.toggleFrameworkGrouping = () => {
      const { toggleFrameworkGrouping, frameworkGroupingOn } = this.props;
      toggleFrameworkGrouping(!frameworkGroupingOn);
    };

    this.state = {
      showAllFrames: !!props.disableFrameTruncate
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { frames, selectedFrame, frameworkGroupingOn } = this.props;
    const { showAllFrames } = this.state;
    return frames !== nextProps.frames || selectedFrame !== nextProps.selectedFrame || showAllFrames !== nextState.showAllFrames || frameworkGroupingOn !== nextProps.frameworkGroupingOn;
  }

  collapseFrames(frames) {
    const { frameworkGroupingOn } = this.props;
    if (!frameworkGroupingOn) {
      return frames;
    }

    return (0, _frames.collapseFrames)(frames);
  }

  truncateFrames(frames) {
    const numFramesToShow = this.state.showAllFrames ? frames.length : NUM_FRAMES_SHOWN;

    return frames.slice(0, numFramesToShow);
  }

  renderFrames(frames) {
    const {
      cx,
      selectFrame,
      selectedFrame,
      toggleBlackBox,
      frameworkGroupingOn,
      displayFullUrl,
      getFrameTitle,
      disableContextMenu,
      selectable = false
    } = this.props;

    const framesOrGroups = this.truncateFrames(this.collapseFrames(frames));


    // We're not using a <ul> because it adds new lines before and after when
    // the user copies the trace. Needed for the console which has several
    // places where we don't want to have those new lines.
    return _react2.default.createElement(
      "div",
      { role: "list" },
      framesOrGroups.map(frameOrGroup => frameOrGroup.id ? _react2.default.createElement(_Frame2.default, {
        cx: cx,
        frame: frameOrGroup,
        toggleFrameworkGrouping: this.toggleFrameworkGrouping,
        copyStackTrace: this.copyStackTrace,
        frameworkGroupingOn: frameworkGroupingOn,
        selectFrame: selectFrame,
        selectedFrame: selectedFrame,
        toggleBlackBox: toggleBlackBox,
        key: String(frameOrGroup.id),
        displayFullUrl: displayFullUrl,
        getFrameTitle: getFrameTitle,
        disableContextMenu: disableContextMenu,
        selectable: selectable
      }) : _react2.default.createElement(_Group2.default, {
        cx: cx,
        group: frameOrGroup,
        toggleFrameworkGrouping: this.toggleFrameworkGrouping,
        copyStackTrace: this.copyStackTrace,
        frameworkGroupingOn: frameworkGroupingOn,
        selectFrame: selectFrame,
        selectedFrame: selectedFrame,
        toggleBlackBox: toggleBlackBox,
        key: frameOrGroup[0].id,
        displayFullUrl: displayFullUrl,
        getFrameTitle: getFrameTitle,
        disableContextMenu: disableContextMenu,
        selectable: selectable
      }))
    );
  }

  renderToggleButton(frames) {
    const { l10n } = this.context;
    const buttonMessage = this.state.showAllFrames ? l10n.getStr("callStack.collapse") : l10n.getStr("callStack.expand");

    frames = this.collapseFrames(frames);
    if (frames.length <= NUM_FRAMES_SHOWN) {
      return null;
    }

    return _react2.default.createElement(
      "div",
      { className: "show-more-container" },
      _react2.default.createElement(
        "button",
        { className: "show-more", onClick: this.toggleFramesDisplay },
        buttonMessage
      )
    );
  }

  render() {
    const { frames, disableFrameTruncate } = this.props;

    if (!frames) {
      return _react2.default.createElement(
        "div",
        { className: "pane frames" },
        _react2.default.createElement(
          "div",
          { className: "pane-info empty" },
          L10N.getStr("callStack.notPaused")
        )
      );
    }

    return _react2.default.createElement(
      "div",
      { className: "pane frames" },
      this.renderFrames(frames),
      disableFrameTruncate ? null : this.renderToggleButton(frames)
    );
  }
}

Frames.contextTypes = { l10n: _propTypes2.default.object };

const mapStateToProps = state => ({
  cx: (0, _selectors.getThreadContext)(state),
  frames: (0, _selectors.getCallStackFrames)(state),
  frameworkGroupingOn: (0, _selectors.getFrameworkGroupingState)(state),
  selectedFrame: (0, _selectors.getSelectedFrame)(state, (0, _selectors.getCurrentThread)(state))
});

exports.default = (0, _connect.connect)(mapStateToProps, {
  selectFrame: _actions2.default.selectFrame,
  toggleBlackBox: _actions2.default.toggleBlackBox,
  toggleFrameworkGrouping: _actions2.default.toggleFrameworkGrouping,
  disableFrameTruncate: false,
  disableContextMenu: false,
  displayFullUrl: false
})(Frames);

// Export the non-connected component in order to use it outside of the debugger
// panel (e.g. console, netmonitor, …).

exports.Frames = Frames;