import jutest from "jutest";
import { capitalize } from "core_extensions/string";
import { joinBy } from "core_extensions/array";

jutest("core extensions: array", s => {
  s.describe("joinBy()", s => {
    s.test("returns empty string for empty array", t => {
      t.equal(joinBy([], capitalize), "");
    });

    s.test("returns single element from array unmodified", t => {
      t.equal(joinBy(["user"], capitalize), "user");
    });

    s.test("applies function to 1..n elements of the array before joining it", t => {
      t.equal(joinBy(["api", "user", "path"], capitalize), "apiUserPath");
    });
  });
});