"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _AccessibleImage = _interopRequireDefault(require("../../shared/AccessibleImage"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/pause/frames/index");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");

var _FrameIndent = _interopRequireDefault(require("./FrameIndent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

function FrameTitle({
  frame,
  options = {},
  l10n
}) {
  const displayName = (0, _index.formatDisplayName)(frame, options, l10n);
  return _react.default.createElement("span", {
    className: "title"
  }, displayName);
}

FrameTitle.propTypes = {
  frame: _reactPropTypes.default.object.isRequired,
  options: _reactPropTypes.default.object.isRequired,
  l10n: _reactPropTypes.default.object.isRequired
};

function getFrameLocation(frame, shouldDisplayOriginalLocation) {
  if (shouldDisplayOriginalLocation) {
    return frame.location;
  }

  return frame.generatedLocation || frame.location;
}

const FrameLocation = (0, _react.memo)(({
  frame,
  displayFullUrl = false,
  shouldDisplayOriginalLocation
}) => {
  if (frame.library) {
    return _react.default.createElement("span", {
      className: "location"
    }, frame.library, _react.default.createElement(_AccessibleImage.default, {
      className: `annotation-logo ${frame.library.toLowerCase()}`
    }));
  }

  const location = getFrameLocation(frame, shouldDisplayOriginalLocation);
  const filename = displayFullUrl ? (0, _source.getFileURL)(location.source, false) : location.source.shortName;
  return _react.default.createElement("span", {
    className: "location",
    title: location.source.url
  }, _react.default.createElement("span", {
    className: "filename"
  }, filename), ":", _react.default.createElement("span", {
    className: "line"
  }, location.line));
});
FrameLocation.displayName = "FrameLocation";
FrameLocation.propTypes = {
  frame: _reactPropTypes.default.object.isRequired,
  displayFullUrl: _reactPropTypes.default.bool.isRequired
};

class FrameComponent extends _react.Component {
  static get propTypes() {
    return {
      disableContextMenu: _reactPropTypes.default.bool.isRequired,
      displayFullUrl: _reactPropTypes.default.bool.isRequired,
      frame: _reactPropTypes.default.object.isRequired,
      getFrameTitle: _reactPropTypes.default.func,
      hideLocation: _reactPropTypes.default.bool.isRequired,
      isInGroup: _reactPropTypes.default.bool,
      panel: _reactPropTypes.default.oneOf(["debugger", "webconsole"]).isRequired,
      selectFrame: _reactPropTypes.default.func.isRequired,
      selectedFrame: _reactPropTypes.default.object,
      isTracerFrameSelected: _reactPropTypes.default.bool.isRequired,
      shouldMapDisplayName: _reactPropTypes.default.bool.isRequired,
      shouldDisplayOriginalLocation: _reactPropTypes.default.bool,
      showFrameContextMenu: _reactPropTypes.default.func.isRequired
    };
  }

  get isSelectable() {
    return this.props.panel == "webconsole";
  }

  get isDebugger() {
    return this.props.panel == "debugger";
  }

  render() {
    const {
      frame,
      selectedFrame,
      isTracerFrameSelected,
      hideLocation,
      shouldMapDisplayName,
      displayFullUrl,
      getFrameTitle,
      shouldDisplayOriginalLocation,
      isInGroup
    } = this.props;
    const {
      l10n
    } = this.context;
    const isSelected = !isTracerFrameSelected && selectedFrame && selectedFrame.id === frame.id;
    const className = classnames("frame", {
      selected: isSelected,
      // When a JS Tracer frame is selected, the frame will still be considered as selected,
      // and switch from a blue to a grey background. It will still be considered as selected
      // from the point of view of stepping buttons.
      inactive: isTracerFrameSelected && selectedFrame && selectedFrame.id === frame.id,
      // Dead frames will likely not have inspectable scope
      dead: frame.state && frame.state !== "on-stack"
    });
    const location = getFrameLocation(frame, shouldDisplayOriginalLocation);
    const title = getFrameTitle ? getFrameTitle(`${(0, _source.getFileURL)(location.source, false)}:${location.line}`) : undefined;
    return _react.default.createElement(_react.default.Fragment, null, frame.asyncCause && _react.default.createElement("div", {
      className: "location-async-cause",
      tabIndex: -1,
      role: "presentation"
    }, this.isSelectable && _react.default.createElement(_FrameIndent.default, null), this.isDebugger ? _react.default.createElement("span", {
      className: "async-label"
    }, frame.asyncCause) : l10n.getFormatStr("stacktrace.asyncStack", frame.asyncCause), this.isSelectable && _react.default.createElement("br", {
      className: "clipboard-only"
    })), _react.default.createElement("div", {
      title,
      className,
      tabIndex: -1,
      role: "option",
      id: frame.id,
      "aria-selected": isSelected ? "true" : "false"
    }, this.isSelectable && _react.default.createElement(_FrameIndent.default, {
      indentLevel: isInGroup ? 2 : 1
    }), _react.default.createElement(FrameTitle, {
      frame,
      options: {
        shouldMapDisplayName
      },
      l10n
    }), !hideLocation && _react.default.createElement("span", {
      className: "clipboard-only"
    }, " "), !hideLocation && _react.default.createElement(FrameLocation, {
      frame,
      displayFullUrl,
      shouldDisplayOriginalLocation
    }), this.isSelectable && _react.default.createElement("br", {
      className: "clipboard-only"
    })));
  }

}

exports.default = FrameComponent;

_defineProperty(FrameComponent, "defaultProps", {
  hideLocation: false,
  shouldMapDisplayName: true,
  disableContextMenu: false
});

FrameComponent.displayName = "Frame";
FrameComponent.contextTypes = {
  l10n: _reactPropTypes.default.object
};