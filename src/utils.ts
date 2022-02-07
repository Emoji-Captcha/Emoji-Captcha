import { IEmoji, ISubgroup } from "./types";

export const getRandomFromMax = (max: number) => {
  return Math.floor(Math.random() * max);
};

/**
 * Get random group names collection from 100+ subgroups
 */
export const getRandomGroups = (count: number, groupList: ISubgroup[]) => {
  // will have all the names of subgroups
  const groups = new Set<typeof groupList[number]>();

  const getRandomGroupName = () => {
    const randomGroupIdx = getRandomFromMax(groupList.length);
    return groupList[randomGroupIdx];
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

export const pickRandomEmojisFromGroup = async (groups: Set<ISubgroup>) => {
  const emojis: IEmoji[] = [];

  // get random emoji from all group
  for (const group of groups) {
    const emojiList: IEmoji[] = await import(
      /* webpackMode: "eager" */ `./data/${group.name}.json`
    );
    const randEmojiIdx = getRandomFromMax(group.count);
    emojis.push(emojiList[randEmojiIdx]);
  }

  return emojis;
};
