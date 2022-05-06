import { XMLParser } from "fast-xml-parser";
import { IEmoji, ISubgroup } from "./types";

export const getRandomFromMax = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const getRandomFloatFromMax = (max: number) => {
  return +(Math.random() * max).toFixed(3);
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

export const disortSvg = (emojis: IEmoji[]) => {
  const xmlParser = new XMLParser({ stopNodes: ["svg"] });

  return emojis.map((emoji) => {
    const parsed: { svg: string } = xmlParser.parse(emoji.svg);

    const randFreq = getRandomFloatFromMax(5);

    const modifiedSvg = `
<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 36 36\">
  <filter id="displacementFilter">
    <feTurbulence type="turbulence" baseFrequency="${randFreq}"
        numOctaves="10" result="turbulence"/>
    <feDisplacementMap in2="turbulence" in="SourceGraphic"
        scale="5" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <g style="filter: url(#displacementFilter)">
    ${parsed.svg}
  </g>
</svg>
`;

    return { ...emoji, svg: modifiedSvg };
  });
};
