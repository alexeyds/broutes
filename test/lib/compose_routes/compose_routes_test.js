import test from "enhanced-tape";
import composeRoutes from "compose_routes";

test("composeRoutes:", function(t) {
  t.test("r.path()", function(t) {
    t.test("creates named route", function(t) {
      let routes = composeRoutes(r => r.path("user", "/users/:id"));

      t.equal(routes.userPath({id: 1}), "/users/1");
      t.equal(routes.userPath.raw, "/users/:id");
      t.equal(routes.userUrl({id: 1}), "/users/1");

      t.end();
    });

    t.test("accepts {defaultParams} option", function(t) {
      let routes = composeRoutes(r => r.path("user", "/users/:id", {defaultParams: {id: 1}}));

      t.equal(routes.userPath(), "/users/1");
    
      t.end();
    });

    t.test("supports path name in form of array", function(t) {
      let routes = composeRoutes(r => r.path(["api", "users"], "/users"));

      t.equal(routes.apiUsersPath(), "/users");

      t.end();
    });

    t.test("throws if routes with duplicate names would be added", function(t) {
      t.throws(() => {
        composeRoutes(r => {
          r.path("user", "/users/:id");
          r.path("user", "/user");
        });
      }, /unique/);

      t.end();
    });
  });

  t.test("r.scope()", function(t) {
    t.test("appends scope to all nested routes", function(t) {
      let routes = composeRoutes(r => {
        r.scope("/api", (r) => {
          r.path("users", "/users");
        });
      });

      t.equal(routes.usersPath(), "/api/users");
  
      t.end();
    });

    t.test("works with nested scopes", function(t) {
      let routes = composeRoutes(r => {
        r.scope("/api", (r) => {
          r.scope("/v1", r => {
            r.path("users", "/users");
          });
        });
      });

      t.equal(routes.usersPath(), "/api/v1/users");
    
      t.end();
    });

    t.test("applies {defaultParams} to every route in the scope", function(t) {
      let routes = composeRoutes(r => {
        r.scope("/:locale", (r) => {
          r.path("users", "/users");
        }, {defaultParams: {locale: "en"}});
      });

      t.equal(routes.usersPath(), "/en/users");
    
      t.end();
    });

    t.test("scope's {defaultParams} are merged into path's defaultParams", function(t) {
      let routes = composeRoutes(r => {
        r.scope("/:locale", (r) => {
          r.path("user", "/users/:id", {defaultParams: {id: 1}});
        }, {defaultParams: {locale: "en"}});
      });

      t.equal(routes.userPath(), "/en/users/1");
    
      t.end();
    });

    t.test("multiple scopes' {defaultParams} can be combined", function(t) {
      let routes = composeRoutes(r => {
        r.scope("/:locale", (r) => {
          r.scope("/:role", r => {
            r.path("users", "/users");
          }, {defaultParams: {role: "client"}});
        }, {defaultParams: {locale: "en"}});
      });

      t.equal(routes.usersPath(), "/en/client/users");
    
      t.end();
    });

    t.test("appends scope's {name} to each path helper", function(t) {
      let routes = composeRoutes(r => {
        r.scope("/api", (r) => {
          r.path("users", "/users");
        }, {name: "api"});
      });

      t.equal(routes.apiUsersPath(), "/api/users");
    
      t.end();
    });

    t.test("combines multiple scopes' {name}", function(t) {
      let routes = composeRoutes(r => {
        r.scope("/api", (r) => {
          r.scope("/v2", r => {
            r.path("users", "/users");
          }, {name: "v2"});
        }, {name: "api"});
      });

      t.equal(routes.apiV2UsersPath(), "/api/v2/users");
    
      t.end();
    });
  });

  t.test("r.resources()", function(t) {
    t.test("defines [index, show, edit, new] paths for resource", function(t) {
      let routes = composeRoutes(r => r.resources("users"));

      t.equal(routes.usersPath(), "/users");
      t.equal(routes.userPath({id: 1}), "/users/1");
      t.equal(routes.editUserPath({id: 1}), "/users/1/edit");
      t.equal(routes.newUserPath(), "/users/new");
  
      t.end();
    });

    t.test("has {name} option for route names", function(t) {
      let routes = composeRoutes(r => r.resources("user_roles", {name: "userRoles"}));

      t.equal(routes.userRolesPath(), "/user_roles");
      t.equal(routes.userRolePath({id: 1}), "/user_roles/1");
      t.equal(routes.editUserRolePath({id: 1}), "/user_roles/1/edit");
      t.equal(routes.newUserRolePath(), "/user_roles/new");
    
      t.end();
    });

    t.test("has {singularName} option for non-singleton resources", function(t) {
      let routes = composeRoutes(r => r.resources("people", {singularName: "person"}));

      t.equal(routes.peoplePath(), "/people");
      t.equal(routes.personPath({id: 1}), "/people/1");
    
      t.end();
    });

    t.test("has {param} option for non-singleton resources", function(t) {
      let routes = composeRoutes(r => r.resources("users", {param: "slug"}));

      t.equal(routes.userPath({slug: "user_0123"}), "/users/user_0123");
      t.equal(routes.editUserPath({slug: "user_0123"}), "/users/user_0123/edit");
    
      t.end();
    });

    t.test("has {except} option", function(t) {
      let routes = composeRoutes(r => r.resources("users", {except: ["index", "show"]}));

      t.equal(routes.usersPath, undefined);
      t.equal(routes.userPath, undefined);
      t.notEqual(routes.editUserPath, undefined);
  
      t.end();
    });

    t.test("has {only} option", function(t) {
      let routes = composeRoutes(r => r.resources("users", {only: ["index"]}));

      t.notEqual(routes.usersPath, undefined);
      t.equal(routes.userPath, undefined);
      t.equal(routes.editUserPath, undefined);
      t.equal(routes.newUserPath, undefined);
    
      t.end();
    });
  });

  t.test("r.resource()", function(t) {
    t.test("adds [show, edit, new] paths for resource", function(t) {
      let routes = composeRoutes(r => r.resource("user"));

      t.equal(routes.userPath(), "/user");
      t.equal(routes.editUserPath(), "/user/edit");
      t.equal(routes.newUserPath(), "/user/new");

      t.end();
    });

    t.test("has {name} option for route names", function(t) {
      let routes = composeRoutes(r => r.resource("user_role", {name: "userRole"}));

      t.equal(routes.userRolePath(), "/user_role");
    
      t.end();
    });
  });

  t.test("{host} option", function(t) {
    t.test("is appended to url", function(t) {
      let routes = composeRoutes(r => r.path("user", "/users/:id"), {host: "localhost:3000"});

      t.equal(routes.userUrl({id: 1}), "localhost:3000/users/1");
    
      t.end();
    });

    t.test("is respected in r.scope()", function(t) {
      let routes = composeRoutes(r => {
        r.scope("/api", (r) => {
          r.path("users", "/users");
        });
      }, {host: "localhost:3000"});

      t.equal(routes.usersUrl(), "localhost:3000/api/users");
    
      t.end();
    });
  });
});