"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showEditorContextMenu = showEditorContextMenu;
exports.showEditorGutterContextMenu = showEditorGutterContextMenu;
loader.lazyRequireGetter(this, "_menu", "devtools/client/debugger/src/context-menu/menu");
loader.lazyRequireGetter(this, "_clipboard", "devtools/client/debugger/src/utils/clipboard");
loader.lazyRequireGetter(this, "_source", "devtools/client/debugger/src/utils/source");
loader.lazyRequireGetter(this, "_index", "devtools/client/debugger/src/utils/editor/index");
loader.lazyRequireGetter(this, "_utils", "devtools/client/debugger/src/utils/utils");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_asyncValue", "devtools/client/debugger/src/utils/async-value");
loader.lazyRequireGetter(this, "_editorBreakpoint", "devtools/client/debugger/src/actions/context-menus/editor-breakpoint");
loader.lazyRequireGetter(this, "_index2", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_continueToHere", "devtools/client/debugger/src/actions/pause/continueToHere");
loader.lazyRequireGetter(this, "_select", "devtools/client/debugger/src/actions/sources/select");
loader.lazyRequireGetter(this, "_ui", "devtools/client/debugger/src/actions/ui");
loader.lazyRequireGetter(this, "_blackbox", "devtools/client/debugger/src/actions/sources/blackbox");
loader.lazyRequireGetter(this, "_expressions", "devtools/client/debugger/src/actions/expressions");
loader.lazyRequireGetter(this, "_toolbox", "devtools/client/debugger/src/actions/toolbox");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
function showEditorContextMenu(event, editor, lineObject, location) {
  return async ({
    dispatch,
    getState
  }) => {
    const {
      source
    } = location;
    const state = getState();
    const blackboxedRanges = (0, _index2.getBlackBoxRanges)(state);
    const isPaused = (0, _index2.getIsCurrentThreadPaused)(state);
    const hasMappedLocation = (source.isOriginal || (0, _index2.isSourceWithMap)(state, source.id) || (0, _source.isPretty)(source)) && !(0, _index2.getPrettySource)(state, source.id);
    const isSourceOnIgnoreList = (0, _index2.isSourceMapIgnoreListEnabled)(state) && (0, _index2.isSourceOnSourceMapIgnoreList)(state, source);
    const editorWrappingEnabled = (0, _index2.getEditorWrapping)(state);
    (0, _menu.showMenu)(event, editorMenuItems({
      blackboxedRanges,
      hasMappedLocation,
      location,
      isPaused,
      editorWrappingEnabled,
      selectionText: editor.getSelectedText(),
      isTextSelected: editor.isTextSelected(),
      lineObject,
      isSourceOnIgnoreList,
      dispatch
    }));
  };
}

function showEditorGutterContextMenu(event, line, location, lineText) {
  return async ({
    dispatch,
    getState
  }) => {
    const {
      source
    } = location;
    const state = getState();
    const blackboxedRanges = (0, _index2.getBlackBoxRanges)(state);
    const isPaused = (0, _index2.getIsCurrentThreadPaused)(state);
    const isSourceOnIgnoreList = (0, _index2.isSourceMapIgnoreListEnabled)(state) && (0, _index2.isSourceOnSourceMapIgnoreList)(state, source);
    (0, _menu.showMenu)(event, [...(0, _editorBreakpoint.createBreakpointItems)(location, lineText, dispatch), {
      type: "separator"
    }, continueToHereItem(location, isPaused, dispatch), {
      type: "separator"
    }, blackBoxLineMenuItem(source, line, blackboxedRanges, isSourceOnIgnoreList, location.line, dispatch)]);
  };
} // Menu Items


const continueToHereItem = (location, isPaused, dispatch) => ({
  accesskey: L10N.getStr("editor.continueToHere.accesskey"),
  disabled: !isPaused,
  click: () => dispatch((0, _continueToHere.continueToHere)(location)),
  id: "node-menu-continue-to-here",
  label: L10N.getStr("editor.continueToHere.label")
});

const copyToClipboardItem = selectionText => ({
  id: "node-menu-copy-to-clipboard",
  label: L10N.getStr("copyToClipboard.label"),
  accesskey: L10N.getStr("copyToClipboard.accesskey"),
  disabled: selectionText.length === 0,
  click: () => (0, _clipboard.copyToTheClipboard)(selectionText)
});

const copySourceItem = selectedContent => ({
  id: "node-menu-copy-source",
  label: L10N.getStr("copySource.label"),
  accesskey: L10N.getStr("copySource.accesskey"),
  disabled: false,
  click: () => selectedContent.type === "text" && (0, _clipboard.copyToTheClipboard)(selectedContent.value)
});

const copySourceUri2Item = selectedSource => ({
  id: "node-menu-copy-source-url",
  label: L10N.getStr("copySourceUri2"),
  accesskey: L10N.getStr("copySourceUri2.accesskey"),
  disabled: !selectedSource.url,
  click: () => (0, _clipboard.copyToTheClipboard)((0, _source.getRawSourceURL)(selectedSource.url))
});

const jumpToMappedLocationItem = (location, hasMappedLocation, dispatch) => ({
  id: "node-menu-jump",
  label: L10N.getFormatStr("editor.jumpToMappedLocation1", location.source.isOriginal ? L10N.getStr("generated") : L10N.getStr("original")),
  accesskey: L10N.getStr("editor.jumpToMappedLocation1.accesskey"),
  disabled: !hasMappedLocation,
  click: () => dispatch((0, _select.jumpToMappedLocation)(location))
});

const showSourceMenuItem = (selectedSource, dispatch) => ({
  id: "node-menu-show-source",
  label: L10N.getStr("sourceTabs.revealInTree"),
  accesskey: L10N.getStr("sourceTabs.revealInTree.accesskey"),
  disabled: !selectedSource.url,
  click: () => dispatch((0, _ui.showSource)(selectedSource.id))
});

const blackBoxMenuItem = (selectedSource, blackboxedRanges, isSourceOnIgnoreList, dispatch) => {
  const isBlackBoxed = !!blackboxedRanges[selectedSource.url];
  return {
    id: "node-menu-blackbox",
    label: isBlackBoxed ? L10N.getStr("ignoreContextItem.unignore") : L10N.getStr("ignoreContextItem.ignore"),
    accesskey: isBlackBoxed ? L10N.getStr("ignoreContextItem.unignore.accesskey") : L10N.getStr("ignoreContextItem.ignore.accesskey"),
    disabled: isSourceOnIgnoreList || !(0, _source.shouldBlackbox)(selectedSource),
    click: () => dispatch((0, _blackbox.toggleBlackBox)(selectedSource))
  };
};

const blackBoxLineMenuItem = (selectedSource, {
  from,
  to
}, blackboxedRanges, isSourceOnIgnoreList, // the clickedLine is passed when the context menu
// is opened from the gutter, it is not available when the
// the context menu is opened from the editor.
clickedLine = null, dispatch) => {
  const startLine = clickedLine ?? (0, _index.toSourceLine)(selectedSource, from.line);
  const endLine = clickedLine ?? (0, _index.toSourceLine)(selectedSource, to.line);
  const blackboxRange = (0, _source.findBlackBoxRange)(selectedSource, blackboxedRanges, {
    start: startLine,
    end: endLine
  });
  const selectedLineIsBlackBoxed = !!blackboxRange;
  const isSingleLine = selectedLineIsBlackBoxed ? blackboxRange.start.line == blackboxRange.end.line : startLine == endLine;
  const isSourceFullyBlackboxed = blackboxedRanges[selectedSource.url] && !blackboxedRanges[selectedSource.url].length; // The ignore/unignore line context menu item should be disabled when
  // 1) The source is on the sourcemap ignore list
  // 2) The whole source is blackboxed or
  // 3) Multiple lines are blackboxed or
  // 4) Multiple lines are selected in the editor

  const shouldDisable = isSourceOnIgnoreList || isSourceFullyBlackboxed || !isSingleLine;
  return {
    id: "node-menu-blackbox-line",
    label: !selectedLineIsBlackBoxed ? L10N.getStr("ignoreContextItem.ignoreLine") : L10N.getStr("ignoreContextItem.unignoreLine"),
    accesskey: !selectedLineIsBlackBoxed ? L10N.getStr("ignoreContextItem.ignoreLine.accesskey") : L10N.getStr("ignoreContextItem.unignoreLine.accesskey"),
    disabled: shouldDisable,
    click: () => {
      const selectionRange = {
        start: {
          line: startLine,
          column: clickedLine == null ? from.ch : 0
        },
        end: {
          line: endLine,
          column: clickedLine == null ? to.ch : 0
        }
      };
      dispatch((0, _blackbox.toggleBlackBox)(selectedSource, !selectedLineIsBlackBoxed, selectedLineIsBlackBoxed ? [blackboxRange] : [selectionRange]));
    }
  };
};

const blackBoxLinesMenuItem = (selectedSource, {
  from,
  to
}, blackboxedRanges, isSourceOnIgnoreList, clickedLine, dispatch) => {
  const startLine = (0, _index.toSourceLine)(selectedSource, from.line);
  const endLine = (0, _index.toSourceLine)(selectedSource, to.line);
  const blackboxRange = (0, _source.findBlackBoxRange)(selectedSource, blackboxedRanges, {
    start: startLine,
    end: endLine
  });
  const selectedLinesAreBlackBoxed = !!blackboxRange;
  return {
    id: "node-menu-blackbox-lines",
    label: !selectedLinesAreBlackBoxed ? L10N.getStr("ignoreContextItem.ignoreLines") : L10N.getStr("ignoreContextItem.unignoreLines"),
    accesskey: !selectedLinesAreBlackBoxed ? L10N.getStr("ignoreContextItem.ignoreLines.accesskey") : L10N.getStr("ignoreContextItem.unignoreLines.accesskey"),
    disabled: isSourceOnIgnoreList,
    click: () => {
      const selectionRange = {
        start: {
          line: startLine,
          column: from.ch
        },
        end: {
          line: endLine,
          column: to.ch
        }
      };
      dispatch((0, _blackbox.toggleBlackBox)(selectedSource, !selectedLinesAreBlackBoxed, selectedLinesAreBlackBoxed ? [blackboxRange] : [selectionRange]));
    }
  };
};

const watchExpressionItem = (selectedSource, selectionText, dispatch) => ({
  id: "node-menu-add-watch-expression",
  label: L10N.getStr("expressions.label"),
  accesskey: L10N.getStr("expressions.accesskey"),
  click: () => dispatch((0, _expressions.addExpression)(selectionText))
});

const evaluateInConsoleItem = (selectedSource, selectionText, dispatch) => ({
  id: "node-menu-evaluate-in-console",
  label: L10N.getStr("evaluateInConsole.label"),
  click: () => dispatch((0, _toolbox.evaluateInConsole)(selectionText))
});

const downloadFileItem = (selectedSource, selectedContent) => ({
  id: "node-menu-download-file",
  label: L10N.getStr("downloadFile.label"),
  accesskey: L10N.getStr("downloadFile.accesskey"),
  click: () => (0, _utils.downloadFile)(selectedContent, selectedSource.shortName)
});

const inlinePreviewItem = dispatch => ({
  id: "node-menu-inline-preview",
  label: _prefs.features.inlinePreview ? L10N.getStr("inlinePreview.hide.label") : L10N.getStr("inlinePreview.show.label"),
  click: () => dispatch((0, _ui.toggleInlinePreview)(!_prefs.features.inlinePreview))
});

const editorWrappingItem = (editorWrappingEnabled, dispatch) => ({
  id: "node-menu-editor-wrapping",
  label: editorWrappingEnabled ? L10N.getStr("editorWrapping.hide.label") : L10N.getStr("editorWrapping.show.label"),
  click: () => dispatch((0, _ui.toggleEditorWrapping)(!editorWrappingEnabled))
});

function editorMenuItems({
  blackboxedRanges,
  location,
  selectionText,
  hasMappedLocation,
  isTextSelected,
  isPaused,
  editorWrappingEnabled,
  lineObject,
  isSourceOnIgnoreList,
  dispatch
}) {
  const items = [];
  const {
    source
  } = location;
  const content = source.content && (0, _asyncValue.isFulfilled)(source.content) ? source.content.value : null;
  items.push(jumpToMappedLocationItem(location, hasMappedLocation, dispatch), continueToHereItem(location, isPaused, dispatch), {
    type: "separator"
  }, copyToClipboardItem(selectionText), ...(!source.isWasm ? [...(content ? [copySourceItem(content)] : []), copySourceUri2Item(source)] : []), ...(content ? [downloadFileItem(source, content)] : []), {
    type: "separator"
  }, showSourceMenuItem(source, dispatch), {
    type: "separator"
  }, blackBoxMenuItem(source, blackboxedRanges, isSourceOnIgnoreList, dispatch));
  const startLine = (0, _index.toSourceLine)(source, lineObject.from.line);
  const endLine = (0, _index.toSourceLine)(source, lineObject.to.line); // Find any blackbox ranges that exist for the selected lines

  const blackboxRange = (0, _source.findBlackBoxRange)(source, blackboxedRanges, {
    start: startLine,
    end: endLine
  });
  const isMultiLineSelection = blackboxRange ? blackboxRange.start.line !== blackboxRange.end.line : startLine !== endLine; // When the range is defined and is an empty array,
  // the whole source is blackboxed

  const theWholeSourceIsBlackBoxed = blackboxedRanges[source.url] && !blackboxedRanges[source.url].length;

  if (!theWholeSourceIsBlackBoxed) {
    const blackBoxSourceLinesMenuItem = isMultiLineSelection ? blackBoxLinesMenuItem : blackBoxLineMenuItem;
    items.push(blackBoxSourceLinesMenuItem(source, lineObject, blackboxedRanges, isSourceOnIgnoreList, null, dispatch));
  }

  if (isTextSelected) {
    items.push({
      type: "separator"
    }, watchExpressionItem(source, selectionText, dispatch), evaluateInConsoleItem(source, selectionText, dispatch));
  }

  items.push({
    type: "separator"
  }, inlinePreviewItem(dispatch), editorWrappingItem(editorWrappingEnabled, dispatch));
  return items;
}