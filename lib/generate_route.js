import { compile } from "path-to-regexp";
import { maybeAppendQuery, joinPaths } from "route_utils";

export default function generateRoute(options) {
  return new Route(options);
}

class Route {
  constructor({name, path, scopes=[], hostname}) {
    this.pathName = `${name}Path`;
    this.urlName = `${name}Url`;
    this.rawPath = joinPaths([...scopes, path]);
    this.hostname = hostname;
  }

  get compilePath() {
    if (!this._lazyCompilePath) {
      this._lazyCompilePath = compile(this.rawPath);
    }
    return this._lazyCompilePath;
  }

  toPath(params, options={}) {
    let path = this.compilePath(params);
    return maybeAppendQuery(path, options.query);
  }

  toFullUrl() {
    let path = this.toPath(...arguments);

    if (this.hostname) {
      return joinPaths([this.hostname, path]);
    } else {
      return path;
    }
  }
}