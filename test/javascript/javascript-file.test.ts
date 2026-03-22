import { Project, Testing } from "projen";
import { JavaScriptFile } from "../../src/javascript";

describe("JavaScriptFile", () => {
  let project: Project;

  beforeEach(() => {
    project = new Project({
      name: "testing",
    });
  });

  it("matches snapshot", () => {
    new JavaScriptFile(project, "test.js", {
      lines: ["   const   a =   1.234  ; "],
    });

    const snapshot = Testing.synth(project);

    expect(snapshot["test.js"]).toMatchSnapshot();
  });

  it("formats code", () => {
    const file = new JavaScriptFile(project, "test.js", {
      lines: ["   const   a =   1.234  ; "],
    });

    const snapshot = Testing.synth(project);

    expect(snapshot["test.js"]).toBe(`// ${file.marker}

const a = 1.234;
`);
  });

  it("doesnt format code when disabled", () => {
    const file = new JavaScriptFile(project, "test.js", {
      lines: ["   const   a =   1.234  ;"],
      format: false,
    });

    const snapshot = Testing.synth(project);

    expect(snapshot["test.js"]).toBe(`// ${file.marker}

   const   a =   1.234  ;`);
  });
});
