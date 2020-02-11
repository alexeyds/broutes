import { joinPaths, joinNames } from "route_utils";
import { buildRoute } from "routes/route";
import { getResourceAttributes, pickActions } from "routes/resources/resource_helpers";

export function buildResources(path, config, routesConfig) {
  let attrs = getResourceAttributes(path, config, routesConfig);

  if (config.singleton) {
    return pickActions({
      show: singletonShowRoute(attrs, routesConfig),
      new: singletonNewRoute(attrs, routesConfig),
      edit: singletonEditRoute(attrs, routesConfig)
    }, config);
  } else {  
    return pickActions({
      index: indexRoute(attrs, routesConfig),
      show: showRoute(attrs, routesConfig),
      new: newRoute(attrs, routesConfig),
      edit: editRoute(attrs, routesConfig)
    }, config);
  }
}

function indexRoute({resourcePath, resourceName}, routesConfig) {
  return buildRoute(
    resourcePath, 
    { name: resourceName },
    routesConfig
  );
}

function showRoute({resourcePath, param, singularName}, routesConfig) {
  return buildRoute(
    joinPaths([resourcePath, param]), 
    { name: singularName }, 
    routesConfig
  );
}

function newRoute({resourcePath, singularName}, routesConfig) {
  return buildRoute(
    joinPaths([resourcePath, "new"]), 
    { name: joinNames(["new", singularName]) }, 
    routesConfig
  );
}

function editRoute({resourcePath, param, singularName}, routesConfig) {
  return buildRoute(
    joinPaths([resourcePath, param, "edit"]), 
    { name: joinNames(["edit", singularName]) }, 
    routesConfig
  );
}

function singletonShowRoute({resourcePath, resourceName}, routesConfig) {
  return buildRoute(
    resourcePath,
    { name: resourceName },
    routesConfig
  );
}

function singletonNewRoute({resourcePath, resourceName}, routesConfig) {
  return buildRoute(
    joinPaths([resourcePath, "new"]),
    { name: joinNames(["new", resourceName]) },
    routesConfig
  );
}

function singletonEditRoute({resourcePath, resourceName}, routesConfig) {
  return buildRoute(
    joinPaths([resourcePath, "edit"]),
    { name: joinNames(["edit", resourceName]) },
    routesConfig
  );
}