"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Threads = void 0;

var _react = _interopRequireWildcard(require("devtools/client/shared/vendor/react"));

var _reactDomFactories = require("devtools/client/shared/vendor/react-dom-factories");

var _reactPropTypes = _interopRequireDefault(require("devtools/client/shared/vendor/react-prop-types"));

var _reactRedux = require("devtools/client/shared/vendor/react-redux");

loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/selectors/index");

var _Thread = _interopRequireDefault(require("./Thread"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
class Threads extends _react.Component {
  static get propTypes() {
    return {
      threads: _reactPropTypes.default.array.isRequired
    };
  }

  render() {
    const {
      threads
    } = this.props;
    return (0, _reactDomFactories.div)({
      className: "pane threads-list"
    }, threads.map(thread => _react.default.createElement(_Thread.default, {
      thread,
      key: thread.actor
    })));
  }

}

exports.Threads = Threads;

const mapStateToProps = state => ({
  threads: (0, _index.getAllThreads)(state)
});

var _default = (0, _reactRedux.connect)(mapStateToProps)(Threads);

exports.default = _default;