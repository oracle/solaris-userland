"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/pause/frames/index");

var _AccessibleImage = _interopRequireDefault(require("../../shared/AccessibleImage"));

var _Frame = _interopRequireDefault(require("./Frame"));

var _Badge = _interopRequireDefault(require("../../shared/Badge"));

var _FrameIndent = _interopRequireDefault(require("./FrameIndent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
const classnames = require("resource://devtools/client/shared/classnames.js");

function FrameLocation({
  frame,
  expanded
}) {
  const library = frame.library || (0, _index.getLibraryFromUrl)(frame);

  if (!library) {
    return null;
  }

  const arrowClassName = classnames("arrow", {
    expanded
  });
  return _react.default.createElement("span", {
    className: "group-description"
  }, _react.default.createElement(_AccessibleImage.default, {
    className: arrowClassName
  }), _react.default.createElement(_AccessibleImage.default, {
    className: `annotation-logo ${library.toLowerCase()}`
  }), _react.default.createElement("span", {
    className: "group-description-name"
  }, library));
}

FrameLocation.propTypes = {
  expanded: _reactPropTypes.default.any.isRequired,
  frame: _reactPropTypes.default.object.isRequired
};
FrameLocation.displayName = "FrameLocation";

class Group extends _react.Component {
  constructor(...args) {
    super(...args);
  }

  static get propTypes() {
    return {
      disableContextMenu: _reactPropTypes.default.bool.isRequired,
      displayFullUrl: _reactPropTypes.default.bool.isRequired,
      getFrameTitle: _reactPropTypes.default.func,
      group: _reactPropTypes.default.array.isRequired,
      groupTitle: _reactPropTypes.default.string.isRequired,
      groupId: _reactPropTypes.default.string.isRequired,
      expanded: _reactPropTypes.default.bool.isRequired,
      frameIndex: _reactPropTypes.default.number.isRequired,
      panel: _reactPropTypes.default.oneOf(["debugger", "webconsole"]).isRequired,
      selectFrame: _reactPropTypes.default.func.isRequired,
      selectLocation: _reactPropTypes.default.func,
      selectedFrame: _reactPropTypes.default.object,
      isTracerFrameSelected: _reactPropTypes.default.bool.isRequired,
      showFrameContextMenu: _reactPropTypes.default.func.isRequired
    };
  }

  get isSelectable() {
    return this.props.panel == "webconsole";
  }

  onContextMenu(event) {
    const {
      group
    } = this.props;
    const frame = group[0];
    this.props.showFrameContextMenu(event, frame, true);
  }

  renderFrames() {
    const {
      group,
      groupId,
      selectFrame,
      selectLocation,
      selectedFrame,
      isTracerFrameSelected,
      displayFullUrl,
      getFrameTitle,
      disableContextMenu,
      panel,
      showFrameContextMenu,
      expanded
    } = this.props;

    if (!expanded) {
      return null;
    }

    return _react.default.createElement("div", {
      className: "frames-list",
      role: "listbox",
      "aria-labelledby": groupId
    }, group.map((frame, index) => _react.default.createElement(_Frame.default, {
      frame,
      frameIndex: index,
      showFrameContextMenu,
      hideLocation: true,
      selectedFrame,
      isTracerFrameSelected,
      selectFrame,
      selectLocation,
      shouldMapDisplayName: false,
      displayFullUrl,
      getFrameTitle,
      disableContextMenu,
      panel,
      isInGroup: true
    })));
  }

  render() {
    const {
      l10n
    } = this.context;
    const {
      group,
      groupTitle,
      groupId,
      expanded,
      selectedFrame
    } = this.props;
    const isGroupFrameSelected = group.some(frame => frame.id == selectedFrame?.id);
    let l10NEntry;

    if (expanded) {
      if (isGroupFrameSelected) {
        l10NEntry = "callStack.group.collapseTooltipWithSelectedFrame";
      } else {
        l10NEntry = "callStack.group.collapseTooltip";
      }
    } else {
      l10NEntry = "callStack.group.expandTooltip";
    }

    const title = l10n.getFormatStr(l10NEntry, groupTitle);
    return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement("div", {
      className: classnames("frames-group frame", {
        expanded
      }),
      id: groupId,
      tabIndex: -1,
      role: "presentation",
      onClick: this.toggleFrames,
      title
    }, this.isSelectable && _react.default.createElement(_FrameIndent.default, null), _react.default.createElement(FrameLocation, {
      frame: group[0],
      expanded
    }), this.isSelectable && _react.default.createElement("span", {
      className: "clipboard-only"
    }, " "), _react.default.createElement(_Badge.default, {
      badgeText: this.props.group.length
    }), this.isSelectable && _react.default.createElement("br", {
      className: "clipboard-only"
    })), this.renderFrames());
  }

}

exports.default = Group;
Group.displayName = "Group";
Group.contextTypes = {
  l10n: _reactPropTypes.default.object
};