"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _SourceIcon = _interopRequireDefault(require("../shared/SourceIcon"));

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/components/shared/Button/index");

var _index2 = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_index3", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const classnames = require("resource://devtools/client/shared/classnames.js");

class Tab extends _react.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "onContextMenu", event => {
      event.preventDefault();
      this.props.showTabContextMenu(event, this.props.source);
    });
  }

  static get propTypes() {
    return {
      closeTab: _reactPropTypes.default.func.isRequired,
      onDragEnd: _reactPropTypes.default.func.isRequired,
      onDragOver: _reactPropTypes.default.func.isRequired,
      onDragStart: _reactPropTypes.default.func.isRequired,
      selectSource: _reactPropTypes.default.func.isRequired,
      source: _reactPropTypes.default.object.isRequired,
      sourceActor: _reactPropTypes.default.object.isRequired,
      tabSources: _reactPropTypes.default.array.isRequired,
      isBlackBoxed: _reactPropTypes.default.bool.isRequired
    };
  }

  isSourceSearchEnabled() {
    return this.props.activeSearch === "source";
  }

  render() {
    const {
      selectSource,
      closeTab,
      source,
      sourceActor,
      tabSources,
      onDragOver,
      onDragStart,
      onDragEnd,
      index,
      isActive
    } = this.props;
    const sourceId = source.id;
    const isPrettyCode = (0, _source.isPretty)(source);

    function onClickClose(e) {
      e.stopPropagation();
      closeTab(source);
    }

    function handleTabClick(e) {
      e.preventDefault();
      e.stopPropagation();
      return selectSource(source, sourceActor);
    }

    const className = classnames("source-tab", {
      active: isActive,
      pretty: isPrettyCode,
      blackboxed: this.props.isBlackBoxed
    });
    const path = (0, _source.getDisplayPath)(source, tabSources);
    return (0, _reactDomFactories.div)({
      draggable: true,
      onDragOver,
      onDragStart,
      onDragEnd,
      className,
      "data-index": index,
      "data-source-id": sourceId,
      onClick: handleTabClick,
      // Accommodate middle click to close tab
      onMouseUp: e => e.button === 1 && closeTab(source),
      onContextMenu: this.onContextMenu,
      title: (0, _source.getFileURL)(source, false)
    }, _react.default.createElement(_SourceIcon.default, {
      location: (0, _location.createLocation)({
        source,
        sourceActor
      }),
      forTab: true
    }), (0, _reactDomFactories.div)({
      className: "filename"
    }, (0, _source.getTruncatedFileName)(source), path && (0, _reactDomFactories.span)(null, `../${path}/..`)), _react.default.createElement(_index.CloseButton, {
      handleClick: onClickClose,
      tooltip: L10N.getStr("sourceTabs.closeTabButtonTooltip")
    }));
  }

}

const mapStateToProps = (state, {
  source
}) => {
  return {
    tabSources: (0, _index3.getSourcesForTabs)(state),
    isBlackBoxed: (0, _index3.isSourceBlackBoxed)(state, source),
    isActive: source.id === (0, _index3.getSelectedLocation)(state)?.source.id
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  selectSource: _index2.default.selectSource,
  closeTab: _index2.default.closeTab,
  showTabContextMenu: _index2.default.showTabContextMenu
}, null, {
  withRef: true
})(Tab);

exports.default = _default;