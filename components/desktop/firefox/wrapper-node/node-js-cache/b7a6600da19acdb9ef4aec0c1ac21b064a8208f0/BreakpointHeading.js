"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _index = _interopRequireDefault(require("../../../actions/index"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");

var _SourceIcon = _interopRequireDefault(require("../../shared/SourceIcon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BreakpointHeading extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onContextMenu", event => {
      event.preventDefault();
      this.props.showBreakpointHeadingContextMenu(event, this.props.source);
    });
  }

  static get propTypes() {
    return {
      sources: _reactPropTypes.default.array.isRequired,
      source: _reactPropTypes.default.object.isRequired,
      firstSourceActor: _reactPropTypes.default.object,
      selectSource: _reactPropTypes.default.func.isRequired,
      showBreakpointHeadingContextMenu: _reactPropTypes.default.func.isRequired
    };
  }

  render() {
    const {
      sources,
      source,
      selectSource
    } = this.props;
    const path = (0, _source.getDisplayPath)(source, sources);
    return (0, _reactDomFactories.div)({
      className: "breakpoint-heading",
      title: (0, _source.getFileURL)(source, false),
      onClick: () => selectSource(source),
      onContextMenu: this.onContextMenu
    }, _react.default.createElement(_SourceIcon.default, // Breakpoints are displayed per source and may relate to many source actors.
    // Arbitrarily pick the first source actor to compute the matching source icon
    // The source actor is used to pick one specific source text content and guess
    // the related framework icon.
    {
      location: (0, _location.createLocation)({
        source,
        sourceActor: this.props.firstSourceActor
      }),
      modifier: icon => ["file", "javascript"].includes(icon) ? null : icon
    }), (0, _reactDomFactories.div)({
      className: "filename"
    }, (0, _source.getTruncatedFileName)(source), path && (0, _reactDomFactories.span)(null, `../${path}/..`)));
  }

}

const mapStateToProps = (state, {
  source
}) => ({
  firstSourceActor: (0, _index2.getFirstSourceActorForGeneratedSource)(state, source.id)
});

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  selectSource: _index.default.selectSource,
  showBreakpointHeadingContextMenu: _index.default.showBreakpointHeadingContextMenu
})(BreakpointHeading);

exports.default = _default;