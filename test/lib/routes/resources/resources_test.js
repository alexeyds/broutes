import test from "enhanced-tape";
import { buildRoutesConfig } from "routes/routes_config";
import { buildResources as doBuildResources} from "routes/resources";

function buildResources(name, resourcesConfig={}, routesConfig=buildRoutesConfig()) {
  return extractResources(doBuildResources(name, resourcesConfig, routesConfig));
}

function extractResources(resources) {
  let paths = {};
  resources.forEach(path => {
    paths[path.name] = path.toPath;
  });

  return paths;
}

test("buildResources", function(t) {
  t.test("non-singleton resources", function(t) {
    t.test("defines [index, show, edit, new]", function(t) {
      let resources = buildResources("/users");

      t.equal(resources.users(), "/users");
      t.equal(resources.user({id: 1}), "/users/1");
      t.equal(resources.newUser(), "/users/new");
      t.equal(resources.editUser({id: 1}), "/users/1/edit");

      t.end();
    });

    t.test("supports resources options", function(t) {
      let resources = buildResources("/users", {param: "slug", name: "people", singularName: "person"});

      t.equal(resources.people(), "/users");
      t.equal(resources.person({slug: "john"}), "/users/john");
    
      t.end();
    });

    t.test("supports {exclude} and {only} options", function(t) {
      let resources = buildResources("/users", {only: ["index"]});

      t.true(resources.users);
      t.false(resources.user);
    
      t.end();
    });
  });

  t.test("singleton resources", function(t) {
    t.test("defines [show, edit, new] paths", function(t) {
      let resources = buildResources("/user", {singleton: true});

      t.equal(resources.user(), "/user");
      t.equal(resources.newUser(), "/user/new");
      t.equal(resources.editUser(), "/user/edit");
    
      t.end();
    });

    t.test("supports {exclude} and {only} options", function(t) {
      let resources = buildResources("/user", {only: ["show"], singleton: true});

      t.true(resources.user);
      t.false(resources.editUser);
    
      t.end();
    });
  });
});