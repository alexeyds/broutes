import jutest from "jutest";
import compileRoute from "route/compile_route";

jutest("compileRoute()", s => {
  s.test("returns route builder function", t => {
    let route = compileRoute("/test");
    t.equal(route(), '/test');
  });

  s.test("supports dynamic route paths", t => {
    let route = compileRoute("/users/:id");
    t.equal(route({id: 123}), "/users/123");
  });

  s.test("supports default params", t => {
    let route = compileRoute("/users/:id", { id: 321 });
    t.equal(route(), "/users/321");
  });

  s.test("prefers explicit params over defaults", t => {
    let route = compileRoute("/users/:id/:action", { action: 'edit', id: 321 });
    t.equal(route({id: 123}), "/users/123/edit");
  });

  s.test("supports functions as param values", t => {
    let route = compileRoute("/users/:id");
    t.equal(route({id: () => 123}), "/users/123");
  });
});
