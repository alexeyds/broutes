import test from "enhanced-tape";
import { buildRoutesConfig, addScope } from "routes/routes_config";

function config() {
  return buildRoutesConfig(...arguments);
}

test("routes config", function(t) {
  t.test("buildRoutesConfig()", function(t) {
    t.test("basic usage", function(t) {
      t.same(config().scopes, []);
      t.same(config().routes, {});
      t.equal(config().host, undefined);
      t.equal(typeof config().singularizeResource, "function");
      t.equal(typeof config().guessRouteName, "function");
  
      t.end();
    });

    t.test("returns existing config unchanged", function(t) {
      let original = config();
      let newConfig = config(original);

      t.equal(newConfig, original);
    
      t.end();
    });

    t.test("{host} option", function(t) {
      t.equal(config({host: "foo.com"}).host, "foo.com");
    
      t.end();
    });

    t.test(".singularizeResource() is simpleSingularize by default", function(t) {
      t.equal(config().singularizeResource("users"), "user");
    
      t.end();
    });

    t.test("{singularizeResource} option", function(t) {
      let { singularizeResource } = config({singularizeResource: () => "person"});

      t.equal(singularizeResource("users"), "person");
    
      t.end();
    });

    t.test(".guessRouteName() converts path to name", function(t) {
      t.equal(config().guessRouteName("/users"), "users");
    
      t.end();
    });

    t.test(".guessRouteName() returns null if name can't be guessed", function(t) {
      t.equal(config().guessRouteName("/"), null);
    
      t.end();
    });

    t.test(".guessRouteName() camelizes path name", function(t) {
      t.equal(config().guessRouteName("/user_things"), "userThings");
    
      t.end();
    });
  });

  t.test("addScope()", function(t) {
    t.test("adds scope to existing config", function(t) {
      let original = config();
      let scoped = addScope(original, "foo");

      t.same(scoped.scopes, ["foo"]);
      t.equal(scoped.routes, original.routes);
  
      t.end();
    });

    t.test("adds nested scopes", function(t) {
      let scoped = addScope(addScope(config(), "foo"), "bar");

      t.same(scoped.scopes, ["foo", "bar"]);
    
      t.end();
    });
  });
});