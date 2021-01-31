import { pathToName, joinPaths, removeTrailingSlashes } from "utils/path";
import compileRoute from "route/compile_route";

export function routeFragment(path, { name, defaultParams={} }={}) {
  if (!path) throw new TypeError(`Path cannot be empty.`);

  return {
    path,
    defaultParams,
    name: name === undefined ? pathToName(path) : name
  };
}

export function compileFragments(fragments) {
  let path = removeTrailingSlashes(joinPaths(fragments.map(f => f.path)));
  let defaultParams = fragments.reduce((acc, f) => (Object.assign(acc, f.defaultParams)), {});

  let result = compileRoute(path, defaultParams);
  result.raw = path;
  return result;
}
