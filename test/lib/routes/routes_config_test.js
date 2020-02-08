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

  t.test("#guessPathName", function(t) {
    t.test("converts path to name", function(t) {
      t.equal(config().guessPathName("/users"), "users");
  
      t.end();
    });

    t.test("returns null if name can't be guessed", function(t) {
      t.equal(config().guessPathName("/"), null);
    
      t.end();
    });

    t.test("camelizes path name by default", function(t) {
      t.equal(config().guessPathName("/user_things"), "userThings");
    
      t.end();
    });

    t.test("doesn't camelize name if {camelizeDefaultPathNames} is false", function(t) {
      t.equal(config({camelizeDefaultPathNames: false}).guessPathName("/user_things"), "user_things");
    
      t.end();
    });
  });
});