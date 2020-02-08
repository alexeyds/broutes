import test from "enhanced-tape";
import { buildScope } from "routes/scope";

test("buildScope", function(t) {
  t.test("creates scope with given path", function(t) {
    let scope = buildScope("/api");

    t.equal(scope.path, "/api");
    t.equal(scope.name, undefined);
    t.equal(scope.defaultParams, undefined);
  
    t.end();
  });

  t.test("accepts {name} and {defaultParams}", function(t) {
    let scope = buildScope("/api", {name: "api", defaultParams: {foo: "bar"}});

    t.equal(scope.name, "api");
    t.same(scope.defaultParams, {foo: "bar"});
  
    t.end();
  });
});