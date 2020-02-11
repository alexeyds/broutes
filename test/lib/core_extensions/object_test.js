import test from "enhanced-tape";
import { map, hasKey } from "core_extensions/object";

test("core extension: object", function(t) {
  t.test("map", function(t) {
    t.test("maps key-value pairs in object", function(t) {
      let result = map({a: 1, b: 2}, ([k, v]) => [k + "_test", v + 1]);

      t.same(result, {a_test: 2, b_test: 3});

      t.end();
    });

    t.test("doesn't modify original object", function(t) {
      let original = {a: 1, b: 2};
      let result = map(original, ([k, v]) => [k, v+1]);

      t.same(original, {a: 1, b: 2});
      t.notEqual(original, result);
    
      t.end();
    });
  });

  t.test("hasKey", function(t) {
    t.true(hasKey({a: 1}, "a"), "true if object has matching key");
    t.false(hasKey({a: 1}, "b"), "false if object has no matching key");

    t.end();
  });
});