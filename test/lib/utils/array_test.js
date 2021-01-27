import jutest from "jutest";
import { capitalize } from "utils/string";
import { joinBy, last, except } from "utils/array";

jutest("utils/array", s => {
  s.describe("joinBy()", s => {
    s.test("joins array elements by applying provided function", t => {
      t.equal(joinBy(["api", "user", "path"], capitalize), "apiUserPath");
    });

    s.test("returns empty string if array is empty", t => {
      t.equal(joinBy([], capitalize), "");
    });

    s.test("returns single element from array unmodified", t => {
      t.equal(joinBy(["user"], capitalize), "user");
    });
  });

  s.describe("last()", s => {
    s.test("returns last element of the array", t => {
      t.equal(last([1, 2, 3]), 3);
    });

    s.test("returns undefined if array has no elements", t => {
      t.equal(last([]), undefined);
    });
  });

  s.describe("except()", s => {
    s.test("excludes matches from array", t => {
      t.same(except([1, 2, 1], 1), [2]);
    });
  });
});
