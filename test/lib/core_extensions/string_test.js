import test from "enhanced-tape";
import { capitalize, camelize } from "core_extensions/string";

test("core extenstions: String", function(t) {
  t.test("capitalize()", function(t) {
    t.test("capitalizes string", function(t) {
      t.equal(capitalize("foo"), "Foo");

      t.end();
    });
  });

  t.test("camelize()", function(t) {
    t.equal(camelize("fooBar"), "fooBar", "returns camelized strings unchanged");
    t.equal(camelize("foo_bar_test"), "fooBarTest", "camelizes underscore_notation");
    t.equal(camelize("foo-bar-test"), "fooBarTest", "camelizes dashed-notation");

    t.end();
  });
});