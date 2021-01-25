import jutest from "jutest";
import { buildRoutesConfig } from "routes/routes_config";
import { getResourceAttributes as doGetResourceAttributes, pickActions } from "routes/resources/resource_helpers";

function getResourceAttributes(path, resourceConfig={}, routesConfig=buildRoutesConfig()) {
  return doGetResourceAttributes(path, resourceConfig, routesConfig);
}

jutest("resource helpers", s => {
  s.describe("getResourceAttributes()", s => {
    s.test("returns resource attributes", t => {
      let attrs = getResourceAttributes("/users");

      t.equal(attrs.resourcePath, "/users");
      t.equal(attrs.resourceName, "users");
      t.equal(attrs.singularName, "user");
      t.equal(attrs.param, ":id");
    });

    s.test("prefers {name} option when naming resource", t => {
      let attrs = getResourceAttributes("/users", {name: "clients"});

      t.equal(attrs.resourceName, "clients");
      t.equal(attrs.singularName, "client");
    });

    s.test("prefers {singularName} option", t => {
      let attrs = getResourceAttributes("/users", {singularName: "person"});

      t.equal(attrs.resourceName, "users");
      t.equal(attrs.singularName, "person");
    });

    s.test("prefers {param} option", t => {
      let attrs = getResourceAttributes("/users", {param: "slug"});

      t.equal(attrs.param, ":slug");
    });
  });

  s.describe("pickActions()", s => {
    s.test("converts actions object to array", t => {
      let actions = pickActions({index: 1, show: 2, edit: 3, new: 4}, {});

      t.same(actions, [1, 2, 3, 4]);
    });

    s.test("picks actions specified in {only} option", t => {
      let actions = pickActions({index: 1, show: 2, edit: 3, new: 4}, {only: ["edit", "new"]});

      t.same(actions, [3, 4]);
    });

    s.test("exludes actions specified in {except} option", t => {
      let actions = pickActions({index: 1, show: 2, edit: 3, new: 4}, {except: ["edit", "new"]});

      t.same(actions, [1, 2]);
    });
  });
});