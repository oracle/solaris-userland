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

var _CloseButton = _interopRequireDefault(require("devtools/client/shared/components/CloseButton"));

var _index = _interopRequireDefault(require("../../actions/index"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_location", "devtools/client/debugger/src/utils/location");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");

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
      closeTabForSource: _reactPropTypes.default.func.isRequired,
      onDragEnd: _reactPropTypes.default.func.isRequired,
      onDragOver: _reactPropTypes.default.func.isRequired,
      onDragStart: _reactPropTypes.default.func.isRequired,
      selectSource: _reactPropTypes.default.func.isRequired,
      source: _reactPropTypes.default.object.isRequired,
      isBlackBoxed: _reactPropTypes.default.bool.isRequired
    };
  }

  isSourceSearchEnabled() {
    return this.props.activeSearch === "source";
  }

  render() {
    const {
      selectSource,
      closeTabForSource,
      source,
      onDragOver,
      onDragStart,
      onDragEnd,
      index,
      isActive
    } = this.props;

    function onClickClose(e) {
      e.stopPropagation();
      closeTabForSource(source);
    }

    function handleTabClick(e) {
      e.preventDefault();
      e.stopPropagation();
      return selectSource(source);
    }

    const className = classnames("source-tab", {
      active: isActive,
      blackboxed: this.props.isBlackBoxed
    });
    const path = (0, _source.getDisplayPath)(source, this.props.openedSources);
    return (0, _reactDomFactories.div)({
      draggable: true,
      onDragOver,
      onDragStart,
      onDragEnd,
      className,
      "data-index": index,
      "data-source-id": source.id,
      onClick: handleTabClick,
      // Accommodate middle click to close tab
      onMouseUp: e => e.button === 1 && closeTabForSource(source),
      onContextMenu: this.onContextMenu,
      title: (0, _source.getFileURL)(source, false)
    }, _react.default.createElement(_SourceIcon.default, {
      location: (0, _location.createLocation)({
        source
      })
    }), (0, _reactDomFactories.div)({
      className: "filename"
    }, (0, _source.getTruncatedFileName)(source), path && (0, _reactDomFactories.span)(null, `../${path}/..`)), _react.default.createElement(_CloseButton.default, {
      handleClick: onClickClose,
      tooltip: L10N.getStr("sourceTabs.closeTabButtonTooltip")
    }));
  }

}

const mapStateToProps = (state, {
  source
}) => {
  const selectedSource = (0, _index2.getSelectedLocation)(state)?.source; // When a pretty printed source is selected, we should check if the related minimized/generated source is opened in a tab.

  const isActive = selectedSource?.isPrettyPrinted ? selectedSource.generatedSource == source : selectedSource == source;
  return {
    isBlackBoxed: (0, _index2.isSourceBlackBoxed)(state, source),
    isActive,
    openedSources: (0, _index2.getOpenedSources)(state)
  };
};

var _default = (0, _reactRedux.connect)(mapStateToProps, {
  selectSource: _index.default.selectSource,
  closeTabForSource: _index.default.closeTabForSource,
  showTabContextMenu: _index.default.showTabContextMenu
}, null, {
  withRef: true
})(Tab);

exports.default = _default;