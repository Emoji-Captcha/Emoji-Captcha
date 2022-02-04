import { Utf8 } from "jscrypto";
import { AES } from "jscrypto/AES";

const hash = AES.encrypt("hello", "you suck");

console.log(hash.toString());
console.log(
  AES.decrypt(
    "U2FsdGVkX1/kr0xBkwBnTob7IrqVs+spkJxFYrV1xp4=",
    "you suck"
  ).toString(Utf8)
);
