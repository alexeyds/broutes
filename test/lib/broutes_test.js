import jutest from "jutest";
import { composeRoutes } from "broutes";

jutest("composeRoutes()", s => {
  s.test("returns empty object if no routes are defined", t => {
    let routes = composeRoutes(() => {});
    t.same(routes, {});
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
});
