import test from "enhanced-tape";
import { buildRoutesConfig } from "routes/routes_config";
import { buildScope } from "routes/scope";
import { buildRoute as doBuildRoute } from "routes/route";

function buildRoute(path, pathConfig={}, routesConfig=buildRoutesConfig()) {
  return doBuildRoute(path, pathConfig, routesConfig);
}

test("buildRoute", function(t) {
  t.test("#toPath()", function(t) {
    t.test("returns simple paths unmodified", function(t) {
      let route = buildRoute("/users");

      t.equal(route.toPath(), "/users");
    
      t.end();
    });

    t.test("inserts params into path", function(t) {
      let route = buildRoute("/users/:id");

      t.equal(route.toPath({id: 1}), "/users/1");
    
      t.end();
    });

    t.test("inserts {defaultParams} into path", function(t) {
      let route = buildRoute("/users/:id", {defaultParams: {id: 1}});

      t.equal(route.toPath(), "/users/1");
    
      t.end();
    });

    t.test("prepends routeConfig's {scopes} to the path", function(t) {
      let scopes = [buildScope("/api"), buildScope("/v1")];
      let route = buildRoute("/users", {}, buildRoutesConfig({ scopes }));

      t.equal(route.toPath(), "/api/v1/users");
    
      t.end();
    });

    t.test("merges {scopes}' defaultParams with own defaultParams", function(t) {
      let scopes = [
        buildScope("/:scope", {defaultParams: {scope: "api"}}), 
        buildScope("/:version", {defaultParams: {version: "v1"}})
      ];
      let route = buildRoute("/users", {}, buildRoutesConfig({ scopes }));

      t.equal(route.toPath(), "/api/v1/users");
    
      t.end();
    });

    t.test("accepts {query} option", function(t) {
      let route = buildRoute("/users");
      let query = {id: 1, name: "John"};

      t.equal(route.toPath({}, {query}), "/users?id=1&name=John");
    
      t.end();
    });

    t.test("has .rawPath attribute", function(t) {
      let route = buildRoute("/:scope");

      t.equal(route.toPath.rawPath, "/:scope");
    
      t.end();
    });
  });

  t.test("#toUrl()", function(t) {
    t.test("behaves like toPath by default", function(t) {
      let route = buildRoute("/users/:id");

      t.equal(route.toUrl({id: 1}), "/users/1");
  
      t.end();
    });

    t.test("prepends routesConfig's {host} to path", function(t) {
      let route = buildRoute("/users", {}, buildRoutesConfig({host: "test.com"}));

      t.equal(route.toUrl(), "test.com/users");
    
      t.end();
    });
  });

  t.test("#name", function(t) {
    t.test("guesses name from path", function(t) {
      let route = buildRoute("/users");

      t.equal(route.name, "users");
    
      t.end();
    });

    t.test("throws if name cannot be guessed from the path", function(t) {
      t.throws(() => {
        buildRoute("/");
      }, /name/);
    
      t.end();
    });

    t.test("allows specifying {name} via config option", function(t) {
      let route = buildRoute("/users", {name: "people"});

      t.equal(route.name, "people");
    
      t.end();
    });

    t.test("prepends {scopes}' names to path name", function(t) {
      let scopes = [buildScope("/api", {name: "api"})];
      let route = buildRoute("/users", {}, buildRoutesConfig({ scopes }));

      t.equal(route.name, "apiUsers");
    
      t.end();
    });

    t.test("ignores {scopes} with empty names", function(t) {
      let scopes = [buildScope("/api", {name: "api"}), buildScope("/v1")];
      let route = buildRoute("/users", {}, buildRoutesConfig({ scopes }));

      t.equal(route.name, "apiUsers");
    
      t.end();
    });
  });
});