import test from "enhanced-tape";
import { capitalize } from "core_extensions/string";

test("core extenstions: String", function(t) {
  t.test("capitalize()", function(t) {
    t.test("capitalizes string", function(t) {
      t.equal(capitalize("foo"), "Foo");

      t.end();
    });
  });

  t.end();
});