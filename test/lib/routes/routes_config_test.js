import test from "enhanced-tape";
import { buildRoutesConfig } from "routes/routes_config";

function config() {
  return buildRoutesConfig(...arguments);
}

test("routes config", function(t) {
  t.test("#host", function(t) {
    t.equal(config().host, undefined, "undefined by default");
    t.equal(config({host: "foo.com"}).host, "foo.com", "can be set via named param");

    t.end();
  });

  t.test("#scopes", function(t) {
    t.same(config().scopes, [], "empty array by default");
    t.same(config({scopes: ["foo"]}).scopes, ["foo"], "can be set via named param");
  
    t.end();
  });

  t.test("#singularizeResource", function(t) {
    t.test("is simpleSingularize by default", function(t) {
      t.equal(config().singularizeResource("users"), "user");
    
      t.end();
    });

    t.test("can be set via named params", function(t) {
      let { singularizeResource } = config({singularizeResource: () => "person"});

      t.equal(singularizeResource("users"), "person");
    
      t.end();
    });
  });

  t.test("#guessRouteName", function(t) {
    t.test("converts path to name", function(t) {
      t.equal(config().guessRouteName("/users"), "users");
  
      t.end();
    });

    t.test("returns null if name can't be guessed", function(t) {
      t.equal(config().guessRouteName("/"), null);
    
      t.end();
    });

    t.test("camelizes path name", function(t) {
      t.equal(config().guessRouteName("/user_things"), "userThings");
    
      t.end();
    });
  });
});