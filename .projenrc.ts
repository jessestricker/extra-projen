import { GithubCredentials } from "projen/lib/github";
import { NodePackageManager, NpmAccess } from "projen/lib/javascript";
import { TypeScriptProject } from "projen/lib/typescript";
import { Prettier } from "./src/javascript/prettier";
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
  deps: ["@dprint/formatter", "@dprint/typescript"],

  // typescript
  tsconfig: { compilerOptions: { skipLibCheck: true } },

  // projen
  projenCommand: "pnpx projen",
  projenrcTs: true,
  sampleCode: false,

  // formatting & linting
  eslintOptions: { dirs: ["src"], prettier: true },

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

  // releasing & publishing
  defaultReleaseBranch: "main",
  npmTrustedPublishing: true,
  releaseToNpm: true,
});

new Prettier(project, { yaml: true });
new GeneratePackageExports(project);

project.synth();
