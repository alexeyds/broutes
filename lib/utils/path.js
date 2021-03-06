import { camelize } from "utils/string";
import { last, joinBy, except } from "utils/array";

export function pathToName(path) {
  let match = path.match(/([\w-]+)/g);
  if (match) {
    let name = camelize(last(match));
    return name ? name : null;
  } else {
    return null;
  }
}

export function joinPaths(paths) {
  return joinBy(except(paths, ''), normalizeLeadingSlash);
}

export function normalizeLeadingSlash(path) {
  return '/' + path.replace(/^\/+/, '');
}

export function removeTrailingSlashes(path) {
  if (/^\/+$/.test(path)) {
    return '/';
  } else {
    return path.replace(/\/+$/, '');
  }
}