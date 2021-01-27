export function joinBy(array, func) {
  let result = "";

  for (let part of array) {
    if (result) {
      result += func(part);
    } else {
      result = part;
    }
  }

  return result;
}

export function last(array) {
  return array[array.length - 1];
}

export function except(array, item) {
  return array.filter(i => i !== item);
}