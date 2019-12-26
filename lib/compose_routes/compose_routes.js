import generateRoute from "generate_route";

export default function composeRoutes(routesBody) {
  let routes = new Routes({});
  routesBody.call(null, routes);

  return routes.paths;
}

class Routes {
  constructor({scopes=[], paths={}}) {
    this.paths = paths;
    this.scopes = scopes;
  }

  path(name, path) {
    let { toPath, urlName, pathName, rawPath } = generateRoute({name, path, scopes: this.scopes});
    toPath.raw = rawPath;

    this.paths[pathName] = toPath;
    this.paths[urlName] = toPath;
  }

  scope(scope, scopeBody) {
    let scopes = [...this.scopes, scope];
    let routes = new Routes({scopes, paths: this.paths});
    
    scopeBody.call(null, routes);
  }
}