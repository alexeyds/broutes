import { compile } from "path-to-regexp";

export default function compileRoute(path, defaultParams) {
  let routeCompiler = compile(path);
  return (params) => routeCompiler(compileParams(params, defaultParams));
}

function compileParams(params, defaultParams) {
  let result = { ...defaultParams, ...params };

  for (let k in result) {
    let v = result[k];
    if (typeof v === 'function') result[k] = v();
  }

  return result;
}
