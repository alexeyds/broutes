import jutest from "jutest";
import { routeFragment, compileFragments } from "route/route_fragment";

jutest("route/route_fragment", s => {
  s.describe("routeFragment()", s => {
    s.test("builds route fragment", t => {
      let fragment = routeFragment('/test');

      t.equal(fragment.path, '/test');
      t.assert(fragment.name);
      t.same(fragment.defaultParams, {});
    });

    s.test("accepts {name, defaultParams} options", t => {
      let fragment = routeFragment('/test', { name: 'foobar', defaultParams: {a: 1} });

      t.equal(fragment.name, 'foobar');
      t.same(fragment.defaultParams, {a: 1});
    });

    s.test("guesses fragment name", t => {
      let fragment = routeFragment('/test_things');
      t.equal(fragment.name, 'testThings');
    });

    s.test("throws if path is blank", t => {
      t.throws(() => routeFragment(null), /empty/);
    });

    s.test("does not set default name if {name} is null", t => {
      let fragment = routeFragment('/test_things', { name: null });
      t.equal(fragment.name, null);
    });
  });

  s.describe("compileFragments()", s => {
    s.test("compiles fragment into a route", t => {
      let fragment = routeFragment('/users');
      let route = compileFragments([fragment]);

      t.equal(route(), '/users');
    });

    s.test("passes default params to route", t => {
      let fragment = routeFragment('/users/:id', { defaultParams: { id: 321 } });
      let route = compileFragments([fragment]);

      t.equal(route(), '/users/321');
    });

    s.test("joins paths of multiple fragments", t => {
      let fragment1 = routeFragment('/users');
      let fragment2 = routeFragment('/foo');
      let route = compileFragments([fragment1, fragment2]);

      t.equal(route(), '/users/foo');
    });

    s.test("combines defaultParams of multiple fragments", t => {
      let fragment1 = routeFragment('/users/:id', { defaultParams: { id: 123} });
      let fragment2 = routeFragment('/:action', { defaultParams: { action: 'edit' } });
      let route = compileFragments([fragment1, fragment2]);

      t.equal(route(), '/users/123/edit');
    });
  });
});
