import jutest from "jutest";
import { buildRoutesConfig, addScope } from "routes/routes_config";

function config() {
  return buildRoutesConfig(...arguments);
}

jutest("routes config", s => {
  s.describe("buildRoutesConfig()", s => {
    s.test("basic usage", t => {
      t.same(config().scopes, []);
      t.same(config().routes, {});
      t.equal(config().host, undefined);
      t.equal(typeof config().singularizeResource, "function");
      t.equal(typeof config().guessRouteName, "function");
    });

    s.test("returns existing config unchanged", t => {
      let original = config();
      let newConfig = config(original);

      t.equal(newConfig, original);
    });

    s.test("{host} option", t => {
      t.equal(config({host: "foo.com"}).host, "foo.com");
    });

    s.test(".singularizeResource() is simpleSingularize by default", t => {
      t.equal(config().singularizeResource("users"), "user");
    });

    s.test("{singularizeResource} option", t => {
      let { singularizeResource } = config({singularizeResource: () => "person"});

      t.equal(singularizeResource("users"), "person");
    });

    s.test(".guessRouteName() converts path to name", t => {
      t.equal(config().guessRouteName("/users"), "users");
    });

    s.test(".guessRouteName() returns null if name can't be guessed", t => {
      t.equal(config().guessRouteName("/"), null);
    });

    s.test(".guessRouteName() camelizes path name", t => {
      t.equal(config().guessRouteName("/user_things"), "userThings");
    });

    s.test(".guessRouteName() lowercases first letter", t => {
      t.equal(config().guessRouteName("/UserThings"), "userThings");
    });
  });

  s.describe("addScope()", s => {
    s.test("adds scope to existing config", t => {
      let original = config();
      let scoped = addScope(original, "foo");

      t.same(scoped.scopes, ["foo"]);
      t.equal(scoped.routes, original.routes);
    });

    s.test("adds nested scopes", t => {
      let scoped = addScope(addScope(config(), "foo"), "bar");

      t.same(scoped.scopes, ["foo", "bar"]);
    });
  });
});