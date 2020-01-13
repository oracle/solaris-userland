"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("devtools/client/shared/vendor/react");

var _react2 = _interopRequireDefault(_react);

var _connect = require("../../utils/connect");

var _selectors = require("../../selectors/index");

var _ui = require("../../utils/ui");

var _tabs = require("../../utils/tabs");

var _source = require("../../utils/source");

var _actions = require("../../actions/index");

var _actions2 = _interopRequireDefault(_actions);

var _lodash = require("devtools/client/shared/vendor/lodash");

var _Tab = require("./Tab");

var _Tab2 = _interopRequireDefault(_Tab);

var _Button = require("../shared/Button/index");

var _Dropdown = require("../shared/Dropdown");

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _AccessibleImage = require("../shared/AccessibleImage");

var _AccessibleImage2 = _interopRequireDefault(_AccessibleImage);

var _CommandBar = require("../SecondaryPanes/CommandBar");

var _CommandBar2 = _interopRequireDefault(_CommandBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Tabs extends _react.PureComponent {

  constructor(props) {
    super(props);

    this.updateHiddenTabs = () => {
      if (!this.refs.sourceTabs) {
        return;
      }
      const { selectedSource, tabSources, moveTab } = this.props;
      const sourceTabEls = this.refs.sourceTabs.children;
      const hiddenTabs = (0, _tabs.getHiddenTabs)(tabSources, sourceTabEls);

      if (selectedSource && (0, _ui.isVisible)() && hiddenTabs.find(tab => tab.id == selectedSource.id)) {
        return moveTab(selectedSource.url, 0);
      }

      this.setState({ hiddenTabs });
    };

    this.renderDropdownSource = source => {
      const { cx, selectSource } = this.props;
      const filename = (0, _source.getFilename)(source);

      const onClick = () => selectSource(cx, source.id);
      return _react2.default.createElement(
        "li",
        { key: source.id, onClick: onClick },
        _react2.default.createElement(_AccessibleImage2.default, {
          className: `dropdown-icon ${this.getIconClass(source)}`
        }),
        _react2.default.createElement(
          "span",
          { className: "dropdown-label" },
          filename
        )
      );
    };

    this.state = {
      dropdownShown: false,
      hiddenTabs: []
    };

    this.onResize = (0, _lodash.debounce)(() => {
      this.updateHiddenTabs();
    });
  }

  componentDidUpdate(prevProps) {
    if (!(prevProps === this.props)) {
      this.updateHiddenTabs();
    }
  }

  componentDidMount() {
    window.requestIdleCallback(this.updateHiddenTabs);
    window.addEventListener("resize", this.onResize);
    window.document.querySelector(".editor-pane").addEventListener("resizeend", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    window.document.querySelector(".editor-pane").removeEventListener("resizeend", this.onResize);
  }

  /*
   * Updates the hiddenSourceTabs state, by
   * finding the source tabs which are wrapped and are not on the top row.
   */


  toggleSourcesDropdown(e) {
    this.setState(prevState => ({
      dropdownShown: !prevState.dropdownShown
    }));
  }

  getIconClass(source) {
    if ((0, _source.isPretty)(source)) {
      return "prettyPrint";
    }
    if (source.isBlackBoxed) {
      return "blackBox";
    }
    return "file";
  }

  renderTabs() {
    const { tabSources } = this.props;
    if (!tabSources) {
      return;
    }

    return _react2.default.createElement(
      "div",
      { className: "source-tabs", ref: "sourceTabs" },
      tabSources.map((source, index) => _react2.default.createElement(_Tab2.default, { key: index, source: source }))
    );
  }

  renderDropdown() {
    const hiddenTabs = this.state.hiddenTabs;
    if (!hiddenTabs || hiddenTabs.length == 0) {
      return null;
    }

    const Panel = _react2.default.createElement(
      "ul",
      null,
      hiddenTabs.map(this.renderDropdownSource)
    );
    const icon = _react2.default.createElement(_AccessibleImage2.default, { className: "more-tabs" });

    return _react2.default.createElement(_Dropdown2.default, { panel: Panel, icon: icon });
  }

  renderCommandBar() {
    const { horizontal, endPanelCollapsed, isPaused } = this.props;
    if (!endPanelCollapsed || !isPaused) {
      return;
    }

    return _react2.default.createElement(_CommandBar2.default, { horizontal: horizontal });
  }

  renderStartPanelToggleButton() {
    return _react2.default.createElement(_Button.PaneToggleButton, {
      position: "start",
      collapsed: this.props.startPanelCollapsed,
      handleClick: this.props.togglePaneCollapse
    });
  }

  renderEndPanelToggleButton() {
    const { horizontal, endPanelCollapsed, togglePaneCollapse } = this.props;
    if (!horizontal) {
      return;
    }

    return _react2.default.createElement(_Button.PaneToggleButton, {
      position: "end",
      collapsed: endPanelCollapsed,
      handleClick: togglePaneCollapse,
      horizontal: horizontal
    });
  }

  render() {
    return _react2.default.createElement(
      "div",
      { className: "source-header" },
      this.renderStartPanelToggleButton(),
      this.renderTabs(),
      this.renderDropdown(),
      this.renderEndPanelToggleButton(),
      this.renderCommandBar()
    );
  }
} /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

const mapStateToProps = state => ({
  cx: (0, _selectors.getContext)(state),
  selectedSource: (0, _selectors.getSelectedSource)(state),
  tabSources: (0, _selectors.getSourcesForTabs)(state),
  isPaused: (0, _selectors.getIsPaused)(state, (0, _selectors.getCurrentThread)(state))
});

exports.default = (0, _connect.connect)(mapStateToProps, {
  selectSource: _actions2.default.selectSource,
  moveTab: _actions2.default.moveTab,
  closeTab: _actions2.default.closeTab,
  togglePaneCollapse: _actions2.default.togglePaneCollapse,
  showSource: _actions2.default.showSource
})(Tabs);