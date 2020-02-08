import test from "enhanced-tape";
import PathCompiler from "route_utils/path_compiler";

test("PathCompiler", function(t) {
  t.test("#toPath", function(t) {
    t.test("returns simple paths unmodified", function(t) {
      let compiler = new PathCompiler("/users");

      t.equal(compiler.toPath(), "/users");

      t.end();
    });

    t.test("inserts params into path", function(t) {
      let compiler = new PathCompiler("/:scope");

      t.equal(compiler.toPath({scope: "users"}), "/users");

      t.end();
    });

    t.test("inserts {defaultParams} into path", function(t) {
      let defaultParams = {scope: "users"};
      let compiler = new PathCompiler("/:scope", {defaultParams});

      t.equal(compiler.toPath(), "/users");
    
      t.end();
    });

    t.test("merges {defaultParams} into params", function(t) {
      let defaultParams = {scope: "users", slug: "jim"};
      let compiler = new PathCompiler("/:scope/:slug", {defaultParams});

      t.equal(compiler.toPath({slug: "john"}), "/users/john");
    
      t.end();
    });

    t.test("resolves functional params", function(t) {
      let defaultParams = {scope: () => "users"};
      let compiler = new PathCompiler("/:scope/:slug", {defaultParams});

      t.equal(compiler.toPath({slug: () => "john"}), "/users/john");
    
      t.end();
    });
  });
});