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