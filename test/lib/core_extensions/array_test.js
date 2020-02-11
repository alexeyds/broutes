import test from "enhanced-tape";
import { capitalize } from "core_extensions/string";
import { joinBy, ensureIsArray } from "core_extensions/array";

test("core extensions: array", function(t) {
  t.test("joinBy", function(t) {
    t.equal(joinBy([], capitalize), "", "returns empty string for empty array");
    t.equal(joinBy(["user"], capitalize), "user", "returns single element from array unmodified");
    t.equal(joinBy(["api", "user", "path"], capitalize), "apiUserPath", "applies function to 1..n elements of the array before joining it");

    t.end();
  });
});