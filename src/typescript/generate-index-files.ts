import * as fs from "node:fs";
import path from "node:path";
import { Component } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { JavaScriptFile } from "../javascript";

/**
 * @public
 */
export class GenerateIndexFiles extends Component {
  constructor(project: TypeScriptProject) {
    super(project);

    this.generateIndexFile(project.srcdir);
  }

  private generateIndexFile(dir: string) {
    const indexFile = new JavaScriptFile(this, path.join(dir, "index.ts"));

    const entries = fs.readdirSync(dir, {
      encoding: "utf-8",
      withFileTypes: true,
    });
    for (const entry of entries) {
      const name = entry.name;
      if (name === "index.ts") {
        continue;
      }

      if (entry.isDirectory()) {
        this.generateIndexFile(path.join(entry.parentPath, name));

        indexFile.addLine(`export * as ${name} from "./${name}";`);
      } else {
        const nameWithoutExt = path.parse(name).name;
        indexFile.addLine(`export * from "./${nameWithoutExt}";`);
      }
    }
  }
}
