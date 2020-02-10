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

var _frames = require("../../../utils/pause/frames/index");

var _FrameMenu = require("./FrameMenu");

var _FrameMenu2 = _interopRequireDefault(_FrameMenu);

var _AccessibleImage = require("../../shared/AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

var _Frame = require("./Frame");

var _Frame2 = _interopRequireDefault(_Frame);

var _actions = require("../../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _Badge = require("../../shared/Badge");

var _Badge2 = _interopRequireDefault(_Badge);

var _FrameIndent = require("./FrameIndent");

var _FrameIndent2 = _interopRequireDefault(_FrameIndent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

function FrameLocation({ frame, expanded }) {
  const library = frame.library || (0, _frames.getLibraryFromUrl)(frame);
  if (!library) {
    return null;
  }

  const arrowClassName = (0, _classnames2.default)("arrow", { expanded });
  return _react2.default.createElement(
    "span",
    { className: "group-description" },
    _react2.default.createElement(_AccessibleImage2.default, { className: arrowClassName }),
    _react2.default.createElement(_AccessibleImage2.default, { className: `annotation-logo ${library.toLowerCase()}` }),
    _react2.default.createElement(
      "span",
      { className: "group-description-name" },
      library
    )
  );
}

FrameLocation.displayName = "FrameLocation";

class Group extends _react.Component {

  constructor(...args) {
    super(...args);

    this.toggleFrames = event => {
      event.stopPropagation();
      this.setState(prevState => ({ expanded: !prevState.expanded }));
    };

    this.state = { expanded: false };
  }

  onContextMenu(event) {
    const {
      group,
      copyStackTrace,
      toggleFrameworkGrouping,
      toggleBlackBox,
      frameworkGroupingOn
    } = this.props;
    const frame = group[0];
    (0, _FrameMenu2.default)(frame, frameworkGroupingOn, { copyStackTrace, toggleFrameworkGrouping, toggleBlackBox }, event);
  }

  renderFrames() {
    const {
      cx,
      group,
      selectFrame,
      selectedFrame,
      toggleFrameworkGrouping,
      frameworkGroupingOn,
      toggleBlackBox,
      copyStackTrace,
      displayFullUrl,
      getFrameTitle,
      disableContextMenu,
      selectable
    } = this.props;

    const { expanded } = this.state;
    if (!expanded) {
      return null;
    }

    return _react2.default.createElement(
      "div",
      { className: "frames-list" },
      group.reduce((acc, frame, i) => {
        if (selectable) {
          acc.push(_react2.default.createElement(_FrameIndent2.default, { key: `frame-indent-${i}` }));
        }
        return acc.concat(_react2.default.createElement(_Frame2.default, {
          cx: cx,
          copyStackTrace: copyStackTrace,
          frame: frame,
          frameworkGroupingOn: frameworkGroupingOn,
          hideLocation: true,
          key: frame.id,
          selectedFrame: selectedFrame,
          selectFrame: selectFrame,
          shouldMapDisplayName: false,
          toggleBlackBox: toggleBlackBox,
          toggleFrameworkGrouping: toggleFrameworkGrouping,
          displayFullUrl: displayFullUrl,
          getFrameTitle: getFrameTitle,
          disableContextMenu: disableContextMenu,
          selectable: selectable
        }));
      }, [])
    );
  }

  renderDescription() {
    const { l10n } = this.context;
    const { selectable, group } = this.props;

    const frame = group[0];
    const expanded = this.state.expanded;
    const l10NEntry = this.state.expanded ? "callStack.group.collapseTooltip" : "callStack.group.expandTooltip";
    const title = l10n.getFormatStr(l10NEntry, frame.library);

    return _react2.default.createElement(
      "div",
      {
        role: "listitem",
        key: frame.id,
        className: (0, _classnames2.default)("group"),
        onClick: this.toggleFrames,
        tabIndex: 0,
        title: title
      },
      selectable && _react2.default.createElement(_FrameIndent2.default, null),
      _react2.default.createElement(FrameLocation, { frame: frame, expanded: expanded }),
      selectable && _react2.default.createElement(
        "span",
        { className: "clipboard-only" },
        " "
      ),
      _react2.default.createElement(
        _Badge2.default,
        null,
        this.props.group.length
      ),
      selectable && _react2.default.createElement("br", { className: "clipboard-only" })
    );
  }

  render() {
    const { expanded } = this.state;
    const { disableContextMenu } = this.props;
    return _react2.default.createElement(
      "div",
      {
        className: (0, _classnames2.default)("frames-group", { expanded }),
        onContextMenu: disableContextMenu ? null : e => this.onContextMenu(e)
      },
      this.renderDescription(),
      this.renderFrames()
    );
  }
}

exports.default = Group;
Group.displayName = "Group";
Group.contextTypes = { l10n: _propTypes2.default.object };