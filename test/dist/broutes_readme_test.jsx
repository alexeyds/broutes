import jutest from "jutest";
import { composeRoutes } from "../../dist/broutes";

jutest("broutes README test", s => {
  s.test("Example usage", t => {
    let routes = composeRoutes(r => {
      r.route('/tests');
      r.route('/foo/:slug', { name: 'foo', defaultParams: { slug: 'bar' } });
      r.resources('/orders');

      r.namedScope('/api', r => {
        r.scope('/:version', r => {
          r.route('/users');
        }, { defaultParams: { version: 'v1' }});
      });
    });

    t.equal(routes.testsPath(), '/tests');
    t.equal(routes.fooPath(), '/foo/bar');
    t.equal(routes.fooPath({ slug: 'baz' }), '/foo/baz');

    t.equal(routes.orders.indexPath(), '/orders');
    t.equal(routes.orders.showPath({ id: 123 }), '/orders/123');
    t.equal(routes.orders.showPath.raw, '/orders/:id');
    t.equal(routes.orders.newPath(), '/orders/new');

    t.equal(routes.api.usersPath(), '/api/v1/users');
    t.equal(routes.api.usersPath({ version: 'v2' }), '/api/v2/users');
    t.equal(routes.api.usersPath({}, { query: { foo: 'bar' } }), '/api/v1/users?foo=bar');
  });

  s.test("r.route() example", t => {
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