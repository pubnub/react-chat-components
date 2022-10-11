"use strict";

var _jestHasteMap = require("jest-haste-map");

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
const { DuplicateHasteCandidatesError } = _jestHasteMap.ModuleMap;

class AmbiguousModuleResolutionError extends Error {
  // $FlowFixMe[value-as-type]
  constructor(
    fromModulePath, // $FlowFixMe[value-as-type]
    hasteError
  ) {
    super(
      `Ambiguous module resolution from \`${fromModulePath}\`: ` +
        hasteError.message
    );
    this.fromModulePath = fromModulePath;
    this.hasteError = hasteError;
  }
}

module.exports = AmbiguousModuleResolutionError;
