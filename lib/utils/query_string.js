export function toQueryString(object) {
  let queryParts = [];

  for (let key in object) {
    let value = object[key];
    let encodedKey = encodeURIComponent(key);

    if (value === undefined) {
      continue;
    } else if (value === null) {
      queryParts.push(encodedKey);
    } else {
      queryParts.push(encodedKey + '=' + encodeURIComponent(value));
    }
  }

  return queryParts.join('&');
}

export function appendQueryString(path, queryString) {
  if (!queryString) return path;

  let joinWith = path.includes('?') ? '&' : '?';
  return path + joinWith + queryString;
}
