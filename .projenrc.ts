import { JsiiProject } from "projen/lib/cdk";
import { GithubCredentials } from "projen/lib/github";
import { NodePackageManager, NpmAccess } from "projen/lib/javascript";
import { Prettier } from "./src/javascript/prettier";
import { GeneratePackageExports } from "./src/typescript/generate-package-exports";

const project = new JsiiProject({
  // meta
  name: "extra-projen",
  description: "More projects and components for projen.",
  keywords: ["projen"],
  author: "Jesse Stricker",
  authorAddress: "git@jessestricker.de",
  packageName: "@jessestricker/extra-projen",
  npmAccess: NpmAccess.PUBLIC,

  // node package & dependencies
  packageManager: NodePackageManager.PNPM,
  peerDeps: ["constructs@^10", "projen@>=0.98.1 <1.0.0"],
  jsiiVersion: "~5.9.0",
  docgen: false,

  // projen
  projenCommand: "pnpx projen",
  projenrcTs: true,
  sampleCode: false,

  // formatting & linting
  eslintOptions: { dirs: ["src"], prettier: true },

  // git & github
  gitignore: [".idea/"],
  repositoryUrl: "https://github.com/jessestricker/extra-projen.git",
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
