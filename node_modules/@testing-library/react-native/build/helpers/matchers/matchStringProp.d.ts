import { TextMatch } from '../../matches';
/**
 * Matches the given string property again string or regex matcher.
 *
 * @param prop - The string prop to match.
 * @param matcher - The string or regex to match.
 * @returns - Whether the string prop matches the given string or regex.
 */
export declare function matchStringProp(prop: string | undefined, matcher: TextMatch): boolean;
