import { aesGcmDecrypt, aesGcmEncrypt } from "./encryption";
import {
  GenerateEmojiParams,
  IEmojiRes,
  IEncryptedData,
  VerifyEmojiParams,
} from "./types";
import {
  disortSvg,
  getRandomFromMax,
  getRandomGroups,
  pickRandomEmojisFromGroup,
} from "./utils";

import subgroups from "./data/emoji_groups.json";
import svgToTinyDataUri from "mini-svg-data-uri";
import { Resvg } from "@resvg/resvg-js";

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
export const generateEmoji = async (
  params: GenerateEmojiParams
): Promise<IEmojiRes> => {
  if (!params) {
    throw Error("No options passed");
  }

  const {
    emojiCount = 3,
    encoding = "png-base64",
    expiry = 120,
    secret,
  } = params;

  if (!secret) {
    throw Error(
      "You must pass a secret, which will be used to encrypt & decrypt answer"
    );
  }

  if (emojiCount > 10 || emojiCount < 3) {
    throw Error("Emoji count needs to be in range of 3 to 10");
  }

  const emojiGroups = getRandomGroups(emojiCount, subgroups);
  const rawEmojis = await pickRandomEmojisFromGroup(emojiGroups);

  const emojis = disortSvg(rawEmojis);

  let encodedSvgs: string[];

  // encode image based on the given options
  switch (encoding) {
    case "png-base64":
      encodedSvgs = emojis.map((emoji) => {
        const resvg = new Resvg(emoji.svg, {
          font: { loadSystemFonts: false },
        });
        const pngData = resvg.render();
        const b64 = pngData.asPng().toString("base64");
        return `data:image/png;base64,${b64}`;
      });

      break;

    case "URL-encoded":
      encodedSvgs = emojis.map(
        (emoji) =>
          `data:image/svg+xml;charset=US-ASCII,${encodeURIComponent(emoji.svg)}`
      );
      break;

    case "base64":
      encodedSvgs = emojis.map(
        (emoji) => `data:image/svg+xml;base64,${btoa(emoji.svg)}`
      );
      break;
    case "svg-xml":
      encodedSvgs = emojis.map((emoji) => emoji.svg);
      break;
    case "minified-uri":
      encodedSvgs = emojis.map((emoji) => svgToTinyDataUri(emoji.svg));
      break;
    default:
      break;
  }

  const randomEmojiIdx = getRandomFromMax(emojis.length);

  const encryptedData: IEncryptedData = {
    answerIdx: randomEmojiIdx,
    validity: Date.now() + expiry * 1000,
  };

  const answerToken = await aesGcmEncrypt(
    JSON.stringify(encryptedData),
    secret
  );

  return {
    answer: answerToken,
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

  const answerTokenRaw = await aesGcmDecrypt({
    ciphertext: answerHash,
    password: secret,
  });
  const { answerIdx, validity }: IEncryptedData = JSON.parse(answerTokenRaw);

  if (Date.now() > validity) {
    throw Error("Token expired");
  }

  if (answerIdx === selectedIdx) {
    return true;
  }
  return false;
};
