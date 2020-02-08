import test from "enhanced-tape";
import { buildRoutesConfig } from "routes/routes_config";
import { buildScope } from "routes/scope";
import { buildPath as doBuildPath } from "routes/path";

function buildPath(path, pathConfig={}, routesConfig=buildRoutesConfig()) {
  return doBuildPath(path, pathConfig, routesConfig);
}

test("buildPath", function(t) {
  t.test("#toPath()", function(t) {
    t.test("returns simple paths unmodified", function(t) {
      let path = buildPath("/users");

      t.equal(path.toPath(), "/users");
    
      t.end();
    });

    t.test("inserts params into path", function(t) {
      let path = buildPath("/users/:id");

      t.equal(path.toPath({id: 1}), "/users/1");
    
      t.end();
    });

    t.test("inserts {defaultParams} into path", function(t) {
      let path = buildPath("/users/:id", {defaultParams: {id: 1}});

      t.equal(path.toPath(), "/users/1");
    
      t.end();
    });

    t.test("prepends routeConfig's {scopes} to the path", function(t) {
      let scopes = [buildScope("/api"), buildScope("/v1")];
      let path = buildPath("/users", {}, buildRoutesConfig({ scopes }));

      t.equal(path.toPath(), "/api/v1/users");
    
      t.end();
    });

    t.test("merges {scopes}' defaultParams with own defaultParams", function(t) {
      let scopes = [
        buildScope("/:scope", {defaultParams: {scope: "api"}}), 
        buildScope("/:version", {defaultParams: {version: "v1"}})
      ];
      let path = buildPath("/users", {}, buildRoutesConfig({ scopes }));

      t.equal(path.toPath(), "/api/v1/users");
    
      t.end();
    });

    t.test("accepts {query} option", function(t) {
      let path = buildPath("/users");
      let query = {id: 1, name: "John"};

      t.equal(path.toPath({}, {query}), "/users?id=1&name=John");
    
      t.end();
    });

    t.test("has .rawPath attribute", function(t) {
      let path = buildPath("/:scope");

      t.equal(path.toPath.rawPath, "/:scope");
    
      t.end();
    });
  });

  t.test("#toUrl()", function(t) {
    t.test("behaves like toPath by default", function(t) {
      let path = buildPath("/users/:id");

      t.equal(path.toUrl({id: 1}), "/users/1");
  
      t.end();
    });

    t.test("prepends routesConfig's {host} to path", function(t) {
      let path = buildPath("/users", {}, buildRoutesConfig({host: "test.com"}));

      t.equal(path.toUrl(), "test.com/users");
    
      t.end();
    });
  });

  t.test("#name", function(t) {
    t.test("guesses name from path", function(t) {
      let path = buildPath("/users");

      t.equal(path.name, "users");
    
      t.end();
    });

    t.test("throws if name cannot be guessed from the path", function(t) {
      t.throws(() => {
        buildPath("/");
      }, /name/);
    
      t.end();
    });

    t.test("allows specifying {name} via config option", function(t) {
      let path = buildPath("/users", {name: "people"});

      t.equal(path.name, "people");
    
      t.end();
    });

    t.test("prepends {scopes}' names to path name", function(t) {
      let scopes = [buildScope("/api", {name: "api"})];
      let path = buildPath("/users", {}, buildRoutesConfig({ scopes }));

      t.equal(path.name, "apiUsers");
    
      t.end();
    });

    t.test("ignores {scopes} with empty names", function(t) {
      let scopes = [buildScope("/api", {name: "api"}), buildScope("/v1")];
      let path = buildPath("/users", {}, buildRoutesConfig({ scopes }));

      t.equal(path.name, "apiUsers");
    
      t.end();
    });
  });
});