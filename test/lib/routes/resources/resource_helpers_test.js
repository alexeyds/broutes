import test from "enhanced-tape";
import { buildRoutesConfig } from "routes/routes_config";
import { getResourceAttributes as doGetResourceAttributes, pickActions } from "routes/resources/resource_helpers";

function getResourceAttributes(path, resourceConfig={}, routesConfig=buildRoutesConfig()) {
  return doGetResourceAttributes(path, resourceConfig, routesConfig);
}

test("resource helpers", function(t) {
  t.test("getResourceAttributes()", function(t) {
    t.test("returns resource attributes", function(t) {
      let attrs = getResourceAttributes("/users");

      t.equal(attrs.resourcePath, "/users");
      t.equal(attrs.resourceName, "users");
      t.equal(attrs.singularName, "user");
      t.equal(attrs.param, ":id");

      t.end();
    });

    t.test("prefers {name} option when naming resource", function(t) {
      let attrs = getResourceAttributes("/users", {name: "clients"});

      t.equal(attrs.resourceName, "clients");
      t.equal(attrs.singularName, "client");
    
      t.end();
    });

    t.test("prefers {singularName} option", function(t) {
      let attrs = getResourceAttributes("/users", {singularName: "person"});

      t.equal(attrs.resourceName, "users");
      t.equal(attrs.singularName, "person");
    
      t.end();
    });

    t.test("prefers {param} option", function(t) {
      let attrs = getResourceAttributes("/users", {param: "slug"});

      t.equal(attrs.param, ":slug");
    
      t.end();
    });
  });

  t.test("pickActions()", function(t) {
    t.test("converts actions object to array", function(t) {
      let actions = pickActions({index: 1, show: 2, edit: 3, new: 4}, {});

      t.same(actions, [1, 2, 3, 4]);
  
      t.end();
    });

    t.test("picks actions specified in {only} option", function(t) {
      let actions = pickActions({index: 1, show: 2, edit: 3, new: 4}, {only: ["edit", "new"]});

      t.same(actions, [3, 4]);
    
      t.end();
    });

    t.test("exludes actions specified in {except} option", function(t) {
      let actions = pickActions({index: 1, show: 2, edit: 3, new: 4}, {except: ["edit", "new"]});

      t.same(actions, [1, 2]);
    
      t.end();
    });
  });
});