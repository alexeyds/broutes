import generateRoute from "generate_route";

export default function composeRoutes(routesBody) {
  let routes = new Routes({});
  routesBody.call(null, routes);

  return routes.paths;
}

class Routes {
  constructor({scopes=[], paths={}, defaultParams={}}) {
    this.paths = paths;
    this.scopes = scopes;
    this.defaultParams = defaultParams;
  }

  path(name, path, {defaultParams}={}) {
    let { toPath, urlName, pathName, rawPath } = generateRoute({
      name, 
      path, 
      scopes: this.scopes, 
      defaultParams: {...this.defaultParams, ...defaultParams}
    });

    if (hasKey(this.paths, pathName)) {
      throw new Error(`${pathName} was already defined in routes, make sure that all routes have a unique identifier`);
    }

    toPath.raw = rawPath;

    this.paths[pathName] = toPath;
    this.paths[urlName] = toPath;
  }

  scope(scope, scopeBody, {defaultParams}={}) {
    let scopes = [...this.scopes, scope];
    defaultParams = {...this.defaultParams, ...defaultParams};
    let routes = new Routes({scopes, paths: this.paths, defaultParams});

    scopeBody.call(null, routes);
  }
}

function hasKey(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}