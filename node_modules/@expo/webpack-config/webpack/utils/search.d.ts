/// <reference types="webpack-dev-server" />
import { Configuration, Entry, Plugin, Rule, RuleSetCondition, RuleSetLoader, RuleSetRule, RuleSetUse, RuleSetUseItem } from 'webpack';
import { DevConfiguration } from '../types';
declare type AnyConfiguration = Configuration | DevConfiguration;
interface RuleItem {
    rule: RuleSetRule;
    index: number;
}
declare type ResolvedRuleSet = string | RuleSetLoader;
interface PluginItem {
    plugin: Plugin;
    index: number;
}
interface LoaderItem {
    rule: RuleSetRule;
    ruleIndex: number;
    loader: RuleSetUseItem;
    loaderIndex: number;
}
/**
 *
 * @param loaderName
 * @param rules
 * @category utils
 */
export declare function findLoader(loaderName: string, rules: RuleSetRule[]): RuleSetRule | null;
/**
 *
 * @param rules
 * @category utils
 */
export declare function getRulesAsItems(rules: RuleSetRule[]): RuleItem[];
/**
 *
 * @param config
 * @category utils
 */
export declare function getRules(config: AnyConfiguration): RuleItem[];
/**
 * Get the babel-loader rule created by `@expo/webpack-config/loaders`
 *
 * @param config
 * @category utils
 */
export declare function getExpoBabelLoader(config: AnyConfiguration): Rule | null;
/**
 *
 * @param rules
 * @category utils
 */
export declare function getRulesFromRules(rules: RuleSetRule[]): RuleSetRule[];
/**
 *
 * @param rules
 * @category utils
 */
export declare function getLoadersFromRules(rules: RuleItem[]): LoaderItem[];
/**
 *
 * @param config
 * @category utils
 */
export declare function getLoaders(config: AnyConfiguration): LoaderItem[];
/**
 *
 * @param config
 * @param files
 * @category utils
 */
export declare function getRulesByMatchingFiles(config: AnyConfiguration, files: string[]): {
    [key: string]: RuleItem[];
};
/**
 *
 * @param config
 * @param files
 * @category utils
 */
export declare function rulesMatchAnyFiles(config: AnyConfiguration, files: string[]): boolean;
/**
 *
 * @param rule
 * @category utils
 */
export declare function resolveRuleSetUse(rule?: RuleSetUse | RuleSetUse[]): ResolvedRuleSet[];
/**
 *
 * @param condition
 * @param file
 * @category utils
 */
export declare function conditionMatchesFile(condition: RuleSetCondition | undefined, file: string): boolean;
/**
 *
 * @param param0
 * @category utils
 */
export declare function getPlugins({ plugins }: AnyConfiguration): PluginItem[];
/**
 *
 * @param config
 * @param name
 * @category utils
 */
export declare function getPluginsByName(config: AnyConfiguration, name: string): PluginItem[];
/**
 *
 * @param loader
 * @category utils
 */
export declare function isRuleSetItem(loader: RuleSetUse): loader is RuleSetUseItem;
/**
 *
 * @param loader
 * @category utils
 */
export declare function isRuleSetLoader(loader: RuleSetUse): loader is RuleSetLoader;
/**
 *
 * @param arg
 * @category utils
 */
export declare function isEntry(arg: any): arg is Entry;
/**
 *
 * @param arg
 * @category utils
 */
export declare function resolveEntryAsync(arg: any): Promise<Entry>;
export {};
