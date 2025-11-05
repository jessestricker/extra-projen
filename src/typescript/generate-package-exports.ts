import * as fs from "node:fs";
import * as path from "node:path";
import { Component } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { normalizePersistedPath } from "projen/lib/util";

export class GeneratePackageExports extends Component {
  constructor(project: TypeScriptProject) {
    super(project);

    const packageExports = generatePackageExports(
      project.srcdir,
      project.libdir,
    );

    project.package.addField("exports", packageExports);
  }
}

function generatePackageExports(
  srcDir: string,
  libDir: string,
): Record<string, string> {
  const searchRoot = srcDir;
  const searchPattern = path.join(searchRoot, "**", "index.ts");

  const indexFiles = fs.globSync(searchPattern, { withFileTypes: true });

  const exportEntries = indexFiles.map((indexFile) => {
    // parent directory of index file, relative to search root
    // e.g. "foo/bar" for "src/foo/bar/index.ts"
    const indexFileParent = path.relative(searchRoot, indexFile.parentPath);

    // compiled index file inside "lib" directory, relative to project dir
    // e.g "lib/foo/bar/index.js" for "src/foo/bar/index.ts"
    const compiledIndexFile = path.join(libDir, indexFileParent, "index.js");

    const exportName =
      indexFileParent === ""
        ? "."
        : "./" + normalizePersistedPath(indexFileParent);
    const exportValue = "./" + normalizePersistedPath(compiledIndexFile);

    return [exportName, exportValue];
  });
  return Object.fromEntries(exportEntries);
}
