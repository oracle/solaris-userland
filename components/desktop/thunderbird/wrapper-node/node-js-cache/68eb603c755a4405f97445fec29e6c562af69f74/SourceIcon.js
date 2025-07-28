"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

var _AccessibleImage = _interopRequireDefault(require("./AccessibleImage"));

loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class SourceIcon extends _react.PureComponent {
  static get propTypes() {
    return {
      modifier: _reactPropTypes.default.func,
      location: _reactPropTypes.default.object.isRequired,
      iconClass: _reactPropTypes.default.string,
      forTab: _reactPropTypes.default.bool
    };
  }

  render() {
    const {
      modifier
    } = this.props;
    let {
      iconClass
    } = this.props;

    if (modifier) {
      const modified = modifier(iconClass);

      if (!modified) {
        return null;
      }

      iconClass = modified;
    }

    return _react.default.createElement(_AccessibleImage.default, {
      className: `source-icon ${iconClass}`
    });
  }

}

var _default = (0, _reactRedux.connect)((state, props) => {
  const {
    forTab,
    location
  } = props;
  const isBlackBoxed = (0, _index.isSourceBlackBoxed)(state, location.source); // For the tab icon, we don't want to show the pretty icon for the non-pretty tab

  const hasMatchingPrettyTab = !forTab && (0, _index.hasPrettyTab)(state, location.source); // This is the key function that will compute the icon type,
  // In addition to the "modifier" implemented by each callsite.

  const iconClass = (0, _source.getSourceClassnames)(location.source, isBlackBoxed, hasMatchingPrettyTab);
  return {
    iconClass
  };
})(SourceIcon);

exports.default = _default;