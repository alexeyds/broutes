import { camelize } from "core_extensions/string";
import { pathToName } from "route_utils";
import { simpleSingularize } from "core_extensions/string";

export function buildRoutesConfig({
  host,
  scopes=[],
  singularizeResource=simpleSingularize
}={}) {
  let guessRouteName = (path) => {
    let name = pathToName(path);

    if (name) {
      return camelize(name);
    } else {
      return name;
    }
  };

  return { host, scopes, singularizeResource, guessRouteName };
}
