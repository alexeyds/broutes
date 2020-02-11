import { hasKey } from "core_extensions/object";
import { buildRoutesConfig, addScope } from "routes/routes_config";
import { buildRoute } from "routes/route";
import { buildScope } from "routes/scope";
import { buildResources } from "routes/resources";

export default function composeRoutes(routesBody, config={}) {
  let routesConfig = buildRoutesConfig(config);
  let { routes } = routesConfig;

  function route(path, opts={}) {
    let route = buildRoute(path, opts, routesConfig);

    addRoute(route, routes);
  }

  function scope(path, scopeBody, opts={}) {
    let scope = buildScope(path, opts);

    composeRoutes(scopeBody, addScope(routesConfig, scope));
  }

  function resources(path, opts={}) {
    let resources = buildResources(path, opts, routesConfig);

    resources.forEach(route => addRoute(route, routes));
  }

  routesBody({
    route,
    scope,
    resources
  });

  return routes;
}

function addRoute(route, routes) {
  let pathHelper = `${route.name}Path`;
  let urlHelper = `${route.name}Url`;

  if (hasKey(routes, pathHelper)) {
    throw new Error(`Route "${route.name}" was already defined in routes, make sure that all routes have a unique identifier`);
  }

  routes[pathHelper] = route.toPath;
  routes[urlHelper] = route.toUrl;
}