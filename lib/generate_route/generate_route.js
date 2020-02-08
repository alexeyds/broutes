import { capitalize } from "core_extensions/string";
import { joinBy, ensureIsArray } from "core_extensions/array";
import { maybeAppendQuery, joinPaths } from "route_utils";
import PathCompiler from "route_utils/path_compiler";

export default function generateRoute(options) {
  return new Route(options);
}

class Route {
  constructor({name, path, scopes=[], host, defaultParams}) {
    let nameArray = ensureIsArray(name);
    this.pathName = joinBy([...nameArray, "path"], capitalize);
    this.urlName = joinBy([...nameArray, "url"], capitalize);

    this.rawPath = joinPaths([...scopes, path]);
    this.host = host;
    this._pathCompiler = new PathCompiler(this.rawPath, { defaultParams });

    this.toPath = this.toPath.bind(this);
    this.toFullUrl = this.toFullUrl.bind(this);
  }

  toPath(params, options={}) {
    let path = this._pathCompiler.toPath(params);
    return maybeAppendQuery(path, options.query);
  }

  toFullUrl() {
    let path = this.toPath(...arguments);

    if (this.host) {
      return joinPaths([this.host, path]);
    } else {
      return path;
    }
  }
}