import * as fs from "node:fs";
import * as dprintFormatter from "@dprint/formatter";
import * as dprintTypeScript from "@dprint/typescript";
import { IConstruct } from "constructs";
import { IResolver, TextFile, TextFileOptions } from "projen";

/**
 * The options for {@link JavaScriptFile}.
 */
export interface JavaScriptFileOptions extends TextFileOptions {
  /**
   * Whether to format the synthesized content.
   * @default true
   */
  readonly format?: boolean;
}

/**
 * A text file containing JavaScript (or TypeScript) code.
 *
 * Supports auto-formatting the synthesized content.
 */
export class JavaScriptFile extends TextFile {
  readonly format: boolean;

  constructor(
    scope: IConstruct,
    filePath: string,
    options: JavaScriptFileOptions = {},
  ) {
    super(scope, filePath, options);

    this.format = options.format ?? true;
  }

  protected override synthesizeContent(
    resolver: IResolver,
  ): string | undefined {
    let content = super.synthesizeContent(resolver);
    if (content === undefined) {
      return content;
    }

    if (this.marker) {
      content = `// ${this.marker}\n\n${content}`;
    }

    if (this.format) {
      content = formatTypeScript(content, this.path);
    }

    return content;
  }
}

let TYPESCRIPT_FORMATTER: dprintFormatter.Formatter | undefined = undefined;

/**
 * Formats TypeScript (and JavaScript) source code using [dprint](https://github.com/dprint/dprint-plugin-typescript).
 *
 * @param text The source code text to format.
 * @param filePath The path the file the source code is from. Only used for configuring the dprint formatter, does not need to actually exist.
 * @returns The formated source code.
 */
export function formatTypeScript(text: string, filePath: string): string {
  if (TYPESCRIPT_FORMATTER === undefined) {
    TYPESCRIPT_FORMATTER = dprintFormatter.createFromBuffer(
      fs.readFileSync(dprintTypeScript.getPath()),
    );
  }
  return TYPESCRIPT_FORMATTER.formatText({
    fileText: text,
    filePath,
  });
}
