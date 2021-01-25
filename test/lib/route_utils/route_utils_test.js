import jutest from "jutest";
import { maybeAppendQuery, joinPaths, pathToName, joinNames } from "route_utils";

jutest("route_utils", s => {
  s.describe("maybeAppendQuery", s => {
    s.test("does nothing if query is falsy", t => {
      let path = maybeAppendQuery("/users", undefined);
      t.equal(path, "/users");
    });

    s.test("appends string query to path", t => {
      let path = maybeAppendQuery("/users", "id=1");
      t.equal(path, "/users?id=1");
    });

    s.test("can build query from object", t => {
      let path = maybeAppendQuery("/users", {id: 1});
      t.equal(path, "/users?id=1");
    });

    s.test("correctly joins existing query in path", t => {
      let path = maybeAppendQuery("/users?ref=partner", {id: 1});
      t.equal(path, "/users?ref=partner&id=1");
    });
  });

  s.describe("joinPaths", s => {
    s.test("returns empty string if path array is empty", t => {
      let path = joinPaths([]);
      t.equal(path, "");
    });

    s.test("returns single path unmodified", t => {
      let path = joinPaths(["https://foobar.com/test"]);
      t.equal(path, "https://foobar.com/test");
    });

    s.test("joins paths with /", t => {
      let path = joinPaths(["/api", "v2", "users"]);
      t.equal(path, "/api/v2/users");
    });

    s.test("respects existing leading slashes", t => {
      let path = joinPaths(["https://test.com", "/api", "/users"]);
      t.equal(path, "https://test.com/api/users");
    });
  });

  s.describe("pathToName", s => {

    s.test("converts simple paths to name", t => {
      t.equal(pathToName("/users"), "users");
    });

    s.test("converts complex paths to name", t => {
      t.equal(pathToName("/users/edit"), "users");
    });

    s.test("converts paths without slashes", t => {
      t.equal(pathToName("users"), "users");
    });

    s.test("converts paths with underscores", t => {
      t.equal(pathToName("/my_orders"), "my_orders");
    });

    s.test("converts paths with dashes", t => {
      t.equal(pathToName("/my-orders"), "my-orders");
    });

    s.test("returns null if path is unconvertable", t => {
      t.equal(pathToName("/"), null);
    });
  });

  s.describe("joinNames", s => {

    s.test("joins and capitalizes names", t => {
      t.equal(joinNames(['api', 'users']), "apiUsers");
    });
  });
});
