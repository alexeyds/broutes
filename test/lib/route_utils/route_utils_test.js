import test from "enhanced-tape";
import { maybeAppendQuery, joinPaths, pathToName, joinNames } from "route_utils";

test("route_utils", function(t) {
  t.test("maybeAppendQuery", function(t) {
    t.test("does nothing if query is falsy", function(t) {
      let path = maybeAppendQuery("/users", undefined);
      t.equal(path, "/users");

      t.end();
    });

    t.test("appends string query to path", function(t) {
      let path = maybeAppendQuery("/users", "id=1");
      t.equal(path, "/users?id=1");
    
      t.end();
    });

    t.test("can build query from object", function(t) {
      let path = maybeAppendQuery("/users", {id: 1});
      t.equal(path, "/users?id=1");
    
      t.end();
    });

    t.test("correctly joins existing query in path", function(t) {
      let path = maybeAppendQuery("/users?ref=partner", {id: 1});
      t.equal(path, "/users?ref=partner&id=1");
    
      t.end();
    });
  });

  t.test("joinPaths", function(t) {
    t.test("returns empty string if path array is empty", function(t) {
      let path = joinPaths([]);
      t.equal(path, "");
    
      t.end();
    });

    t.test("returns single path unmodified", function(t) {
      let path = joinPaths(["https://foobar.com/test"]);
      t.equal(path, "https://foobar.com/test");
    
      t.end();
    });

    t.test("joins paths with /", function(t) {
      let path = joinPaths(["/api", "v2", "users"]);
      t.equal(path, "/api/v2/users");
    
      t.end();
    });

    t.test("respects existing leading slashes", function(t) {
      let path = joinPaths(["https://test.com", "/api", "/users"]);
      t.equal(path, "https://test.com/api/users");
    
      t.end();
    });
  });

  t.test("pathToName", function(t) {
    t.equal(pathToName("/users"), "users", "converts simple paths to name");
    t.equal(pathToName("/users/edit"), "users", "converts complex paths to name");
    t.equal(pathToName("users"), "users", "converts paths without slashes");
    t.equal(pathToName("/my_orders"), "my_orders", "converts paths with underscores");
    t.equal(pathToName("/my-orders"), "my-orders", "converts paths with dashes");
    t.equal(pathToName("/"), null, "returns null if path is unconvertable");

    t.end();
  });

  t.test("joinNames", function(t) {
    t.equal(joinNames(['api', 'users']), "apiUsers", "joins and capitalizes names");
  
    t.end();
  });
});