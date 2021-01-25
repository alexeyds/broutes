import jutest from "jutest";
import PathCompiler from "route_utils/path_compiler";

jutest("PathCompiler", s => {
  s.describe("#toPath", s => {
    s.test("returns simple paths unmodified", t => {
      let compiler = new PathCompiler("/users");
      t.equal(compiler.toPath(), "/users");
    });

    s.test("inserts params into path", t => {
      let compiler = new PathCompiler("/:scope");
      t.equal(compiler.toPath({scope: "users"}), "/users");
    });

    s.test("inserts {defaultParams} into path", t => {
      let defaultParams = {scope: "users"};
      let compiler = new PathCompiler("/:scope", {defaultParams});

      t.equal(compiler.toPath(), "/users");
    });

    s.test("merges {defaultParams} into params", t => {
      let defaultParams = {scope: "users", slug: "jim"};
      let compiler = new PathCompiler("/:scope/:slug", {defaultParams});

      t.equal(compiler.toPath({slug: "john"}), "/users/john");
    });

    s.test("resolves functional params", t => {
      let defaultParams = {scope: () => "users"};
      let compiler = new PathCompiler("/:scope/:slug", {defaultParams});

      t.equal(compiler.toPath({slug: () => "john"}), "/users/john");
    });
  });
});