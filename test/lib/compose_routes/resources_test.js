import test from "enhanced-tape";
import composeRoutes from "compose_routes";

test("composeRoutes:", function(t) {
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
});