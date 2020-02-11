import test from "enhanced-tape";
import composeRoutes from "routes/compose_routes";

test("composeRoutes", function(t) {
  t.test("r.route()", function(t) {
    t.test("creates a named route", function(t) {
      let routes = composeRoutes(r => {
        r.route("/users");
      });

      t.equal(routes.usersPath(), "/users");
      t.equal(routes.usersUrl(), "/users");
    
      t.end();
    });

    t.test("accepts routes config", function(t) {
      let routes = composeRoutes(r => {
        r.route("/users");
      }, {host: "test.com"});

      t.equal(routes.usersUrl(), "test.com/users");
    
      t.end();
    });

    t.test("accepts options for route", function(t) {
      let routes = composeRoutes(r => {
        r.route("/users", {name: "clients"});
      });

      t.equal(routes.clientsPath(), "/users");
    
      t.end();
    });

    t.test("throws if route with same name already exists", function(t) {
      t.throws(() => {
        composeRoutes(r => {
          r.route("/users");
          r.route("/users");
        });
      }, /unique/);
    
      t.end();
    });
  });

  t.test("r.scope()", function(t) {
    t.test("is appended to all nested routes", function(t) {
      let routes = composeRoutes(r => {
        r.scope("/api", r => {
          r.route("/users");
        });
      });

      t.equal(routes.usersPath(), "/api/users");
  
      t.end();
    });

    t.test("accepts options for scope", function(t) {
      let routes = composeRoutes(r => {
        r.scope("/api", r => {
          r.route("/users");
        }, {name: "api"});
      });

      t.equal(routes.apiUsersPath(), "/api/users");
    
      t.end();
    });
  });

  t.test("r.resources()", function(t) {
    t.test("adds routes for RESTful resources", function(t) {
      let routes = composeRoutes(r => {
        r.resources("/users");
      });

      t.equal(routes.usersPath(), "/users");
      t.equal(routes.userPath({id: 1}), "/users/1");
    
      t.end();
    });

    t.test("accepts options for routes", function(t) {
      let routes = composeRoutes(r => {
        r.resources("/users", {name: "clients"});
      });

      t.equal(routes.clientsPath(), "/users");
    
      t.end();
    });
  });
});