import jutest from "jutest";
import { hasKey } from "utils/object";

jutest("utils/object", s => {
  s.describe("hasKey", s => {
    s.test("true if object has matching key", t => {
      t.equal(hasKey({a: 1}, "a"), true);
    });

    s.test("false if object has no matching key", t => {
      t.equal(hasKey({a: 1}, "b"), false);
    });
  });
});