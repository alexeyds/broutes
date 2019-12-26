import generateRoute from "generate_route";

export default function composeRoutes(routesBody) {
  let routes = new Routes({});
  routesBody.call(null, routes);

  return routes.paths;
}

class Routes {
  constructor({scopes=[], paths={}, defaultParams={}, scopeNames=[]}) {
    this.paths = paths;
    this.scopes = scopes;
    this.defaultParams = defaultParams;
    this.scopeNames = scopeNames;
  }

  path(name, path, {defaultParams}={}) {
    let { toPath, urlName, pathName, rawPath } = generateRoute({
      name: [...this.scopeNames, name], 
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

  scope(scope, scopeBody, {defaultParams, name}={}) {
    let scopes = [...this.scopes, scope];
    defaultParams = {...this.defaultParams, ...defaultParams};
    let scopeNames = [...this.scopeNames, name];
    let routes = new Routes({scopes, paths: this.paths, defaultParams, scopeNames});

    scopeBody.call(null, routes);
  }
}

function hasKey(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}