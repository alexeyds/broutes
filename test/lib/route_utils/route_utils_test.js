import test from "enhanced-tape";
import { maybeAppendQuery, joinPaths } from "route_utils";

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
});