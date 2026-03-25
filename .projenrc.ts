import { ReleasableCommits, YamlFile } from "projen";
import { GithubCredentials } from "projen/lib/github";
import {
  NodePackageManager,
  NpmAccess,
  UpgradeDependenciesSchedule,
} from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { Eslint, Prettier } from "./src/javascript";
import { GeneratePackageExports } from "./src/typescript/generate-package-exports";

const project = new TypeScriptProject({
  // meta
  name: "extra-projen",
  description: "More projects and components for projen.",
  keywords: ["projen"],
  authorName: "Jesse Stricker",
  authorEmail: "git@jessestricker.de",
  packageName: "@jessestricker/extra-projen",
  npmAccess: NpmAccess.PUBLIC,

  // node package & dependencies
  packageManager: NodePackageManager.PNPM,
  peerDeps: ["constructs@^10", "projen@>=0.98.1 <1.0.0"],
  deps: ["@dprint/formatter", "@dprint/typescript", "type-fest"],

  // typescript
  tsconfig: { compilerOptions: { skipLibCheck: true } },

  // projen
  projenCommand: "pnpx projen",
  projenrcTs: true,
  sampleCode: false,

  // formatting & linting
  eslint: false,

  // git & github
  gitignore: [".idea/"],
  repository: "https://github.com/jessestricker/extra-projen.git",
  githubOptions: {
    mergify: false,
  },
  pullRequestTemplate: false,
  projenCredentials: GithubCredentials.fromApp(),
  workflowNodeVersion: "24",
  workflowPackageCache: true,
  depsUpgradeOptions: {
    workflowOptions: {
      assignees: ["jessestricker"],
      schedule: UpgradeDependenciesSchedule.WEEKLY,
    },
  },

  // releasing & publishing
  releasableCommits: ReleasableCommits.featuresAndFixes(),
  defaultReleaseBranch: "main",
  npmTrustedPublishing: true,
  releaseToNpm: true,
});

new Eslint(project, {
  files: [project.srcdir, project.testdir, ".projenrc.ts"],
  typescriptEslint: true,
  typescriptEslintStrict: true,
  typescriptEslintStylistic: true,
});

new Prettier(project, {
  yaml: true,
});

new GeneratePackageExports(project);

new YamlFile(project, "pnpm-workspace.yaml", {
  obj: {
    overrides: {
      "flatted@<3.4.2": "^3.4.2", // CVE-2026-33228
      "picomatch@<2.3.2": "^2.3.2", // CVE-2026-33671
    },
    strictPeerDependencies: true,
  },
});

project.synth();
