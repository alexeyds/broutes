import { camelize } from "core_extensions/string";
import { pathToName } from "route_utils";
import { simpleSingularize } from "core_extensions/string";

export function buildRoutesConfig(config={}) {
  if (config._isRoutesConfig) {
    return config;
  } else {
    return newConfig(config);
  }
}

function newConfig({
  host,
  singularizeResource=simpleSingularize
}) {
  let guessRouteName = (path) => {
    let name = pathToName(path);

    if (name) {
      return camelize(name);
    } else {
      return name;
    }
  };

  return { 
    host, 
    singularizeResource, 
    guessRouteName, 
    scopes: [], 
    routes: {}, 
    _isRoutesConfig: true 
  };
}

export function addScope(routesConfig, scope) {
  return {...routesConfig, scopes: [...routesConfig.scopes, scope]};
}