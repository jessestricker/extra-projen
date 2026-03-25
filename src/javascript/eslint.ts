import { Component, FileBase, Task } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { EslintConfigObject } from "./eslint-config";
import { JavaScriptFile } from "./javascript-file";

export interface EslintOptions {
  /**
   * An array of files, directories or glob patterns on which to run ESLint.
   */
  readonly files: string[];

  /**
   * @default "^10"
   */
  readonly eslintVersion?: string;

  /**
   * @default false
   */
  readonly typescriptEslint?: boolean;

  /**
   * @default "^8"
   */
  readonly typescriptEslintVersion?: string;

  /**
   * @default false
   */
  readonly typescriptEslintStrict?: boolean;

  /**
   * @default false
   */
  readonly typescriptEslintStylistic?: boolean;

  /**
   * @default []
   */
  readonly extraConfig?: EslintConfigObject[];
}

export class Eslint extends Component {
  readonly files: string[];
  readonly typescriptEslint: boolean;
  readonly typescriptEslintStrict: boolean;
  readonly typescriptEslintStylistic: boolean;
  readonly extraConfig: EslintConfigObject[];

  readonly task: Task;
  readonly configFile: FileBase;

  constructor(project: NodeProject, options: EslintOptions) {
    super(project);

    this.files = options.files;
    this.typescriptEslint = options.typescriptEslint ?? false;
    this.typescriptEslintStrict = options.typescriptEslintStrict ?? false;
    this.typescriptEslintStylistic = options.typescriptEslintStylistic ?? false;
    this.extraConfig = options.extraConfig ?? [];

    const { eslintVersion = "^10", typescriptEslintVersion = "^8" } = options;

    this.task = project.addTask("eslint", {
      description: "Check project files with ESLint",
      exec: "eslint --fix src test .projenrc.ts",
      receiveArgs: true,
    });
    project.testTask.spawn(this.task);

    project.addDevDeps(
      `eslint@${eslintVersion}`,
      `@eslint/js@${eslintVersion}`,
      ...(this.typescriptEslint
        ? [`typescript-eslint@${typescriptEslintVersion}`]
        : []),
    );

    this.configFile = new JavaScriptFile(this, "eslint.config.mjs", {
      lines: this.renderConfig(),
    });
    project.npmignore?.exclude(this.configFile.path);
  }

  private renderConfig(): string[] {
    const lines: string[] = [];

    // imports
    lines.push(
      'import { defineConfig } from "eslint/config";',
      'import eslint from "@eslint/js";',
    );
    if (this.typescriptEslint) {
      lines.push('import tseslint from "typescript-eslint";');
    }

    lines.push("");
    lines.push("export default defineConfig([");

    lines.push("eslint.configs.recommended,");

    if (this.typescriptEslint) {
      if (this.typescriptEslintStrict) {
        lines.push("tseslint.configs.strict,");
      } else {
        lines.push("tseslint.configs.recommended,");
      }

      if (this.typescriptEslintStylistic) {
        lines.push("tseslint.configs.stylistic,");
      }
    }

    for (const extraConfigObject of this.extraConfig) {
      lines.push(JSON.stringify(extraConfigObject) + ",");
    }

    lines.push("]);");

    return lines;
  }
}
