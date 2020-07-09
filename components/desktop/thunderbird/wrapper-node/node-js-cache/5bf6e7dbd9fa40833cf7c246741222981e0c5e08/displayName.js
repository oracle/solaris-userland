"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.simplifyDisplayName = simplifyDisplayName;
exports.formatDisplayName = formatDisplayName;
exports.formatCopyName = formatCopyName;

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// eslint-disable-next-line max-len
// Decodes an anonymous naming scheme that
// spider monkey implements based on "Naming Anonymous JavaScript Functions"
// http://johnjbarton.github.io/nonymous/index.html
const objectProperty = /([\w\d\$]+)$/;
const arrayProperty = /\[(.*?)\]$/;
const functionProperty = /([\w\d]+)[\/\.<]*?$/;
const annonymousProperty = /([\w\d]+)\(\^\)$/;

function simplifyDisplayName(displayName) {
  // if the display name has a space it has already been mapped
  if (!displayName || /\s/.exec(displayName)) {
    return displayName;
  }

  const scenarios = [objectProperty, arrayProperty, functionProperty, annonymousProperty];

  for (const reg of scenarios) {
    const match = reg.exec(displayName);

    if (match) {
      return match[1];
    }
  }

  return displayName;
}

const displayNameMap = {
  Babel: {
    tryCatch: "Async"
  },
  Backbone: {
    "extend/child": "Create Class",
    ".create": "Create Model"
  },
  jQuery: {
    "jQuery.event.dispatch": "Dispatch Event"
  },
  React: {
    // eslint-disable-next-line max-len
    "ReactCompositeComponent._renderValidatedComponentWithoutOwnerOrContext/renderedElement<": "Render",
    _renderValidatedComponentWithoutOwnerOrContext: "Render"
  },
  VueJS: {
    "renderMixin/Vue.prototype._render": "Render"
  },
  Webpack: {
    // eslint-disable-next-line camelcase
    __webpack_require__: "Bootstrap"
  }
};

function mapDisplayNames(frame, library) {
  var _displayNameMap$libra;

  const {
    displayName
  } = frame;
  return ((_displayNameMap$libra = displayNameMap[library]) === null || _displayNameMap$libra === void 0 ? void 0 : _displayNameMap$libra[displayName]) || displayName;
}

function getFrameDisplayName(frame) {
  const {
    displayName,
    originalDisplayName,
    userDisplayName,
    name
  } = frame;
  return originalDisplayName || userDisplayName || displayName || name;
}

function formatDisplayName(frame, {
  shouldMapDisplayName = true
} = {}, l10n) {
  const {
    library
  } = frame;
  let displayName = getFrameDisplayName(frame);

  if (library && shouldMapDisplayName) {
    displayName = mapDisplayNames(frame, library);
  }

  return simplifyDisplayName(displayName) || l10n.getStr("anonymousFunction");
}

function formatCopyName(frame, l10n) {
  const displayName = formatDisplayName(frame, undefined, l10n);

  if (!frame.source) {
    throw new Error("no frame source");
  }

  const fileName = frame.source.url || frame.source.id;
  const frameLocation = frame.location.line;
  return `${displayName} (${fileName}#${frameLocation})`;
}