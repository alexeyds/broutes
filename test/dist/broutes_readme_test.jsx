import jutest from "jutest";
import pluralize from "pluralize";
import { composeRoutes } from "../../dist/broutes";

jutest("broutes readme test", s => {
  s.describe("Intro", s => {
    s.test("Example usage", t => {
      let routes = composeRoutes(r => {
        r.scope("/:locale?", r => {
          r.route("/my-orders");
          r.route("/logout", {name: "signout"});

          r.scope("/api", r => {
            r.resources("/credit_cards", {only: ["index", "show"]});
          }, {name: "api"});
        }, {defaultParams: {locale: "en"}});
      }, {host: "test.com"});

      t.equal(routes.myOrdersPath(), "/en/my-orders");
      t.equal(routes.myOrdersPath({}, {query: {foo: "bar"}}), "/en/my-orders?foo=bar");
      t.equal(routes.myOrdersPath({locale: "ru"}), "/ru/my-orders");
      t.equal(routes.myOrdersUrl(), "test.com/en/my-orders");

      t.equal(routes.signoutPath(), "/en/logout");

      t.equal(routes.apiCreditCardsPath(), "/en/api/credit_cards");
      t.equal(routes.apiCreditCardPath({id: 1}), "/en/api/credit_cards/1");
      t.equal(routes.apiCreditCardPath.raw, "/:locale?/api/credit_cards/:id");
    });
  });

  s.describe("composeRoutes()", s => {
    s.test("Example", t => {
      let routes = composeRoutes(r => {
        r.resources("/knives");
      }, {
        host: "test.com",
        singularizeResource: (resource) => pluralize(resource, 1)
      });

      t.equal(routes.knivesPath(), "/knives");
      t.equal(routes.knivesPath({}, {query: {sharpOnly: true}}), "/knives?sharpOnly=true");
      t.equal(routes.knivesUrl(), "test.com/knives");
      t.equal(routes.knifePath({id: 1}), "/knives/1");
      t.equal(routes.editKnifePath({id: 1}), "/knives/1/edit");
    });
  });

  s.describe("r.route()", s => {
    s.test("Example", t => {
      let routes = composeRoutes(r => {
        r.route("/my-orders");
        r.route("/users", {name: "clients"});
        r.route("/users/:slug", {name: "client", defaultParams: {slug: "john"}});
      });

      t.equal(routes.myOrdersPath(), "/my-orders");

      t.equal(routes.clientsPath(), "/users");

      t.equal(routes.clientPath(), "/users/john");
      t.equal(routes.clientPath({slug: "joe"}), "/users/joe");
      t.equal(routes.clientPath.raw, "/users/:slug");
    });
  });

  s.describe("r.scope()", s => {
    s.test("Example", t => {
      let routes = composeRoutes(r => {
        r.scope("/:locale?", r => {
          r.route("/users");

          r.scope("/api", r => {
            r.route("/users/:id", {name: "user"});
          }, {name: "api"});
        }, {defaultParams: {locale: "en"}});
      });

      t.equal(routes.usersPath(), "/en/users");
      t.equal(routes.usersPath({locale: "ru"}), "/ru/users");

      t.equal(routes.apiUserPath({id: 1}), "/en/api/users/1");
      t.equal(routes.apiUserPath({locale: "ru", id: 2}), "/ru/api/users/2");
    });
  });

  s.describe("r.resources()", s => {
    s.test("Example", t => {
      let routes = composeRoutes(r => {
        r.resources("/users", {only: ["index", "show"], name: "clients"});
        r.resources("/people", {singularName: "person", param: "slug"});
        r.resources("/my_account", {singleton: true, except: ["new"]});
      });

      t.equal(routes.clientsPath(), "/users");
      t.equal(routes.clientPath({id: 1}), "/users/1");

      t.equal(routes.editPersonPath({slug: "john"}), "/people/john/edit");
      t.equal(routes.newPersonPath(), "/people/new");

      t.equal(routes.myAccountPath(), "/my_account");
      t.equal(routes.editMyAccountPath(), "/my_account/edit");
    });
  });
});