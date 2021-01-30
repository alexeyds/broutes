import { routeFragment, compileFragments } from "route/route_fragment";

export function composeRoutes(composerFunc) {
  let builder = new BroutesBuilder({scopes: [], routes: {}});
  return builder._compose(composerFunc);
}

class BroutesBuilder {
  constructor({scopes, routes}) {
    this._scopes = scopes;
    this._routes = routes;
  }

  route(path, opts) {
    let fragment = routeFragment(path, opts);
    this._validateFragmentName(fragment, { type: 'route' });

    let routeName = `${fragment.name}Path`;
    this._validateNameAvailable(routeName);

    this._routes[routeName] = compileFragments([...this._scopes, fragment]);
  }

  scope(path, scopeBody, options) {
    let fragment = routeFragment(path, { ...options, name: null });
    let scopedBuilder = new BroutesBuilder({ scopes: [...this._scopes, fragment], routes: this._routes });

    scopedBuilder._compose(scopeBody);
  }

  namedScope(path, scopeBody, options) {
    let fragment = routeFragment(path, options);
    this._validateFragmentName(fragment, {type: 'namedScope'});
    this._validateNameAvailable(fragment.name);

    let scopedBuilder = new BroutesBuilder({ scopes: [...this._scopes, fragment], routes: {} });
    this._routes[fragment.name] = scopedBuilder._compose(scopeBody);
  }

  _compose(composerFunc) {
    composerFunc(this);
    return this._routes;
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
