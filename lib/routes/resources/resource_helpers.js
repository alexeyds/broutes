export function getResourceAttributes(path, {name, singularName, param="id"}, routesConfig) {
  let { guessRouteName, singularizeResource } = routesConfig;
  let resourceName = name || guessRouteName(path);

  return {
    resourcePath: path,
    resourceName,
    singularName: singularName || singularizeResource(resourceName),
    param: `:${param}`
  };
}

export function pickActions(actions, {only=Object.keys(actions), except=[]}) {
  return Object.entries(actions).
    filter(([a]) => shouldIncludeAction(a, {only, except})).
    map(([, v]) => v);
}

function shouldIncludeAction(action, {only, except}) {
  if (except.includes(action)) {
    return false;
  } else {
    return only.includes(action);
  }
}