import jutest from "jutest";
import { map, hasKey } from "core_extensions/object";

jutest("core extension: object", s => {
  s.describe("map", s => {
    s.test("maps key-value pairs in object", t => {
      let result = map({a: 1, b: 2}, ([k, v]) => [k + "_test", v + 1]);

      t.same(result, {a_test: 2, b_test: 3});
    });

    s.test("doesn't modify original object", t => {
      let original = {a: 1, b: 2};
      let result = map(original, ([k, v]) => [k, v+1]);

      t.same(original, {a: 1, b: 2});
      t.notEqual(original, result);
    });
  });

  s.describe("hasKey", s => {
    s.test("true if object has matching key", t => {
      t.equal(hasKey({a: 1}, "a"), true);
    });

    s.test("false if object has no matching key", t => {
      t.equal(hasKey({a: 1}, "b"), false);
    });
  });
});