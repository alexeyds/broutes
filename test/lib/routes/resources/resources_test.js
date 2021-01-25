import jutest from "jutest";
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

jutest("buildResources", s => {
  s.describe("non-singleton resources", s => {
    s.test("defines [index, show, edit, new]", t => {
      let resources = buildResources("/users");

      t.equal(resources.users(), "/users");
      t.equal(resources.user({id: 1}), "/users/1");
      t.equal(resources.newUser(), "/users/new");
      t.equal(resources.editUser({id: 1}), "/users/1/edit");
    });

    s.test("supports resources options", t => {
      let resources = buildResources("/users", {param: "slug", name: "people", singularName: "person"});

      t.equal(resources.people(), "/users");
      t.equal(resources.person({slug: "john"}), "/users/john");
    });

    s.test("supports {exclude} and {only} options", t => {
      let resources = buildResources("/users", {only: ["index"]});

      t.assert(resources.users);
      t.refute(resources.user);
    });
  });

  s.describe("singleton resources", s => {
    s.test("defines [show, edit, new] paths", t => {
      let resources = buildResources("/user", {singleton: true});

      t.equal(resources.user(), "/user");
      t.equal(resources.newUser(), "/user/new");
      t.equal(resources.editUser(), "/user/edit");
    });

    s.test("supports {exclude} and {only} options", t => {
      let resources = buildResources("/user", {only: ["show"], singleton: true});

      t.assert(resources.user);
      t.refute(resources.editUser);
    });
  });
});