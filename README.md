# Emoji Captcha

Next gen captcha generator, which uses emojis to identify humans

![emoji captcha demo](https://user-images.githubusercontent.com/23727670/153011705-020be005-a1ab-4d1c-9ec3-4c6ed9def762.gif)


## Server Installation

Install emoji-captcha with npm

```bash
  npm install @emoji-captcha/server
```

Install emoji-captcha with yarn

```bash
  yarn add @emoji-captcha/server
```

## Server Usage/Examples

### Generate Emoji

Somewhere in your routes

```javascript
import { generateEmoji, verifyEmoji } from "@emoji-captcha/server";

const emojiRes = await generateEmoji({
  secret: env.top_secret,
  emojiCount: 5,
  encoding: "svg-xml",
});

//now send emojis to client form
```

Emoji properties

```javascript
{
  answer: "cipher containing correct index",
  emojis: [
    "svg 1",
    "svg 2",
    "svg 3",
    "svg 4",
    "svg 5",
  ],
  question: "man bowing"
}
```

### Verifying response

```javascript
const isCorrect = await verifyEmoji({
  secret: env.top_secret,
  answerHash: "cipher containing correct index",
  selectedIdx: 3, // emoji index which user picked
});
```
