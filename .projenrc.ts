import { ReleasableCommits } from "projen";
import { JsiiProject } from "projen/lib/cdk";
import { GithubCredentials } from "projen/lib/github";
import { NodePackageManager, NpmAccess } from "projen/lib/javascript";
import { ReleaseTrigger } from "projen/lib/release";
import { Prettier } from "./src/javascript/prettier";

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

  // formatting & linting
  eslintOptions: { dirs: ["src"], prettier: true },

  // github
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
  releaseTrigger: ReleaseTrigger.manual(),
  releasableCommits: ReleasableCommits.featuresAndFixes(),
  npmTrustedPublishing: true,
  releaseToNpm: true,
});

new Prettier(project, { yaml: true });

project.synth();
