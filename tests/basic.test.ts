import { expect, test } from "vitest";
import { generateEmoji, verifyEmoji } from "../lib/cjs";

// Edit an assertion and save to see HMR in action

// temp secret env should be used for this
const secret = Date.now().toString();

const emojiCount = 5;

let emojiAnswerCipher: string;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("Test emoji generator", async () => {
  const emojiRes = await generateEmoji({
    secret,
    expiry: 1,
    emojiCount,
    encoding: "svg-xml",
  });
  expect(emojiRes).toHaveProperty("question");
  expect(emojiRes).toHaveProperty("answer");
  expect(emojiRes).toHaveProperty("emojis");
  expect(emojiRes.emojis).toHaveLength(emojiCount);

  console.log(`Got ${emojiRes.emojis.length} emojis`);

  // store the answer cypther index
  emojiAnswerCipher = emojiRes.answer;
  console.log(emojiRes.answer);
});

test("Test emoji verifier", async () => {
  await sleep(596);
  const isCorrect = await verifyEmoji({
    secret,
    answerHash: emojiAnswerCipher,
    selectedIdx: 3,
  });
  console.log("Selected option was", isCorrect);
  expect(typeof isCorrect === "boolean").toBeTruthy();
});
