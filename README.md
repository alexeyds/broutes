# broutes
A simple router DSL for defining named routes in frontend javascript applications. Uses [path-to-regexp](https://github.com/pillarjs/path-to-regexp) v1.7.0 internally and is fully compatible with [react-router](https://github.com/ReactTraining/react-router/).

## Installation
npm:

```cmd
npm i broutes
```

yarn:

```cmd
yarn add broutes
```

## Example Usage
```js
import { composeRoutes } from "broutes";

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

routes.testsPath(); //=> '/tests'
routes.fooPath(); //=> '/foo/bar'
routes.fooPath({ slug: 'baz' }); //=> '/foo/baz'

routes.orders.indexPath(); //=> '/orders'
routes.orders.showPath({ id: 123 }); //=> '/orders/123'
routes.orders.newPath(); //=> '/orders/new'
routes.orders.showPath.raw; //=> '/orders/:id'

routes.api.usersPath(); //=> '/api/v1/users'
routes.api.usersPath({ version: 'v2' }); //=> '/api/v2/users'
routes.api.usersPath({}, { query: { foo: 'bar' } }); //=> '/api/v1/users?foo=bar'
```

## API

### composeRoutes()
```js 
composeRoutes(routesBuilder[, options])
```
Builds and returns new `routes` object containing named path builders for defined routes.

* **routesBuilder**: a builder function to which an object containing {[route](#rroute), [scope](#rscope), [namedScope](#rnamedscope), [resources](#rresources)} will be passed.
* **options**:
  * **toQueryString**: a function used to build query strings for all routes. A simple non-strict `encodeURIComponent`-based function is used by default.

### r.route()
```js
r.route(path[, options])
```
Adds new named route to `routes` object, which then can be built by calling `{routeName}Path()` function. You can also access route's raw path(with all named placeholders in place) via `{routeName}Path.raw`.

`r.route()` will throw if route with the same name was already defined.

* **path**: route's path.
* **options**:
  * **name**: explicitly defines name of this route. By default, the route name will be inferred from the path and set to camelCase, so that `r.route("/path-to-thing")` or `r.route("/path_to_thing")` are both named `pathToThing`.
  * **defaultParams**: object containing default [named parameters](https://github.com/pillarjs/path-to-regexp#named-parameters) for this route's path. See below for example usage.

#### Example
```js
let routes = composeRoutes(r => {
  r.route("/my-orders");
  r.route("/users", {name: "clients"});
  r.route("/users/:slug", {name: "client", defaultParams: {slug: "john"}});
});

routes.myOrdersPath(); //=> "/my-orders"

routes.clientsPath(); //=> "/users"

routes.clientPath(); //=> "/users/john"
routes.clientPath({slug: "joe"}); //=> "/users/joe"
routes.clientPath.raw; //=> "/users/:slug"
```
### r.scope()
```js
r.scope(path, scopeBuilder[, options])
```
Defines new scope for all contained routes. Scopes can also be nested within each other.

* **path**: scope's path. This path will be added to each route within the scope.
* **scopeBuilder**: builder function which has the same API as the [composeRoutes'](#composeRoutes) builder function.
* **options**:
  * **defaultParams**: object containing default [named parameters](https://github.com/pillarjs/path-to-regexp#named-parameters) for paths in this scope.

### r.namedScope()
```js
r.namedScope(path, scopeBuilder[, options])
```
Defines new named scope for routes, i.e adds a namespace within routes object(or within another named scope).

* **path**: scope's path. This path will be added to each route within the scope.
* **scopeBuilder**: builder function which has the same API as the [composeRoutes'](#composeRoutes) builder function.
* **options**:
  * **name**: explicitly defines name of this named scope. By default, the scope name will be inferred from the path and set to camelCase.
  * **defaultParams**: object containing default [named parameters](https://github.com/pillarjs/path-to-regexp#named-parameters) for paths in this scope.

### r.resources()
```js
r.resources(path, scopeBuilder[, options])
```
A simple shortcut to define commonly used routes. A call to `r.resources('/users')` is exactly equalent to:

```js
r.namedScope('/users', (r) => {
  r.route('/', { name: 'index' });
  r.route('/:id', { name: 'show' });
  r.route('/new');
});
```

* **path**: path for the resources
* **scopeBuilder**: builder function which has the same API as the [composeRoutes'](#composeRoutes) builder function.
* **options**:
  * **name**: explicitly defines name of this resource and the [namedScope](#rnamedscope) it's contained in.
  * **defaultParams**: object containing default [named parameters](https://github.com/pillarjs/path-to-regexp#named-parameters) for paths in this scope.

## License
MIT