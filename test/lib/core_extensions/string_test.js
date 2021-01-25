import jutest from "jutest";
import { capitalize, camelize, simpleSingularize } from "core_extensions/string";

jutest("core extenstions: String", s => {
  s.describe("capitalize()", s => {
    s.test("capitalizes string", t => {
      t.equal(capitalize("foo"), "Foo");
    });
  });

  s.describe("camelize()", s => {
    s.test("returns camelized strings unchanged", t => {
      t.equal(camelize("fooBar"), "fooBar");
    });

    s.test("camelizes underscore_notation", t => {
      t.equal(camelize("foo_bar_test"), "fooBarTest");
    });

    s.test("camelizes dashed-notation", t => {
      t.equal(camelize("foo-bar-test"), "fooBarTest");
    });
  });

  s.describe("simpleSingularize()", s => {
    s.test("removes last letter from the word", t => {
      t.equal(simpleSingularize("users"), "user");
    });
  });
});