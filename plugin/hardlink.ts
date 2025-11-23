import Dfm from "../main.ts";
import { Plugin } from "../types.ts";
import { Symlink } from "./mod.ts";
import {
  colors,
  dirname,
  ensureDirSync,
  ensureLinkSync,
  fromFileUrl,
  existsSync,
} from "../deps.ts";
const { green, red } = colors;

export default class Hardlink extends Symlink implements Plugin {
  name = "hardlink";

  constructor(dfm: Dfm, links: [string, string][]) {
    super(dfm, links);
  }

  stat() {
    // link()で指定されたリンクが正常に貼られているかを確認
    const stat = check_hardlinks(this.links);
    return stat;
  }

  sync() {
    // リンクが存在していなければ貼る
    ensure_make_hardlinks(this.links);
    console.log("OK");
    return true;
  }
}

function check_hardlinks(links: { from: URL; to: URL }[]): boolean {
  let stat = true;
  links.forEach((link) => {
    const ok = check_hardlink(link);
    if (!ok) {
      stat = false;
      console.log(
        `・ ${ok ? green("✔  ") : red("✘  ")} ${fromFileUrl(link.from)} → ${
          fromFileUrl(link.to)
        }`,
      );
    }
  });
  if (stat) {
    console.log("OK");
  }
  return stat;
}

// ハードリンクが作成されていそうかを確かめる
function check_hardlink(link: { from: URL; to: URL }): boolean {
    console.log(fromFileUrl(link.from))
  try {
    // Check for the presence of links
    const lstat = Deno.lstatSync(link.to);
    if (lstat.isFile) {
      // Check where the link points
      if (existsSync(fromFileUrl(link.from))) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (_) {
    return false;
  }
}

// if symlink does not exist, make symlink
function ensure_make_hardlinks(links: { from: URL; to: URL }[]): void {
  links.forEach((link) => {
    const from = fromFileUrl(link.from);
    const to = fromFileUrl(link.to);
    ensureDirSync(dirname(to));
    if (!check_hardlink(link)) {
      console.log(`・ ${green("✔  ")} ${from} → ${to}`);
      ensureLinkSync(from, to);
    }
  });
}