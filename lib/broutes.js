import { toQueryString as defaultToQueryString, appendQueryString } from "utils/query_string";
import { routeFragment, compileFragments } from "route/route_fragment";

export function composeRoutes(composerFunc, config={}) {
  let builder = new BroutesBuilder({scopes: [], routes: {}, config});
  return builder._compose(composerFunc);
}

class BroutesBuilder {
  constructor({scopes, routes, config}) {
    this._scopes = scopes;
    this._routes = routes;
    this._config = { toQueryString: defaultToQueryString, ...config };
  }

  route(path, opts) {
    if (path === '/') opts = { name: 'root', ...opts };

    let fragment = routeFragment(path, opts);
    this._validateFragmentName(fragment, { type: 'route' });

    let compiledRoute = compileFragments(this._scoped(fragment));
    let result = (params, { query }={}) => {
      let path = compiledRoute(params);
      let queryString = query && this._config.toQueryString(query);
      return appendQueryString(path, queryString);
    };
    result.raw = compiledRoute.raw;

    this.addPath(fragment.name, result);
  }

  scope(path, scopeBody, options) {
    let fragment = routeFragment(path, { ...options, name: null });
    let scopedBuilder = this._scopedBuilder({ fragment, routes: this._routes });
    scopedBuilder._compose(scopeBody);
  }

  namedScope(path, scopeBody, options) {
    let fragment = routeFragment(path, options);
    this._validateFragmentName(fragment, { type: 'namedScope' });

    let scopedBuilder = this._scopedBuilder({ fragment, routes: {} });
    this._addItem(fragment.name, scopedBuilder._compose(scopeBody));
  }

  resources(name, scopeBody, options) {
    this.namedScope(name, (r) => {
      r.route('/', { name: 'index' });
      r.route('/:id', { name: 'show' });
      r.route('/new');
      scopeBody && scopeBody(r);
    }, options);
  }

  addPath(name, route) {
    this._addItem(`${name}Path`, route);
  }

  _addItem(name, item) {
    this._validateNameAvailable(name);
    this._routes[name] = item;
  }

  _compose(composerFunc) {
    composerFunc(this);
    return this._routes;
  }

  _scopedBuilder({ fragment, routes }) {
    return new BroutesBuilder({ scopes: this._scoped(fragment), routes, config: this._config });
  }

  _scoped(fragment) {
    return [...this._scopes, fragment];
  }

  _validateFragmentName(fragment, { type }) {
    if (!fragment.name) {
      throw new Error(
        `Unable to guess ${type}'s name from provided path: "${fragment.path}". ` +
        `Either change it or specify the name explicitly using {name} option.`
      );
    }
  }

  _validateNameAvailable(name) {
    if (this._routes[name]) {
      let scopeNames = this._scopes.map(f => f.name).filter(n => n);
      let fullName = [...scopeNames, name].join('.');

      throw new Error(
        `Attempted to redefine existing route/scope: "${fullName}". ` +
        `Make sure all your route definitions have a unique name.`
      );
    }
  }
}
