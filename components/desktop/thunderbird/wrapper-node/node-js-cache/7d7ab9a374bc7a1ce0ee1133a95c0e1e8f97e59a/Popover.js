"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _classnames = _interopRequireDefault(require("devtools/client/debugger/dist/vendors").vendored["classnames"]);

var _BracketArrow = _interopRequireDefault(require("./BracketArrow"));

var _SmartGap = _interopRequireDefault(require("./SmartGap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Popover extends _react.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      coords: {
        left: 0,
        top: 0,
        orientation: "down",
        targetMid: {
          x: 0,
          y: 0
        }
      }
    });

    _defineProperty(this, "firstRender", true);

    _defineProperty(this, "onTimeout", () => {
      const isHoveredOnGap = this.$gap && this.$gap.matches(":hover");
      const isHoveredOnPopover = this.$popover && this.$popover.matches(":hover");
      const isHoveredOnTooltip = this.$tooltip && this.$tooltip.matches(":hover");
      const isHoveredOnTarget = this.props.target.matches(":hover");

      if (isHoveredOnGap) {
        if (!this.wasOnGap) {
          this.wasOnGap = true;
          this.timerId = setTimeout(this.onTimeout, 200);
          return;
        }

        return this.props.mouseout();
      } // Don't clear the current preview if mouse is hovered on
      // the current preview's token (target) or the popup element


      if (isHoveredOnPopover || isHoveredOnTooltip || isHoveredOnTarget) {
        this.wasOnGap = false;
        this.timerId = setTimeout(this.onTimeout, 0);
        return;
      }

      this.props.mouseout();
    });

    _defineProperty(this, "calculateTopForRightOrientation", (target, editor, popover) => {
      if (popover.height <= editor.height) {
        const rightOrientationTop = target.top - popover.height / 2;

        if (rightOrientationTop < editor.top) {
          return editor.top - target.height;
        }

        const rightOrientationBottom = rightOrientationTop + popover.height;

        if (rightOrientationBottom > editor.bottom) {
          return editor.bottom + target.height - popover.height + this.gapHeight;
        }

        return rightOrientationTop;
      }

      return editor.top - target.height;
    });

    _defineProperty(this, "calculateTop", (target, editor, popover, orientation) => {
      if (orientation === "down") {
        return target.bottom;
      }

      if (orientation === "up") {
        return target.top - popover.height;
      }

      return this.calculateTopForRightOrientation(target, editor, popover);
    });
  }

  componentDidMount() {
    const {
      type
    } = this.props; // $FlowIgnore

    this.gapHeight = this.$gap.getBoundingClientRect().height;
    const coords = type == "popover" ? this.getPopoverCoords() : this.getTooltipCoords();

    if (coords) {
      this.setState({
        coords
      });
    }

    this.firstRender = false;
    this.startTimer();
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
  }

  startTimer() {
    this.timerId = setTimeout(this.onTimeout, 0);
  }

  calculateLeft(target, editor, popover, orientation) {
    const estimatedLeft = target.left;
    const estimatedRight = estimatedLeft + popover.width;
    const isOverflowingRight = estimatedRight > editor.right;

    if (orientation === "right") {
      return target.left + target.width;
    }

    if (isOverflowingRight) {
      const adjustedLeft = editor.right - popover.width - 8;
      return adjustedLeft;
    }

    return estimatedLeft;
  }

  calculateOrientation(target, editor, popover) {
    const estimatedBottom = target.bottom + popover.height;

    if (editor.bottom > estimatedBottom) {
      return "down";
    }

    const upOrientationTop = target.top - popover.height;

    if (upOrientationTop > editor.top) {
      return "up";
    }

    return "right";
  }

  getPopoverCoords() {
    if (!this.$popover || !this.props.editorRef) {
      return null;
    }

    const popover = this.$popover;
    const editor = this.props.editorRef;
    const popoverRect = popover.getBoundingClientRect();
    const editorRect = editor.getBoundingClientRect();
    const targetRect = this.props.targetPosition;
    const orientation = this.calculateOrientation(targetRect, editorRect, popoverRect);
    const top = this.calculateTop(targetRect, editorRect, popoverRect, orientation);
    const popoverLeft = this.calculateLeft(targetRect, editorRect, popoverRect, orientation);
    let targetMid;

    if (orientation === "right") {
      targetMid = {
        x: -14,
        y: targetRect.top - top - 2
      };
    } else {
      targetMid = {
        x: targetRect.left - popoverLeft + targetRect.width / 2 - 8,
        y: 0
      };
    }

    return {
      left: popoverLeft,
      top,
      orientation,
      targetMid
    };
  }

  getTooltipCoords() {
    if (!this.$tooltip || !this.props.editorRef) {
      return null;
    }

    const tooltip = this.$tooltip;
    const editor = this.props.editorRef;
    const tooltipRect = tooltip.getBoundingClientRect();
    const editorRect = editor.getBoundingClientRect();
    const targetRect = this.props.targetPosition;
    const left = this.calculateLeft(targetRect, editorRect, tooltipRect);
    const enoughRoomForTooltipAbove = targetRect.top - editorRect.top > tooltipRect.height;
    const top = enoughRoomForTooltipAbove ? targetRect.top - tooltipRect.height : targetRect.bottom;
    return {
      left,
      top,
      orientation: enoughRoomForTooltipAbove ? "up" : "down",
      targetMid: {
        x: 0,
        y: 0
      }
    };
  }

  getChildren() {
    const {
      children
    } = this.props;
    const {
      coords
    } = this.state;
    const gap = this.getGap();
    return coords.orientation === "up" ? [children, gap] : [gap, children];
  }

  getGap() {
    if (this.firstRender) {
      return _react.default.createElement("div", {
        className: "gap",
        key: "gap",
        ref: a => this.$gap = a
      });
    }

    return _react.default.createElement("div", {
      className: "gap",
      key: "gap",
      ref: a => this.$gap = a
    }, _react.default.createElement(_SmartGap.default, {
      token: this.props.target,
      preview: this.$tooltip || this.$popover,
      type: this.props.type,
      gapHeight: this.gapHeight,
      coords: this.state.coords // $FlowIgnore
      ,
      offset: this.$gap.getBoundingClientRect().left
    }));
  }

  getPopoverArrow(orientation, left, top) {
    let arrowProps = {};

    if (orientation === "up") {
      arrowProps = {
        orientation: "down",
        bottom: 10,
        left
      };
    } else if (orientation === "down") {
      arrowProps = {
        orientation: "up",
        top: -2,
        left
      };
    } else {
      arrowProps = {
        orientation: "left",
        top,
        left: -4
      };
    }

    return _react.default.createElement(_BracketArrow.default, arrowProps);
  }

  renderPopover() {
    const {
      top,
      left,
      orientation,
      targetMid
    } = this.state.coords;
    const arrow = this.getPopoverArrow(orientation, targetMid.x, targetMid.y);
    return _react.default.createElement("div", {
      className: (0, _classnames.default)("popover", `orientation-${orientation}`, {
        up: orientation === "up"
      }),
      style: {
        top,
        left
      },
      ref: c => this.$popover = c
    }, arrow, this.getChildren());
  }

  renderTooltip() {
    const {
      top,
      left,
      orientation
    } = this.state.coords;
    return _react.default.createElement("div", {
      className: (0, _classnames.default)("tooltip", `orientation-${orientation}`),
      style: {
        top,
        left
      },
      ref: c => this.$tooltip = c
    }, this.getChildren());
  }

  render() {
    const {
      type
    } = this.props;

    if (type === "tooltip") {
      return this.renderTooltip();
    }

    return this.renderPopover();
  }

}

_defineProperty(Popover, "defaultProps", {
  type: "popover"
});

var _default = Popover;
exports.default = _default;