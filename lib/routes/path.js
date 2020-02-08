import { capitalize } from "core_extensions/string";
import { joinBy } from "core_extensions/array";
import { maybeAppendQuery, joinPaths } from "route_utils";
import PathCompiler from "route_utils/path_compiler";

export function buildPath(path, {name, defaultParams}, routesConfig) {
  let { guessPathName, host, scopes } = routesConfig;
  name = name || guessPathName(path);

  if (!name) {
    throw new Error(`Unable to guess route name from provided path: "${path}". Use {name} option to name this route."`);
  }

  path =  addScopePaths(path, scopes);
  name = addScopeNames(name, scopes);
  defaultParams = addScopeParams(defaultParams, scopes);

  let compiledPath = new PathCompiler(path, { defaultParams });
  function toPath(params, options={}) {
    return maybeAppendQuery(compiledPath.toPath(params), options.query);
  }

  function toUrl() {
    return joinPaths([host, toPath(...arguments)]);
  }

  toPath.rawPath = path;

  return {
    name,
    toPath,
    toUrl
  };
}

function addScopePaths(ownPath, scopes) {
  let scopePaths = scopes.map(s => s.path);
  
  return joinPaths([...scopePaths, ownPath]);
}

function addScopeNames(ownName, scopes) {
  let scopeNames = scopes.filter(s => s.name).map(s => s.name);

  return joinBy([...scopeNames, ownName], capitalize);
}

function addScopeParams(ownParams, scopes) {
  let scopeParams = {};

  scopes.forEach(scope => {
    scopeParams = {...scopeParams, ...scope.defaultParams};
  });

  return {...scopeParams, ...ownParams};
}