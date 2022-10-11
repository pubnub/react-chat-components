"use strict";

var _jestHasteMap = _interopRequireDefault(require("jest-haste-map"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
// $FlowFixMe: Types for `jest-haste-map`
const ci = require("ci-info");

const path = require("path");

const JEST_HASTE_MAP_CACHE_BREAKER = 5;

function getIgnorePattern(config) {
  // For now we support both options
  const { blockList, blacklistRE } = config.resolver;
  const ignorePattern = blacklistRE || blockList; // If neither option has been set, use default pattern

  if (!ignorePattern) {
    return / ^/;
  }

  const combine = (regexes) =>
    new RegExp(
      regexes
        .map((regex) => "(" + regex.source.replace(/\//g, path.sep) + ")")
        .join("|")
    ); // If ignorePattern is an array, merge it into one

  if (Array.isArray(ignorePattern)) {
    return combine(ignorePattern);
  }

  return ignorePattern;
}

function createHasteMap(config, options) {
  var _options$name, _options$throwOnModul;

  const dependencyExtractor =
    (options === null || options === void 0
      ? void 0
      : options.extractDependencies) === false
      ? null
      : config.resolver.dependencyExtractor;
  const computeDependencies = dependencyExtractor != null;
  const hasteConfig = {
    cacheDirectory: config.hasteMapCacheDirectory,
    computeDependencies,
    computeSha1: true,
    dependencyExtractor: config.resolver.dependencyExtractor,
    extensions: config.resolver.sourceExts.concat(config.resolver.assetExts),
    forceNodeFilesystemAPI: !config.resolver.useWatchman,
    hasteImplModulePath: config.resolver.hasteImplModulePath,
    hasteMapModulePath: config.resolver.unstable_hasteMapModulePath,
    ignorePattern: getIgnorePattern(config),
    maxWorkers: config.maxWorkers,
    mocksPattern: "",
    name: `${
      (_options$name =
        options === null || options === void 0 ? void 0 : options.name) !==
        null && _options$name !== void 0
        ? _options$name
        : "metro"
    }-${JEST_HASTE_MAP_CACHE_BREAKER}`,
    platforms: config.resolver.platforms,
    retainAllFiles: true,
    resetCache: config.resetCache,
    rootDir: config.projectRoot,
    roots: config.watchFolders,
    throwOnModuleCollision:
      (_options$throwOnModul =
        options === null || options === void 0
          ? void 0
          : options.throwOnModuleCollision) !== null &&
      _options$throwOnModul !== void 0
        ? _options$throwOnModul
        : true,
    useWatchman: config.resolver.useWatchman,
    watch:
      (options === null || options === void 0 ? void 0 : options.watch) == null
        ? !ci.isCI
        : options.watch,
  };
  return _jestHasteMap.default.create(hasteConfig);
}

module.exports = createHasteMap;
