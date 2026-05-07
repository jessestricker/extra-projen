import { Testing } from "projen";
import { TypeScriptProject } from "projen/lib/typescript";
import { ApiExtractor } from "../../src/typescript";

describe("ApiExtractor", () => {
  let project: TypeScriptProject;

  beforeEach(() => {
    project = new TypeScriptProject({
      name: "testing",
      defaultReleaseBranch: "main",
    });
  });

  it("matches snapshot", () => {
    new ApiExtractor(project);

    const snapshot = Testing.synth(project);

    expect(snapshot).toMatchSnapshot();
  });
});
