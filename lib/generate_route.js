import { compile } from "path-to-regexp";
import { map } from "core_extensions/object";
import { capitalize } from "core_extensions/string";
import { maybeAppendQuery, joinPaths } from "route_utils";

export default function generateRoute(options) {
  return new Route(options);
}

class Route {
  constructor({name, path, scopes=[], host, defaultParams}) {
    let nameArray = Array.isArray(name) ? name : [name];
    this.pathName = joinRouteName([...nameArray, "path"]);
    this.urlName = joinRouteName([...nameArray, "url"]);

    this.rawPath = joinPaths([...scopes, path]);
    this.host = host;
    this.defaultParams = defaultParams;

    this.toPath = this.toPath.bind(this);
    this.toFullUrl = this.toFullUrl.bind(this);
  }

  get compilePath() {
    if (!this._lazyCompilePath) {
      this._lazyCompilePath = compile(this.rawPath);
    }
    return this._lazyCompilePath;
  }

  toPath(params, options={}) {
    params = Object.assign({}, this.defaultParams, params);
    params = resolveFunctionalValues(params);

    let path = this.compilePath(params);
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

function resolveFunctionalValues(object) {
  return map(object, ([k, v]) => {
    v = typeof v === "function" ? v() : v;
    return [k, v];
  });
}

function joinRouteName(nameArray) {
  let result;

  for (let part of nameArray) {
    if (result) {
      result += capitalize(part);
    } else {
      result = part;
    }
  }

  return result;
}