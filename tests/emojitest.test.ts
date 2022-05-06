import { test, expect, describe, it } from "vitest";
import { generateEmoji, verifyEmoji } from "../lib/cjs/index";
import { IEmojiRes } from "../lib/cjs/types";

const secret = "I love my viewers";

let emojiRes: IEmojiRes;

describe("Test emoji generator", () => {
  test("Generate emoji", async () => {
    const emoji = await generateEmoji({ secret });
    expect(emoji).toHaveProperty("question");
    expect(emoji).toHaveProperty("answer");
    expect(emoji).toHaveProperty("emojis");

    emojiRes = emoji;
    console.log(JSON.stringify(emoji));
  });
  test("Throw error if secret not passed", async () => {
    await expect(generateEmoji({ secret: null })).rejects.toThrowError(
      /must pass a secret/
    );
    //@ts-ignore
    await expect(generateEmoji()).rejects.toThrowError(/options/);
  });
});

// describe("Test emoji verify", () => {
//   it("Verify emoji answer", async () => {
//     const isCorrect = await verifyEmoji({
//       secret,
//       selectedIdx: 2,
//       answerHash: emojiRes.answer,
//     });
//     expect(typeof isCorrect === "boolean").toBeTruthy();
//   });
//
//   it("Should throw error", async () => {
//     await expect(
//       verifyEmoji({ secret: "alalala", selectedIdx: 10, answerHash: "" })
//     ).rejects.toThrow("Decrypt failed");
//   });
// });
