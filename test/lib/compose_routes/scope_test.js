import test from "enhanced-tape";
import composeRoutes from "compose_routes";

test("composeRoutes:", function(t) {
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
});