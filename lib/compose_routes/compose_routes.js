import generateRoute from "generate_route";
import { ensureIsArray } from "core_extensions/array";

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
    let nameArray = ensureIsArray(name);
    let { toPath, toFullUrl, urlName, pathName, rawPath } = generateRoute({
      name: [...this.scopeNames, ...nameArray], 
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

  resources(resource, options={}) {
    let resourceName = options.name || resource;
    let singularName = options.singularName || resourceName.slice(0, -1);
    let param = options.param || "id";
    param = ":" + param;

    this._addResources({
      index: () => this.path(resourceName, `/${resource}`),
      show:  () => this.path(singularName, `/${resource}/${param}`),
      edit:  () => this.path(["edit", singularName], `/${resource}/${param}/edit`),
      new:   () => this.path(["new", singularName], `/${resource}/new`)
    }, options);
  }

  resource(resource, options={}) {
    let resourceName = options.name || resource;

    this._addResources({
      show:  () => this.path(resourceName, `/${resource}`),
      edit:  () => this.path(["edit", resourceName], `/${resource}/edit`),
      new:   () => this.path(["new", resourceName], `/${resource}/new`)
    }, options);
  }

  _addResources(paths, {except=[], only}) {
    Object.entries(paths).forEach(([name, addResource]) => {
      if (except.includes(name)) {
        return;
      } else if (only && !only.includes(name)) {
        return;
      } else {
        addResource();
      }
    });
  }
}

function hasKey(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}