"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateInlinePreview = generateInlinePreview;

var _lodash = require("devtools/client/shared/vendor/lodash");

loader.lazyRequireGetter(this, "_selectors", "devtools/client/debugger/src/selectors/index");
loader.lazyRequireGetter(this, "_prefs", "devtools/client/debugger/src/utils/prefs");
loader.lazyRequireGetter(this, "_context", "devtools/client/debugger/src/utils/context");

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */
// We need to display all variables in the current functional scope so
// include all data for block scopes until the first functional scope
function getLocalScopeLevels(originalAstScopes) {
  let levels = 0;

  while (originalAstScopes[levels] && originalAstScopes[levels].type === "block") {
    levels++;
  }

  return levels;
}

function generateInlinePreview(cx, frame) {
  return async function ({
    dispatch,
    getState,
    parser,
    client
  }) {
    if (!frame || !_prefs.features.inlinePreview) {
      return;
    }

    const {
      thread
    } = cx; // Avoid regenerating inline previews when we already have preview data

    if ((0, _selectors.getInlinePreviews)(getState(), thread, frame.id)) {
      return;
    }

    const originalFrameScopes = (0, _selectors.getOriginalFrameScope)(getState(), thread, frame.location.sourceId, frame.id);
    const generatedFrameScopes = (0, _selectors.getGeneratedFrameScope)(getState(), thread, frame.id);
    let scopes = (originalFrameScopes === null || originalFrameScopes === void 0 ? void 0 : originalFrameScopes.scope) || (generatedFrameScopes === null || generatedFrameScopes === void 0 ? void 0 : generatedFrameScopes.scope);

    if (!scopes || !scopes.bindings) {
      return;
    } // It's important to use selectedLocation, because we don't know
    // if we'll be viewing the original or generated frame location


    const selectedLocation = (0, _selectors.getSelectedLocation)(getState());

    if (!selectedLocation) {
      return;
    }

    const originalAstScopes = await parser.getScopes(selectedLocation);
    (0, _context.validateThreadContext)(getState(), cx);

    if (!originalAstScopes) {
      return;
    }

    const allPreviews = [];
    const pausedOnLine = selectedLocation.line;
    const levels = getLocalScopeLevels(originalAstScopes);

    for (let curLevel = 0; curLevel <= levels && scopes && scopes.bindings; curLevel++) {
      const bindings = { ...scopes.bindings.variables
      };
      scopes.bindings.arguments.forEach(argument => {
        Object.keys(argument).forEach(key => {
          bindings[key] = argument[key];
        });
      });
      const previewBindings = Object.keys(bindings).map(async name => {
        // We want to show values of properties of objects only and not
        // function calls on other data types like someArr.forEach etc..
        let properties = null;
        const objectFront = bindings[name].value;

        if (objectFront.actorID && objectFront.class === "Object") {
          properties = await client.loadObjectProperties({
            name,
            path: name,
            contents: {
              value: objectFront
            }
          });
        }

        const previewsFromBindings = getBindingValues(originalAstScopes, pausedOnLine, name, bindings[name].value, curLevel, properties);
        allPreviews.push(...previewsFromBindings);
      });
      await Promise.all(previewBindings);
      scopes = scopes.parent;
    }

    const previews = {};
    const sortedPreviews = (0, _lodash.sortBy)(allPreviews, ["line", "column"]);
    sortedPreviews.forEach(preview => {
      const {
        line
      } = preview;

      if (!previews[line]) {
        previews[line] = [preview];
      } else {
        previews[line].push(preview);
      }
    });
    return dispatch({
      type: "ADD_INLINE_PREVIEW",
      thread,
      frame,
      previews
    });
  };
}

function getBindingValues(originalAstScopes, pausedOnLine, name, value, curLevel, properties) {
  var _originalAstScopes$cu;

  const previews = [];
  const binding = (_originalAstScopes$cu = originalAstScopes[curLevel]) === null || _originalAstScopes$cu === void 0 ? void 0 : _originalAstScopes$cu.bindings[name];

  if (!binding) {
    return previews;
  } // Show a variable only once ( an object and it's child property are
  // counted as different )


  const identifiers = new Set(); // We start from end as we want to show values besides variable
  // located nearest to the breakpoint

  for (let i = binding.refs.length - 1; i >= 0; i--) {
    const ref = binding.refs[i]; // Subtracting 1 from line as codemirror lines are 0 indexed

    const line = ref.start.line - 1;
    const column = ref.start.column; // We don't want to render inline preview below the paused line

    if (line >= pausedOnLine - 1) {
      continue;
    }

    const {
      displayName,
      displayValue
    } = getExpressionNameAndValue(name, value, ref, properties); // Variable with same name exists, display value of current or
    // closest to the current scope's variable

    if (identifiers.has(displayName)) {
      continue;
    }

    identifiers.add(displayName);
    previews.push({
      line,
      column,
      name: displayName,
      value: displayValue
    });
  }

  return previews;
}

function getExpressionNameAndValue(name, value, // TODO: Add data type to ref
ref, properties) {
  let displayName = name;
  let displayValue = value; // Only variables of type Object will have properties

  if (properties) {
    let {
      meta
    } = ref; // Presence of meta property means expression contains child property
    // reference eg: objName.propName

    while (meta) {
      var _displayValue, _displayValue$preview;

      // Initially properties will be an array, after that it will be an object
      if (displayValue === value) {
        const property = properties.find(prop => prop.name === meta.property);
        displayValue = property === null || property === void 0 ? void 0 : property.contents.value;
        displayName += `.${meta.property}`;
      } else if ((_displayValue = displayValue) === null || _displayValue === void 0 ? void 0 : (_displayValue$preview = _displayValue.preview) === null || _displayValue$preview === void 0 ? void 0 : _displayValue$preview.ownProperties) {
        const {
          ownProperties
        } = displayValue.preview;
        Object.keys(ownProperties).forEach(prop => {
          if (prop === meta.property) {
            displayValue = ownProperties[prop].value;
            displayName += `.${meta.property}`;
          }
        });
      }

      meta = meta.parent;
    }
  }

  return {
    displayName,
    displayValue
  };
}