"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEntryAsync = exports.isEntry = exports.isRuleSetLoader = exports.isRuleSetItem = exports.getPluginsByName = exports.getPlugins = exports.conditionMatchesFile = exports.resolveRuleSetUse = exports.rulesMatchAnyFiles = exports.getRulesByMatchingFiles = exports.getLoaders = exports.getLoadersFromRules = exports.getRulesFromRules = exports.getExpoBabelLoader = exports.getRules = exports.getRulesAsItems = exports.findLoader = void 0;
/**
 * Loader flattening inspired by:
 * https://github.com/preactjs/preact-cli-experiment/tree/7b80623/packages/cli-plugin-legacy-config
 */
const util_1 = require("util");
/**
 *
 * @param loaderName
 * @param rules
 * @category utils
 */
function findLoader(loaderName, rules) {
    for (const rule of rules) {
        if (rule.use &&
            rule.use.loader &&
            (rule.use.loader.includes(`/${loaderName}`) ||
                rule.use.loader.includes(`\\${loaderName}`))) {
            return rule;
        }
    }
    return null;
}
exports.findLoader = findLoader;
/**
 *
 * @param rules
 * @category utils
 */
function getRulesAsItems(rules) {
    return rules.map((rule, index) => ({
        index,
        rule,
    }));
}
exports.getRulesAsItems = getRulesAsItems;
/**
 *
 * @param config
 * @category utils
 */
function getRules(config) {
    const { rules = [] } = config.module || {};
    return getRulesAsItems(getRulesFromRules(rules));
}
exports.getRules = getRules;
/**
 * Get the babel-loader rule created by `@expo/webpack-config/loaders`
 *
 * @param config
 * @category utils
 */
function getExpoBabelLoader(config) {
    var _a, _b;
    const { rules = [] } = config.module || {};
    const currentRules = getRulesAsItems(getRulesFromRules(rules));
    for (const ruleItem of currentRules) {
        const rule = ruleItem.rule;
        if (rule.use &&
            typeof rule.use === 'object' &&
            ((_b = (_a = rule.use.options) === null || _a === void 0 ? void 0 : _a.caller) === null || _b === void 0 ? void 0 : _b.__dangerous_rule_id) === 'expo-babel-loader') {
            return rule;
        }
    }
    return null;
}
exports.getExpoBabelLoader = getExpoBabelLoader;
/**
 *
 * @param rules
 * @category utils
 */
function getRulesFromRules(rules) {
    const output = [];
    for (const rule of rules) {
        if (rule.oneOf) {
            output.push(...getRulesFromRules(rule.oneOf));
        }
        else {
            output.push(rule);
        }
    }
    return output;
}
exports.getRulesFromRules = getRulesFromRules;
/**
 *
 * @param rules
 * @category utils
 */
function getLoadersFromRules(rules) {
    const loaders = rules.map(({ rule, index: ruleIndex }) => {
        if (rule.oneOf) {
            return getLoadersFromRules(getRulesAsItems(rule.oneOf));
        }
        return loaderToLoaderItemLoaderPart(rule.loaders || rule.loader || rule.use).map(loader => ({
            ...loader,
            rule,
            ruleIndex,
        }));
    });
    return loaders.reduce((arr, a) => arr.concat(a), []);
}
exports.getLoadersFromRules = getLoadersFromRules;
/**
 *
 * @param config
 * @category utils
 */
function getLoaders(config) {
    const rules = getRules(config);
    return getLoadersFromRules(rules);
}
exports.getLoaders = getLoaders;
function loaderToLoaderItemLoaderPart(loader) {
    if (!loader)
        return [];
    const loaders = [];
    if (typeof loader === 'function') {
        loaders.push(...loaderToLoaderItemLoaderPart(loader({})));
    }
    else if (isRuleSetItem(loader)) {
        loaders.push({ loader, loaderIndex: -1 });
    }
    else if (Array.isArray(loader)) {
        loaders.push(...loader.map((loader, loaderIndex) => ({ loader, loaderIndex })));
    }
    return loaders;
}
/**
 *
 * @param config
 * @param files
 * @category utils
 */
function getRulesByMatchingFiles(config, files) {
    const rules = getRules(config);
    const selectedRules = {};
    for (const file of files) {
        selectedRules[file] = rules.filter(({ rule }) => conditionMatchesFile(rule.test, file));
    }
    return selectedRules;
}
exports.getRulesByMatchingFiles = getRulesByMatchingFiles;
/**
 *
 * @param config
 * @param files
 * @category utils
 */
function rulesMatchAnyFiles(config, files) {
    const rules = getRulesByMatchingFiles(config, files);
    return Object.keys(rules).some(filename => !!rules[filename].length);
}
exports.rulesMatchAnyFiles = rulesMatchAnyFiles;
/**
 *
 * @param rule
 * @category utils
 */
function resolveRuleSetUse(rule) {
    if (!rule)
        return [];
    if (Array.isArray(rule)) {
        const rules = rule;
        let resolved = [];
        for (const rule of rules) {
            resolved = [...resolved, ...resolveRuleSetUse(rule)];
        }
        return resolved;
    }
    else if (typeof rule === 'string' || isRuleSetLoader(rule)) {
        return [rule];
    }
    else if (typeof rule === 'function') {
        return resolveRuleSetUse(rule({}));
    }
    return [rule];
}
exports.resolveRuleSetUse = resolveRuleSetUse;
/**
 *
 * @param condition
 * @param file
 * @category utils
 */
function conditionMatchesFile(condition, file) {
    if (!condition)
        return false;
    if ((0, util_1.isRegExp)(condition)) {
        return condition.test(file);
    }
    else if (typeof condition === 'string') {
        return file.startsWith(condition);
    }
    else if (typeof condition === 'function') {
        return Boolean(condition(file));
    }
    else if (Array.isArray(condition)) {
        return condition.some(c => conditionMatchesFile(c, file));
    }
    return Object.entries(condition)
        .map(([key, value]) => {
        switch (key) {
            case 'test':
                return conditionMatchesFile(value, file);
            case 'include':
                return conditionMatchesFile(value, file);
            case 'exclude':
                return !conditionMatchesFile(value, file);
            case 'and':
                return value.every(c => conditionMatchesFile(c, file));
            case 'or':
                return value.some(c => conditionMatchesFile(c, file));
            case 'not':
                return value.every(c => !conditionMatchesFile(c, file));
            default:
                return true;
        }
    })
        .every(b => b);
}
exports.conditionMatchesFile = conditionMatchesFile;
/**
 *
 * @param param0
 * @category utils
 */
function getPlugins({ plugins = [] }) {
    return plugins.map((plugin, index) => ({ index, plugin }));
}
exports.getPlugins = getPlugins;
/**
 *
 * @param config
 * @param name
 * @category utils
 */
function getPluginsByName(config, name) {
    return getPlugins(config).filter(({ plugin }) => {
        if (plugin && plugin.constructor) {
            return plugin.constructor.name === name;
        }
        return false;
    });
}
exports.getPluginsByName = getPluginsByName;
/**
 *
 * @param loader
 * @category utils
 */
function isRuleSetItem(loader) {
    return typeof loader === 'string' || typeof loader === 'function' || isRuleSetLoader(loader);
}
exports.isRuleSetItem = isRuleSetItem;
/**
 *
 * @param loader
 * @category utils
 */
function isRuleSetLoader(loader) {
    return Object.keys(loader).some(k => ['loader', 'options', 'indent', 'query'].includes(k));
}
exports.isRuleSetLoader = isRuleSetLoader;
/**
 *
 * @param arg
 * @category utils
 */
function isEntry(arg) {
    if (typeof arg !== 'object' || arg === null) {
        return false;
    }
    return Object.values(arg).every(value => {
        if (Array.isArray(value)) {
            return value.every(value => typeof value === 'string');
        }
        return typeof value === 'string';
    });
}
exports.isEntry = isEntry;
/**
 *
 * @param arg
 * @category utils
 */
async function resolveEntryAsync(arg) {
    if (typeof arg === 'undefined') {
        throw new Error('Webpack config entry cannot be undefined');
    }
    if (typeof arg === 'function') {
        return resolveEntryAsync(await arg());
    }
    else if (typeof arg === 'string') {
        return resolveEntryAsync([arg]);
    }
    else if (Array.isArray(arg)) {
        return {
            app: arg,
        };
    }
    else if (isEntry(arg)) {
        return arg;
    }
    throw new Error('Cannot resolve Webpack config entry prop: ' + arg);
}
exports.resolveEntryAsync = resolveEntryAsync;
//# sourceMappingURL=search.js.map