"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _AccessibleImage = _interopRequireDefault(require("../AccessibleImage"));

loader.lazyRequireGetter(this, "_", "devtools/client/debugger/src/components/shared/Button/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PaneToggleButton extends _react.PureComponent {
  label(position, collapsed) {
    switch (position) {
      case "start":
        return L10N.getStr(collapsed ? "expandSources" : "collapseSources");

      case "end":
        return L10N.getStr(collapsed ? "expandBreakpoints" : "collapseBreakpoints");
    }
  }

  render() {
    const {
      position,
      collapsed,
      horizontal,
      handleClick
    } = this.props;
    return _react.default.createElement(_.CommandBarButton, {
      className: (0, _classnames.default)("toggle-button", position, {
        collapsed,
        vertical: !horizontal
      }),
      onClick: () => handleClick(position, !collapsed),
      title: this.label(position, collapsed)
    }, _react.default.createElement(_AccessibleImage.default, {
      className: collapsed ? "pane-expand" : "pane-collapse"
    }));
  }

}

_defineProperty(PaneToggleButton, "defaultProps", {
  horizontal: false,
  position: "start"
});

var _default = PaneToggleButton;
exports.default = _default;