"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

loader.lazyRequireGetter(this, "_connect", "devtools/client/debugger/src/utils/connect");

var _actions = _interopRequireDefault(require("../../../actions/index"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");

var _SourceIcon = _interopRequireDefault(require("../../shared/SourceIcon"));

var _BreakpointHeadingsContextMenu = _interopRequireDefault(require("./BreakpointHeadingsContextMenu"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BreakpointHeading extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onContextMenu", e => {
      (0, _BreakpointHeadingsContextMenu.default)({ ...this.props,
        contextMenuEvent: e
      });
    });
  }

  render() {
    const {
      cx,
      sources,
      source,
      hasSiblingOfSameName,
      selectSource
    } = this.props;
    const path = (0, _source.getDisplayPath)(source, sources);
    const query = hasSiblingOfSameName ? (0, _source.getSourceQueryString)(source) : "";
    return _react.default.createElement("div", {
      className: "breakpoint-heading",
      title: (0, _source.getFileURL)(source, false),
      onClick: () => selectSource(cx, source.id),
      onContextMenu: this.onContextMenu
    }, _react.default.createElement(_SourceIcon.default, {
      source: source,
      modifier: icon => ["file", "javascript"].includes(icon) ? null : icon
    }), _react.default.createElement("div", {
      className: "filename"
    }, (0, _source.getTruncatedFileName)(source, query), path && _react.default.createElement("span", null, `../${path}/..`)));
  }

}

const mapStateToProps = (state, {
  source
}) => ({
  cx: (0, _selectors.getContext)(state),
  hasSiblingOfSameName: (0, _selectors.getHasSiblingOfSameName)(state, source),
  breakpointsForSource: (0, _selectors.getBreakpointsForSource)(state, source.id)
});

var _default = (0, _connect.connect)(mapStateToProps, {
  selectSource: _actions.default.selectSource,
  enableBreakpointsInSource: _actions.default.enableBreakpointsInSource,
  disableBreakpointsInSource: _actions.default.disableBreakpointsInSource,
  removeBreakpointsInSource: _actions.default.removeBreakpointsInSource
})(BreakpointHeading);

exports.default = _default;