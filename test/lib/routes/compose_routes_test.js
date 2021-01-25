import jutest from "jutest";
import composeRoutes from "routes/compose_routes";

jutest("composeRoutes", s => {
  s.describe("r.route()", s => {
    s.test("creates a named route", t => {
      let routes = composeRoutes(r => {
        r.route("/users");
      });

      t.equal(routes.usersPath(), "/users");
      t.equal(routes.usersUrl(), "/users");
    });

    s.test("accepts routes config", t => {
      let routes = composeRoutes(r => {
        r.route("/users");
      }, {host: "test.com"});

      t.equal(routes.usersUrl(), "test.com/users");
    });

    s.test("accepts options for route", t => {
      let routes = composeRoutes(r => {
        r.route("/users", {name: "clients"});
      });

      t.equal(routes.clientsPath(), "/users");
    });

    s.test("throws if route with same name already exists", t => {
      t.throws(() => {
        composeRoutes(r => {
          r.route("/users");
          r.route("/users");
        });
      }, /unique/);
    });
  });

  s.describe("r.scope()", s => {
    s.test("is appended to all nested routes", t => {
      let routes = composeRoutes(r => {
        r.scope("/api", r => {
          r.route("/users");
        });
      });

      t.equal(routes.usersPath(), "/api/users");
    });

    s.test("accepts options for scope", t => {
      let routes = composeRoutes(r => {
        r.scope("/api", r => {
          r.route("/users");
        }, {name: "api"});
      });

      t.equal(routes.apiUsersPath(), "/api/users");
    });
  });

  s.describe("r.resources()", s => {
    s.test("adds routes for RESTful resources", t => {
      let routes = composeRoutes(r => {
        r.resources("/users");
      });

      t.equal(routes.usersPath(), "/users");
      t.equal(routes.userPath({id: 1}), "/users/1");
    });

    s.test("accepts options for routes", t => {
      let routes = composeRoutes(r => {
        r.resources("/users", {name: "clients"});
      });

      t.equal(routes.clientsPath(), "/users");
    });
  });
});