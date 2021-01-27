import { joinBy } from "utils/array";

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function camelize(string) {
  return joinBy(string.split(/[_-]/g), capitalize);
}
