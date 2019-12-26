import generateRoute from "generate_route";

export default function composeRoutes(routesBody, {host}={}) {
  let routes = new Routes({host});
  routesBody.call(null, routes);

  return routes.paths;
}

class Routes {
  constructor({scopes=[], paths={}, defaultParams={}, scopeNames=[], host}) {
    this.paths = paths;
    this.scopes = scopes;
    this.defaultParams = defaultParams;
    this.scopeNames = scopeNames;
    this.host = host;
  }

  path(name, path, {defaultParams}={}) {
    let { toPath, toFullUrl, urlName, pathName, rawPath } = generateRoute({
      name: [...this.scopeNames, name], 
      path, 
      scopes: this.scopes,
      host: this.host,
      defaultParams: {...this.defaultParams, ...defaultParams}
    });

    if (hasKey(this.paths, pathName)) {
      throw new Error(`${pathName} was already defined in routes, make sure that all routes have a unique identifier`);
    }

    toPath.raw = rawPath;

    this.paths[pathName] = toPath;
    this.paths[urlName] = toFullUrl;
  }

  scope(scope, scopeBody, {defaultParams, name}={}) {
    let scopes = [...this.scopes, scope];
    defaultParams = {...this.defaultParams, ...defaultParams};
    let scopeNames = [...this.scopeNames, name];

    let routes = new Routes({
      scopes, 
      defaultParams, 
      scopeNames, 
      paths: this.paths,
      host: this.host
    });

    scopeBody.call(null, routes);
  }
}

function hasKey(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}