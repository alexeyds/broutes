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
  });
});