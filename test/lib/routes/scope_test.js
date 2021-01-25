import jutest from "jutest";
import { buildScope } from "routes/scope";

jutest("buildScope", s => {
  s.test("creates scope with given path", t => {
    let scope = buildScope("/api");

    t.equal(scope.path, "/api");
    t.equal(scope.name, undefined);
    t.equal(scope.defaultParams, undefined);
  });

  s.test("accepts {name} and {defaultParams}", t => {
    let scope = buildScope("/api", {name: "api", defaultParams: {foo: "bar"}});

    t.equal(scope.name, "api");
    t.same(scope.defaultParams, {foo: "bar"});
  });
});