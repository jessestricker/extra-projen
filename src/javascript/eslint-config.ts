// https://github.com/eslint/rewrite/blob/main/packages/core/src/types.ts#L742

import { JsonValue } from "type-fest";

/**
 * An ESLint configuration object.
 *
 * @see https://eslint.org/docs/latest/use/configure/configuration-files#configuration-objects
 */
export interface EslintConfigObject {
  /**
   * A string to identify the configuration object. Used in error messages and
   * inspection tools.
   */
  readonly name?: string;

  /**
   * Path to the directory where the configuration object should apply.
   * `files` and `ignores` patterns in the configuration object are
   * interpreted as relative to this path.
   */
  readonly basePath?: string;

  /**
   * An array of glob patterns indicating the files that the configuration
   * object should apply to. If not specified, the configuration object applies
   * to all files
   */
  readonly files?: (string | string[])[];

  /**
   * An array of glob patterns indicating the files that the configuration
   * object should not apply to. If not specified, the configuration object
   * applies to all files matched by files
   */
  readonly ignores?: string[];

  /**
   * An object containing the configured rules. When files or ignores are specified,
   * these rule configurations are only available to the matching files.
   */
  readonly rules?: Record<string, EslintRuleConfig>;
}

// https://github.com/eslint/rewrite/blob/core-v1.1.1/packages/core/src/types.ts#L719
export type EslintRuleConfig =
  | EslintSeverity
  | readonly [EslintSeverity, ...JsonValue[]];

// https://github.com/eslint/rewrite/blob/core-v1.1.1/packages/core/src/types.ts#L675
export type EslintSeverity = "off" | "warn" | "error";
