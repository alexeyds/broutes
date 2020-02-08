import { compile } from "path-to-regexp";
import { map } from "core_extensions/object";

export default class PathCompiler {
  constructor(path, {defaultParams}={}) {
    this._compiledPath = compile(path);
    this._defaultParams = defaultParams;
  }

  toPath(params) {
    params = {...this._defaultParams, ...params};
    params = resolveFunctionalValues(params);
    return this._compiledPath(params);
  }
}

function resolveFunctionalValues(object) {
  return map(object, ([k, v]) => {
    v = typeof v === "function" ? v() : v;
    return [k, v];
  });
}