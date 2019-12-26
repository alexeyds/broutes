import { compile } from "path-to-regexp";
import { maybeAppendQuery, joinPaths } from "route_utils";

export default function generateRoute(options) {
  return new Route(options);
}

class Route {
  constructor({name, path, scopes=[], hostname, defaultParams}) {
    let nameArray = Array.isArray(name) ? name : [name];
    this.pathName = joinRouteName([...nameArray, "path"]);
    this.urlName = joinRouteName([...nameArray, "url"]);

    this.rawPath = joinPaths([...scopes, path]);
    this.hostname = hostname;
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
    let defaultParams = typeof this.defaultParams === "function" ? this.defaultParams() : this.defaultParams;
    params = Object.assign({}, defaultParams, params);

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

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}