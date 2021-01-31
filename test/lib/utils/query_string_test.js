import jutest from "jutest";
import { toQueryString, appendQueryString } from "utils/query_string";

jutest("utils/query_string", s => {
  s.describe("toQueryString()", s => {
    s.test("converts object to query", t => {
      let result = toQueryString({a: 1, b: 1});
      t.equal(result, 'a=1&b=1');
    });

    s.test("returns empty string if object is falsy", t => {
      t.equal(toQueryString(undefined), '');
    });

    s.test("encodes both key and value", t => {
      let result = toQueryString({'a test': 'foo bar'});
      t.equal(result, 'a%20test=foo%20bar');
    });

    s.test("skips keys with undefined values", t => {
      let result = toQueryString({foo: undefined, bar: 'a'});
      t.equal(result, 'bar=a');
    });

    s.test("only preserves key name if value is null", t => {
      let result = toQueryString({foo: null, bar: 'a'});
      t.equal(result, 'foo&bar=a');
    });
  });

  s.describe("appendQueryString()", s => {
    s.test("does nothing if query string is empty", t => {
      let result = appendQueryString('/test', '');
      t.equal(result, '/test');
    });

    s.test("appends new query string to path", t => {
      let result = appendQueryString('/test', 'a=1');
      t.equal(result, '/test?a=1');
    });

    s.test("appends query string to existing one", t => {
      let result = appendQueryString('/test?a=1', 'b=2');
      t.equal(result, '/test?a=1&b=2');
    });
  });
});
