export function hasKey(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}
