import path from "node:path";
import { Component, JsonFile, Task } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";

/**
 * The options for {@link ApiExtractor}.
 * @public
 */
export interface ApiExtractorOptions {
  /**
   * @defaultValue `"^7"`
   */
  readonly apiExtractorVersion?: string;

  /**
   * @defaultValue A `.d.ts` file path, based on the Node package's entrypoint.
   */
  readonly mainEntryPointFilePath?: string;

  /**
   * @defaultValue The unscoped package name.
   */
  readonly reportFileName?: string;

  /**
   * @defaultValue `"etc"`
   */
  readonly reportFolder?: string;

  /**
   * @defaultValue see {@link https://github.com/microsoft/rushstack/blob/main/apps/api-extractor/src/schemas/api-extractor-defaults.json}.
   */
  readonly extractorMessageReporting?: Record<
    string,
    {
      readonly logLevel?: "error" | "warning" | "none";
      readonly addToApiReportFile?: boolean;
    }
  >;
}

/**
 * Runs api-extractor.
 *
 * api-extractor is a tool which generated an API report from the compiled `.d.ts` files of your project.
 * This API report can then be used as a snapshot of the current public API.
 * During code review, this can help verify whether all proposed changes to the API are intended.
 *
 * In addition, api-extractor generates warnings for missing exports, unknown TSDoc tags and more.
 * @public
 */
export class ApiExtractor extends Component {
  readonly mainEntryPointFilePath: string;
  readonly reportFile: string;
  readonly task: Task;
  readonly configFile: JsonFile;

  constructor(project: TypeScriptProject, options: ApiExtractorOptions = {}) {
    super(project);
    const {
      apiExtractorVersion = "^7",
      reportFileName = unscopedPackageName(project.package.packageName),
      reportFolder = "etc",
      extractorMessageReporting,
    } = options;

    this.mainEntryPointFilePath =
      options.mainEntryPointFilePath ??
      defaultTypingsFile(project.package.entrypoint);
    this.reportFile = path.join(reportFolder, reportFileName + ".api.md");

    project.addDevDeps(`@microsoft/api-extractor@${apiExtractorVersion}`);

    this.configFile = new JsonFile(this, "api-extractor.jsonc", {
      obj: {
        mainEntryPointFilePath: this.mainEntryPointFilePath,
        newlineKind: "lf",
        apiReport: {
          enabled: true,
          reportFileName,
          reportFolder,
        },
        docModel: {
          enabled: false,
        },
        dtsRollup: {
          enabled: false,
        },
        messages: {
          compilerMessageReporting: {
            default: {
              logLevel: "warning",
            },
          },
          extractorMessageReporting,
          tsdocMessageReporting: {
            default: {
              logLevel: "warning",
            },
          },
        },
      },
    });

    this.task = project.addTask("api-extractor", {
      description: "Generate the API report with api-extractor",
      steps: [
        { spawn: project.compileTask.name },
        { exec: "mkdir --parents etc" },
        {
          exec: `api-extractor run --config ${this.configFile.path} --local --verbose`,
        },
      ],
    });
    project.testTask.spawn(this.task);

    project.addGitIgnore("/temp/");
    project.addPackageIgnore("/temp/");
    project.addPackageIgnore(this.configFile.path);
  }
}

function defaultTypingsFile(entrypoint: string): string {
  return path.join(
    path.dirname(entrypoint),
    path.basename(entrypoint, ".js") + ".d.ts",
  );
}

function unscopedPackageName(packageName: string): string {
  const delimiterIndex = packageName.indexOf("/");
  if (delimiterIndex === -1) {
    return packageName;
  }
  return packageName.slice(delimiterIndex + 1);
}
