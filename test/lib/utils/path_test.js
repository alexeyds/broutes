import jutest from "jutest";
import { pathToName, joinPaths, normalizeLeadingSlash } from "utils/path";

jutest("utils/path", s => {
  s.describe("pathToName()", s => {
    s.test("works on simple paths", t => {
      t.equal(pathToName('/users'), 'users');
      t.equal(pathToName('users'), 'users');
    });

    s.test("camelizes path name", t => {
      t.equal(pathToName('/test-users'), 'testUsers');
    });

    s.test("uses last part of a complex path", t => {
      t.equal(pathToName('/users/new/'), 'new');
    });

    s.test("returns 'root' for / path", t => {
      t.equal(pathToName('/'), 'root');
    });

    s.test("returns null if name cannot be guessed", t => {
      t.equal(pathToName('///'), null);
      t.equal(pathToName('/---'), null);
    });
  });

  s.describe("joinPaths()", s => {
    s.test("joins simple paths", t => {
      t.equal(joinPaths(['/test', '/users']), '/test/users');
    });

    s.test("normalizes slashes between paths", t => {
      t.equal(joinPaths(['/test', '///users', '/foo']), '/test/users/foo');
    });

    s.test("ignores empty strings", t => {
      t.equal(joinPaths(['/test', '', '/users']), '/test/users');
    });
  });

  s.describe("normalizeLeadingSlash()", s => {
    s.test("appends leading slash to path", t => {
      t.equal(normalizeLeadingSlash('test'), '/test');
    });

    s.test("does nothing if path already starts with a slash", t => {
      t.equal(normalizeLeadingSlash('/test'), '/test');
    });

    s.test("removes all extra leading slashes", t => {
      t.equal(normalizeLeadingSlash('///test'), '/test');
    });

    s.test("preserves non-leading slashes", t => {
      t.equal(normalizeLeadingSlash('test/user'), '/test/user');
    });
  });
});
