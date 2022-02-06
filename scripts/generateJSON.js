import emojiGroups from "./emoji_groups.json" assert { type: "json" };

import Database from "better-sqlite3";

import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// getRandomSubgroups();
//

const db = Database(path.resolve(__dirname, "emoji.db"), {
  fileMustExist: true,
});

emojiGroups.forEach(({ name }) => {
  const resp = db
    .prepare(`select * from emoji where sub_group = '${name}'`)
    .all();
  const json = resp.map((emo) => {
    const twemojiFile = emo.codepoints.split(" ")[0].toLowerCase();
    const twFilePath = path.resolve(
      __dirname,
      `../twemoji-svg/${twemojiFile}.svg`
    );
    try {
      const svgStr = readFileSync(twFilePath, { encoding: "utf8" });
      return { ...emo, svg: svgStr.toString() };
    } catch (error) {
      console.log("Didn't find", emo.codepoints);
      return { ...emo, svg: null };
    }
  });
  writeFileSync(`data/${name}.json`, JSON.stringify(json), {
    encoding: "utf8",
  });
  console.log(name);
});

const getRandomEmojis = () => {
  // console.log(resp.all());
};

getRandomEmojis();
