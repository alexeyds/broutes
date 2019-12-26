import test from "enhanced-tape";
import composeRoutes from "compose_routes";

test("composeRoutes", function(t) {
  t.test("r.path()", function(t) {
    t.test("creates named route", function(t) {
      let routes = composeRoutes(r => r.path("user", "/users/:id"));

      t.equal(routes.userPath({id: 1}), "/users/1");
      t.equal(routes.userPath.raw, "/users/:id");
      t.equal(routes.userUrl({id: 1}), "/users/1");
      t.equal(routes.userUrl.raw, "/users/:id");

      t.end();
    });

    t.test("accepts {defaultParams} option", function(t) {
      let routes = composeRoutes(r => r.path("user", "/users/:id", {defaultParams: {id: 1}}));

      t.equal(routes.userPath(), "/users/1");
    
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

    t.test("scope's {defaultParams} are merged into path's", function(t) {
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
  });
});