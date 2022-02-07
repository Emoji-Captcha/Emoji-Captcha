export interface IEmojiRes {
  question: string;
  answer: string;
  emojis: string[];
}

export interface GenerateEmojiParams {
  emojiCount?: number;
  secret: string;
}

export interface VerifyEmojiParams {
  selectedIdx: number;
  answerHash: string;
  secret: string;
}

export interface IEmoji {
  emoji: string;
  name: string;
  group: string;
  sub_group: string;
  codepoints: string;
  svg: string;
}

export interface ISubgroup {
  name: string;
  count: number;
}