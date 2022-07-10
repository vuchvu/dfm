import { assertEquals } from "https://deno.land/std@0.145.0/testing/asserts.ts";
import { join } from "https://deno.land/std@0.145.0/path/mod.ts";
import { expand_tilde, resolve_path } from "../util/mod.ts";

const home = Deno.env.get("HOME") ?? "";
const pwd = Deno.env.get("PWD") ?? "";

// no tilde
Deno.test("expand_tilde #1", () => {
  const expect = "test/hoge/~";
  const actual = expand_tilde("test/hoge/~");
  return assertEquals(expect, actual);
});

// ~
Deno.test("expand_tilde #2", () => {
  const expect = home;
  const actual = expand_tilde("~");
  return assertEquals(expect, actual);
});

// ~/hoge/hugo
Deno.test("expand_tilde #3", () => {
  const expect = join(home, "hoge/hugo");
  const actual = expand_tilde("~/hoge/hugo");
  return assertEquals(expect, actual);
});

const basedir = "/home/hoge";

//   ~   $BASEDIR  ->  $HOME
Deno.test("resolve_path #1", () => {
  const expect = home;
  const actual = resolve_path("~", basedir);
  return assertEquals(expect, actual);
});

//   ../ $BASEDIR  ->  $BASEDIR/../
Deno.test("resolve_path #1", () => {
  const expect = "/home";
  const actual = resolve_path("../", basedir);
  return assertEquals(expect, actual);
});

//   ./  $BASEDIR  ->  $BASEDIR
Deno.test("resolve_path #2", () => {
  const expect = basedir;
  const actual = resolve_path("./", basedir);
  return assertEquals(expect, actual);
});

//   a   $BASEDIR  ->  $BASEDIR/a
Deno.test("resolve_path #3", () => {
  const expect = join(basedir, "a");
  const actual = resolve_path("a", basedir);
  return assertEquals(expect, actual);
});

//   ./hoge/hugo   -> join($(pwd), "./hoge/hugo")
Deno.test("resolve_path #4", () => {
  const expect = join(pwd, "./hoge/hugo");
  const actual = resolve_path("./hoge/hugo");
  return assertEquals(expect, actual);
});

//   /hoge/hugo    -> "/hoge/hugo"
Deno.test("resolve_path #5", () => {
  const expect = "/hoge/hugo";
  const actual = resolve_path("/hoge/hugo");
  return assertEquals(expect, actual);
});

//   ~/hoge        -> "$HOME/hoge"
Deno.test("resolve_path #6", () => {
  const expect = join(home, "hoge");
  const actual = resolve_path("~/hoge");
  return assertEquals(expect, actual);
});
