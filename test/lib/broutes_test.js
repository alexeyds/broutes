import jutest from "jutest";
import { composeRoutes } from "broutes";

jutest("composeRoutes()", s => {
  s.test("returns empty object if no routes are defined", t => {
    let routes = composeRoutes(() => {});
    t.same(routes, {});
  });

  s.test("has {toQueryString} option", t => {
    let toQueryString = (query) => `a=${query.a+1}`;
    let routes = composeRoutes((r) => r.route('/test'), { toQueryString });

    let query = { a: 1 };
    t.equal(routes.testPath({}, { query }), '/test?a=2');
    t.equal(routes.testPath({}), '/test');
  });

  s.test("passes {toQueryString} option to all nested scopes", t => {
    let toQueryString = (query) => `a=${query.a+1}`;
    let routes = composeRoutes((r) => {
      r.scope('/test', r => {
        r.route('/foo');
      });

      r.namedScope('/test', r => {
        r.route('/foo');
      });
    }, { toQueryString });

    let query = { a: 1 };
    t.equal(routes.fooPath({}, { query }), '/test/foo?a=2');
    t.equal(routes.test.fooPath({}, { query }), '/test/foo?a=2');
  });

  s.describe("r.route()", s => {
    let route = (...args) => composeRoutes(r => r.route(...args));

    s.test("defines route path", t => {
      let routes = route('/users');
      t.equal(routes.usersPath(), '/users');
    });

    s.test("supports options", t => {
      let routes = route('/users/:id', { name: 'user' });
      t.equal(routes.userPath({id: 123}), '/users/123');
    });

    s.test("exposes .raw attribute on the route", t => {
      let routes = route('/users/:id', { name: 'user' });
      t.equal(routes.userPath.raw, '/users/:id');
    });

    s.test("validates route uniqueness", t => {
      t.throws(() => {
        composeRoutes(r => {
          r.route('/users');
          r.route('/users');
        });
      }, /existing route/);
    });

    s.test("validates route name presence", t => {
      t.throws(() => route('////'), /Unable to guess/);
    });

    s.test("names / route as root", t => {
      let routes = route('/');
      t.equal(routes.rootPath(), '/');
    });

    s.test("supports {query} option in resulting route", t => {
      let routes = route('/test');
      let query = { foo: 'bar' };

      t.equal(routes.testPath({}, { query }), '/test?foo=bar');
    });
  });

  s.describe("r.scope()", s => {
    let scope = (...args) => composeRoutes(r => r.scope(...args));

    s.test("adss nothing if no routes are defined", t => {
      let routes = scope('/test', () => {});
      t.same(routes, {});
    });

    s.test("allows adding scoped routes", t => {
      let routes = scope('/test', r => r.route('/users'));
      t.same(routes.usersPath(), '/test/users');
    });

    s.test("supports options", t => {
      let routes = scope('/:version', r => {
        r.route('/users/:id', { name: 'user' });
      }, { defaultParams: { version: 'v1' }});

      t.same(routes.userPath({id: 123}), '/v1/users/123');
    });

    s.test("supports nesting", t => {
      let routes = scope('/api', r => {
        r.scope('/v1', r => {
          r.route('/users');
        });
      });

      t.same(routes.usersPath(), '/api/v1/users');
    });
  });

  s.describe("r.namedScope()", s => {
    let namedScope = (...args) => composeRoutes(r => r.namedScope(...args));

    s.test("adds new object to routes", t => {
      let routes = namedScope('/api', r => r.route('/users'));
      t.equal(routes.api.usersPath(), '/api/users');
    });

    s.test("supports options", t => {
      let routes = namedScope('/:version', r => {
        r.route('/users');
      }, { name: 'apiVersion', defaultParams: { version: 'v1' }});

      t.equal(routes.apiVersion.usersPath(), '/v1/users');
    });

    s.test("supports nesting", t => {
      let routes = namedScope('/api', r => {
        r.namedScope('/:version', r => {
          r.route('/users');
        });
      });

      t.equal(routes.api.version.usersPath({version: 'v1'}), '/api/v1/users');
    });

    s.test("validates scope name presence", t => {
      t.throws(() => namedScope('///', () => {}), /Unable to guess/);
    });

    s.test("validates scope name uniqueness", t => {
      t.throws(() => {
        composeRoutes(r => {
          r.namedScope('/test', () => {});
          r.namedScope('/test', () => {});
        });
      }, /existing route/);
    });
  });

  s.describe("r.resources()", s => {
    let resources = (...args) => composeRoutes(r => r.resources(...args));

    s.test("defines CRUD resource routes", t => {
      let routes = resources('/users');

      t.equal(routes.users.indexPath(), '/users');
      t.equal(routes.users.showPath({id: 123}), '/users/123');
      t.equal(routes.users.newPath(), '/users/new');
    });

    s.test("allows adding custom routes to resource", t => {
      let routes = resources('/users', r => r.route('/test'));
      t.equal(routes.users.testPath(), '/users/test');
    });

    s.test("supports options", t => {
      let routes = resources('/users', () => {}, { name: 'people' });
      t.equal(routes.people.indexPath(), '/users');
    });
  });

  s.describe("r.customRoute()", s => {
    let customRoute = (...args) => composeRoutes(r => r.customRoute(...args));

    s.test("defines custom route", t => {
      let routes = customRoute('test', () => '/foo');
      t.equal(routes.testPath(), '/foo');      
    });

    s.test("validates name availability", t => {
      t.throws(() => {
        composeRoutes(r => {
          r.customRoute('test', () => {});
          r.customRoute('test', () => {});
        });
      }, /existing route/);
    });
  });
});
