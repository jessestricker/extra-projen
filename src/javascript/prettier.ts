import { Task } from "projen";
import {
  Prettier as BuiltinPrettier,
  NodeProject,
  PrettierOptions,
} from "projen/lib/javascript";

/**
 * Extends the builtin {@link BuiltinPrettier|prettier} component:
 *
 * - Ignores the Node.js package manager lockfile.
 * - Ignores all projen-managed files.
 * - Adds a `prettier` task and runs it as part of the `test` task.
 */
export class Prettier extends BuiltinPrettier {
  readonly task: Task;

  constructor(project: NodeProject, options: PrettierOptions) {
    super(project, options);

    // ignore package lockfile
    this.addIgnorePattern("/" + project.package.lockFile);

    // add prettier task and spawn as part of test task
    this.task = project.addTask("prettier", {
      exec: "prettier --write .",
      description: "Format project files with prettier",
    });
    project.testTask.spawn(this.task);
  }

  override preSynthesize(): void {
    // ignore all projen-managed files
    for (const file of this.project.files) {
      this.addIgnorePattern("/" + file.path);
    }
  }
}
