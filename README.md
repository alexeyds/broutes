# broutes
Named routing for frontend javascript applications. Uses [path-to-regexp](https://github.com/pillarjs/path-to-regexp) v1.7.0 internally and is fully compatible with [react-router](https://github.com/ReactTraining/react-router/).

## Installation
```cmd
npm i broutes
```

## Example Usage
```js
import { composeRoutes } from "broutes";

let routes = composeRoutes(r => {
  r.scope("/:locale?", r => {
    r.route("/my-orders");
    r.route("/logout", {name: "signout"});

    r.scope("/api", r => {
      r.resources("/credit_cards", {only: ["index", "show"]});
    }, {name: "api"});
  }, {defaultParams: {locale: "en"}});
}, {host: "test.com"});

routes.myOrdersPath(); //=> "/en/my-orders"
routes.myOrdersPath({}, {query: {foo: "bar"}}); //=> "/en/my-orders?foo=bar"
routes.myOrdersPath({locale: "ru"}); //=> "/ru/my-orders"
routes.myOrdersUrl(); //=> "test.com/en/my-orders"

routes.signoutPath(); //=> "/en/logout"

routes.apiCreditCardsPath(); //=> "/en/api/credit_cards"
routes.apiCreditCardPath({id: 1}); //=> "/en/api/credit_cards/1"
routes.apiCreditCardPath.raw; //=> "/:locale?/api/credit_cards/:id"
```

## API

### composeRoutes()
```js 
composeRoutes(routesBuilder[, options])
```
Builds and returns new `routes` object containing named \*-path and \*-url helpers for defined routes.

* **routesBuilder**: a function which will be passed {[route](#rroute), [scope](#rscope), [resources](#rresources)} object.
* **options**:
  * **host**: optional host string to be prepended to each path when calling \*-url named helpers. If not specified, \*-url helpers with behave just like \*-path helpers.
  * **singularizeResource**: function used to name resource helpers in which singular name is required, e.g `editUserPath({id: 1})`. **By default, it simply removes last letter from resource name**. If such behavior is not desired, you can either specify [`singularName`](#rresources) option when defining your resource or replace this function with something like [pluralize](https://github.com/blakeembrey/pluralize)

#### Example
```js
import { composeRoutes } from "broutes";
import pluralize from "pluralize";

let routes = composeRoutes(r => {
  r.resources("/knives");
}, {
  host: "test.com",
  singularizeResource: (resource) => pluralize(resource, 1)
});

routes.knivesPath(); //=> "/knives"
routes.knivesPath({}, {query: {sharpOnly: true}}); //=> "/knives?sharpOnly=true"
routes.knivesUrl(); //=> "test.com/knives"
routes.knifePath({id: 1}); //=> "/knives/1"
routes.editKnifePath({id: 1}); //=> "/knives/1/edit"
```

### r.route()
```js
r.route(path[, options])
```
Adds new named route to `routes` object, e.g adds `{name}Path` and `{name}Url` named helpers. You can also access route's raw path(with all named placeholders in place) via `{name}Path.raw`.

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
Defines new scope for routes. Scopes can also be nested within each other.

* **path**: scope's path. This path will be added to each route within the scope.
* **scopeBuilder**: builder function which has the same API as the [composeRoutes'](#composeRoutes) builder function.
* **options**:
  * **name**: defines name for this scope. Each route's name within the scope will also include this scope's name. Empty by default.
  * **defaultParams**: object containing default [named parameters](https://github.com/pillarjs/path-to-regexp#named-parameters) for paths in this scope. See below for example usage.

#### Example
```js
let routes = composeRoutes(r => {
  r.scope("/:locale?", r => {
    r.route("/users");

    r.scope("/api", r => {
      r.route("/users/:id", {name: "user"});
    }, {name: "api"});
  }, {defaultParams: {locale: "en"}});
});

routes.usersPath(); //=> "/en/users"
routes.usersPath({locale: "ru"}); //=> "/ru/users"

routes.apiUserPath({id: 1}); //=> "/en/api/users/1"
routes.apiUserPath({locale: "ru", id: 2}); //=> "/ru/api/users/2"
```

### r.resources()
```js
r.resources(path[, options])
```
Defines RESTful routes for a resource. 

* **path**: resources' base path.
* **options**:
  * **name**: resources' base name. By default it is inferred from **path** using [route's](#rroute) naming logic.
  * **singularName**: used to name resource helpers in which singular name is required, e.g `editUserPath({id: 1})`. By default uses [singularizeResource()](#composeRoutes) function. Has no effect on singleton routes.
  * **param**: the name of the named parameter for this resource, "id" by default. Has no effect on singleton routes.
  * **only**: a list of actions to define routes for. Defaults to ["index", "show", "edit", "new"] for normal resources and ["show", "edit", "new"] for singleton resources.
  * **exclude**: a list of actions to exclude generated routes from. 
  * **singleton**: if true, defines routes for a singleton resource(e.g the one that has no ID).

The definition:
```js
r.resources("/users");
```
is roughly equivalent to:
```js
r.route("/users"); // "index" action
r.route("/users/:id", {name: "user"}); // "show" action
r.route("/users/:id/edit", {name: "editUser"}); // "edit" action
r.route("/users/new", {name: "newUser"}); // "new" action
```

And the singleton resource definition:
```js
r.resources("/user", {singleton: true});
```
is roughly equivalent to:
```js
r.route("/user"); // "show" action
r.route("/user/edit", {name: "editUser"}); // "edit" action
r.route("/user/new", {name: "newUser"}); // "new" action
```

#### Example

```js
let routes = composeRoutes(r => {
  r.resources("/users", {only: ["index", "show"], name: "clients"});
  r.resources("/people", {singularName: "person", param: "slug"});
  r.resources("/my_account", {singleton: true, except: ["new"]});
});

routes.clientsPath(); //=> "/users"
routes.clientPath({id: 1}); //=> "/users/1"

routes.editPersonPath({slug: "john"}); //=> "/people/john/edit"
routes.newPersonPath(); //=> "/people/new"

routes.myAccountPath(); // => "/my_account"
routes.editMyAccountPath(); // => "/my_account/edit"
```

## License
MIT