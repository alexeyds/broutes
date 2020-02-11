export function map(object, fun) {
  let result = {};

  for (let k in object) {
    let [key, value] = fun([k, object[k]]);
    result[key] = value;
  }

  return result;
}

export function hasKey(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}