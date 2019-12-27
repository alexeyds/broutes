import test from "enhanced-tape";
import { composeRoutes } from "../../dist";

test("composeRoutes", function(t) {
  t.test("basic usage", function(t) {
    let routes = composeRoutes(r => {
      r.path("login", "/login");
      r.resources("users");
      r.scope("/:locale?", r => {
        r.path("account", "/account");
      }, {defaultParams: {locale: () => "en"}});
    }, {host: "localhost:3000"});
  
    t.equal(routes.loginPath(), "/login");
    t.equal(routes.loginUrl(), "localhost:3000/login");

    t.equal(routes.usersPath(), "/users");
    t.equal(routes.editUserPath({id: 1}), "/users/1/edit");

    t.equal(routes.accountPath.raw, "/:locale?/account");
    t.equal(routes.accountPath(), "/en/account");
    t.equal(routes.accountPath({locale: "ru"}), "/ru/account");

    t.end();
  });

  t.end();
});