import emojiGroups from "./data/emoji_groups.json";

import { aesGcmEncrypt } from "./encryption";
import { getRandomFromMax } from "./utils";

export interface IEmojiRes {
  question: string;
  answer: string;
  emojis: string[];
}

interface GenerateEmojiParams {
  emojiCount?: number;
  secret: string;
}

/**
 * Get random group names collection from 100+ subgroups
 */
const getRandomGroups = (count: number) => {
  // will have all the names of subgroups
  const groups = new Set<typeof emojiGroups[number]>();

  const getRandomGroupName = () => {
    const randomGroupIdx = getRandomFromMax(emojiGroups.length);
    return emojiGroups[randomGroupIdx];
  };

  const generateGroupNames = () => {
    const randGroup = getRandomGroupName();
    if (groups.has(randGroup)) {
      return generateGroupNames();
    }
    groups.add(randGroup);
  };

  // Calls generateGroupNames for `count` times
  Array.from({ length: count }, generateGroupNames);

  return groups;
};

interface IEmoji {
  emoji: string;
  name: string;
  group: string;
  sub_group: string;
  codepoints: string;
  svg: string;
}

const pickRandomEmojisFromGroup = async (
  groups: Set<typeof emojiGroups[number]>
) => {
  const emojis: IEmoji[] = [];

  // get random emoji from all group
  for (const group of groups) {
    const emojiList: IEmoji[] = await import(`./data/${group.name}.json`);
    const randEmojiIdx = getRandomFromMax(group.count);
    emojis.push(emojiList[randEmojiIdx]);
  }

  return emojis;
};

export const generateEmoji = async ({
  emojiCount = 3,
  secret,
}: GenerateEmojiParams): Promise<IEmojiRes> => {
  if (!secret) {
    throw new Error(
      "You must pass a secret, which will be used to encrypt & decrypt answer"
    );
  }
  if (emojiCount > 10 || emojiCount < 3) {
    throw new Error("Emoji count needs to be in range of 3 to 10");
  }

  const emojiGroups = getRandomGroups(emojiCount);
  const emojis = await pickRandomEmojisFromGroup(emojiGroups);

  const encodedSvgs = emojis.map((emoji) =>
    Buffer.from(emoji.svg).toString("base64")
  );
  const randomEmojiIdx = getRandomFromMax(emojis.length).toString();

  return {
    answer: await aesGcmEncrypt(randomEmojiIdx, secret),
    emojis: encodedSvgs,
    question: emojis[randomEmojiIdx].name,
  };
};

generateEmoji({ emojiCount: 10, secret: "cool" }).then((data) =>
  console.log(data)
);
