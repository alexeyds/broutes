export function joinBy(array, fun) {
  let result = "";

  for (let part of array) {
    if (result) {
      result += fun(part);
    } else {
      result = part;
    }
  }

  return result;
}