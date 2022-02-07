import { aesGcmDecrypt, aesGcmEncrypt } from "./encryption";
import { GenerateEmojiParams, IEmojiRes, VerifyEmojiParams } from "./types";
import {
  getRandomFromMax,
  getRandomGroups,
  pickRandomEmojisFromGroup,
} from "./utils";

import subgroups from "./data/emoji_groups.json";

/**
 * @typedef {Object} GeneratorOptions
 * @property {number} emojiCount
 * Number of emojis you want in your array
 * min 3 max 10 default to 3
 * @property {string} secret
 * A secret key which will be used for
 * encrypting and decrypting the answer
 */

/*
 * Generates random emojis in base64
 *
 * @param {GeneratorOptions}
 */
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

  const emojiGroups = getRandomGroups(emojiCount, subgroups);
  const emojis = await pickRandomEmojisFromGroup(emojiGroups);

  const encodedSvgs = emojis.map((emoji) => btoa(emoji.svg));
  const randomEmojiIdx = getRandomFromMax(emojis.length).toString();

  return {
    answer: await aesGcmEncrypt(randomEmojiIdx, secret),
    emojis: encodedSvgs,
    question: emojis[randomEmojiIdx].name,
  };
};

export const verifyEmoji = async ({
  selectedIdx,
  answerHash,
  secret,
}: VerifyEmojiParams) => {
  // check if all the params are passed
  switch (undefined) {
    case selectedIdx:
      throw new Error("Selected index is required");

    case answerHash:
      throw new Error("Answer hash is required");

    case secret:
      throw new Error("Secret is required");

    default:
      break;
  }

  try {
    const correctIdx = await aesGcmDecrypt({
      ciphertext: answerHash,
      password: secret,
    });

    if (+correctIdx === selectedIdx) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(
      "Error occured while decrypting the cipher, Are you sure your hash and secret is correct?\n Error:" +
        error
    );
  }
};
