import { Testing } from "projen";
import { NodeProject } from "projen/lib/javascript";
import { Prettier } from "../../src/javascript";

describe("Prettier", () => {
  it("matches snapshot", () => {
    const project = new NodeProject({
      name: "testing",
      defaultReleaseBranch: "main",
    });
    new Prettier(project);

    const snapshot = Testing.synth(project);
    expect(snapshot).toMatchSnapshot();
  });
});
