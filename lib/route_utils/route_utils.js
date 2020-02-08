import { stringify as stringifyQuery } from "query-string";

export function maybeAppendQuery(path, query) {
  if (query) {
    let joinWith = hasOwnQuery(path) ? "&" : "?";
    let queryString = toQueryString(query);

    return [path, queryString].join(joinWith);
  } else {
    return path;
  }
}

function hasOwnQuery(path) {
  return path.includes("?");
}

function toQueryString(query) {
  if (typeof query === "string") {
    return query;
  } else {
    return stringifyQuery(query);
  }
}

export function joinPaths(paths) {
  let path = "";

  for (let part of paths) {
    if (path) {
      path += ensureHasLeadingSlash(part);
    } else {
      path = part;
    }
  }
  return path;
}

function ensureHasLeadingSlash(string) {
  if (string.startsWith("/")) {
    return string;
  } else {
    return "/" + string;
  }
}

export function pathToName(path) {
  let match = path.match(/(\w+)/);
  
  if (match) {
    return match[1];
  } else {
    return null;
  }
}