import jutest from "jutest";
import { buildRoutesConfig, addScope } from "routes/routes_config";
import { buildScope } from "routes/scope";
import { buildRoute as doBuildRoute } from "routes/route";

function buildRoute(path, pathConfig={}, routesConfig=buildRoutesConfig()) {
  return doBuildRoute(path, pathConfig, routesConfig);
}

function routesConfigWithScopes(scopes) {
  let config = buildRoutesConfig();

  scopes.forEach(scope => {
    config = addScope(config, scope);
  });

  return config;
}

jutest("buildRoute", s => {
  s.describe("#toPath()", s => {
    s.test("returns simple paths unmodified", t => {
      let route = buildRoute("/users");

      t.equal(route.toPath(), "/users");
    });

    s.test("inserts params into path", t => {
      let route = buildRoute("/users/:id");

      t.equal(route.toPath({id: 1}), "/users/1");
    });

    s.test("inserts {defaultParams} into path", t => {
      let route = buildRoute("/users/:id", {defaultParams: {id: 1}});

      t.equal(route.toPath(), "/users/1");
    });

    s.test("prepends routeConfig's {scopes} to the path", t => {
      let scopes = [buildScope("/api"), buildScope("/v1")];
      let route = buildRoute("/users", {}, routesConfigWithScopes(scopes));

      t.equal(route.toPath(), "/api/v1/users");
    });

    s.test("merges {scopes}' defaultParams with own defaultParams", t => {
      let scopes = [
        buildScope("/:scope", {defaultParams: {scope: "api"}}), 
        buildScope("/:version", {defaultParams: {version: "v1"}})
      ];
      let route = buildRoute("/users", {}, routesConfigWithScopes(scopes));

      t.equal(route.toPath(), "/api/v1/users");
    });

    s.test("accepts {query} option", t => {
      let route = buildRoute("/users");
      let query = {id: 1, name: "John"};

      t.equal(route.toPath({}, {query}), "/users?id=1&name=John");
    });

    s.test("has .raw attribute", t => {
      let route = buildRoute("/:scope");

      t.equal(route.toPath.raw, "/:scope");
    });
  });

  s.describe("#toUrl()", s => {
    s.test("behaves like toPath by default", t => {
      let route = buildRoute("/users/:id");

      t.equal(route.toUrl({id: 1}), "/users/1");
    });

    s.test("prepends routesConfig's {host} to path", t => {
      let route = buildRoute("/users", {}, buildRoutesConfig({host: "test.com"}));

      t.equal(route.toUrl(), "test.com/users");
    });
  });

  s.describe("#name", s => {
    s.test("guesses name from path", t => {
      let route = buildRoute("/users");

      t.equal(route.name, "users");
    });

    s.test("throws if name cannot be guessed from the path", t => {
      t.throws(() => {
        buildRoute("/");
      }, /name/);
    });

    s.test("allows specifying {name} via config option", t => {
      let route = buildRoute("/users", {name: "people"});

      t.equal(route.name, "people");
    });

    s.test("prepends {scopes}' names to path name", t => {
      let scopes = [buildScope("/api", {name: "api"})];
      let route = buildRoute("/users", {}, routesConfigWithScopes(scopes));

      t.equal(route.name, "apiUsers");
    });

    s.test("ignores {scopes} with empty names", t => {
      let scopes = [buildScope("/api", {name: "api"}), buildScope("/v1")];
      let route = buildRoute("/users", {}, routesConfigWithScopes(scopes));

      t.equal(route.name, "apiUsers");
    });
  });
});