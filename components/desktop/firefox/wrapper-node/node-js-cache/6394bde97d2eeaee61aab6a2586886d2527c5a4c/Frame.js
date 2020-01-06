"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("devtools/client/shared/vendor/react-prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = require("devtools/client/debugger/dist/vendors").vendored["classnames"];

var _classnames2 = _interopRequireDefault(_classnames);

var _AccessibleImage = require("../../shared/AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

var _frames = require("../../../utils/pause/frames/index");

var _source = require("../../../utils/source");

var _FrameMenu = require("./FrameMenu");

var _FrameMenu2 = _interopRequireDefault(_FrameMenu);

var _FrameIndent = require("./FrameIndent");

var _FrameIndent2 = _interopRequireDefault(_FrameIndent);

var _actions = require("../../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FrameTitle({ frame, options = {}, l10n }) {
  const displayName = (0, _frames.formatDisplayName)(frame, options, l10n);
  return _react2.default.createElement(
    "span",
    { className: "title" },
    displayName
  );
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function FrameLocation({ frame, displayFullUrl = false }) {
  if (!frame.source) {
    return null;
  }

  if (frame.library) {
    return _react2.default.createElement(
      "span",
      { className: "location" },
      frame.library,
      _react2.default.createElement(_AccessibleImage2.default, {
        className: `annotation-logo ${frame.library.toLowerCase()}`
      })
    );
  }

  const { location, source } = frame;
  const filename = displayFullUrl ? (0, _source.getFileURL)(source, false) : (0, _source.getFilename)(source);

  return _react2.default.createElement(
    "span",
    { className: "location" },
    _react2.default.createElement(
      "span",
      { className: "filename" },
      filename
    ),
    ":",
    _react2.default.createElement(
      "span",
      { className: "line" },
      location.line
    )
  );
}

FrameLocation.displayName = "FrameLocation";

class FrameComponent extends _react.Component {

  onContextMenu(event) {
    const {
      frame,
      copyStackTrace,
      toggleFrameworkGrouping,
      toggleBlackBox,
      frameworkGroupingOn
    } = this.props;
    (0, _FrameMenu2.default)(frame, frameworkGroupingOn, { copyStackTrace, toggleFrameworkGrouping, toggleBlackBox }, event);
  }

  onMouseDown(e, frame, selectedFrame) {
    if (e.button !== 0) {
      return;
    }
    this.props.selectFrame(this.props.cx, frame);
  }

  onKeyUp(event, frame, selectedFrame) {
    if (event.key != "Enter") {
      return;
    }
    this.props.selectFrame(this.props.cx, frame);
  }

  render() {
    const {
      frame,
      selectedFrame,
      hideLocation,
      shouldMapDisplayName,
      displayFullUrl,
      getFrameTitle,
      disableContextMenu,
      selectable
    } = this.props;
    const { l10n } = this.context;

    const className = (0, _classnames2.default)("frame", {
      selected: selectedFrame && selectedFrame.id === frame.id
    });

    if (!frame.source) {
      throw new Error("no frame source");
    }

    const title = getFrameTitle ? getFrameTitle(`${(0, _source.getFileURL)(frame.source, false)}:${frame.location.line}`) : undefined;

    return _react2.default.createElement(
      "div",
      {
        role: "listitem",
        key: frame.id,
        className: className,
        onMouseDown: e => this.onMouseDown(e, frame, selectedFrame),
        onKeyUp: e => this.onKeyUp(e, frame, selectedFrame),
        onContextMenu: disableContextMenu ? null : e => this.onContextMenu(e),
        tabIndex: 0,
        title: title
      },
      selectable && _react2.default.createElement(_FrameIndent2.default, null),
      _react2.default.createElement(FrameTitle, {
        frame: frame,
        options: { shouldMapDisplayName },
        l10n: l10n
      }),
      !hideLocation && _react2.default.createElement(
        "span",
        { className: "clipboard-only" },
        " "
      ),
      !hideLocation && _react2.default.createElement(FrameLocation, { frame: frame, displayFullUrl: displayFullUrl }),
      selectable && _react2.default.createElement("br", { className: "clipboard-only" })
    );
  }
}

exports.default = FrameComponent;
FrameComponent.defaultProps = {
  hideLocation: false,
  shouldMapDisplayName: true,
  disableContextMenu: false
};
FrameComponent.displayName = "Frame";
FrameComponent.contextTypes = { l10n: _propTypes2.default.object };