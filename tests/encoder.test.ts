import { before, describe, test } from "node:test";
const log = console.log;
import assert from "node:assert/strict";

// Also known as 32
const WHITESPACE_NUMBER = Buffer.from(" ", "utf-8")[0];

// Must match DATA_SIZE in the on chain program
// Anything more than this will fail with ERR_OUT_OF_RANGE
const DATA_SIZE = 992;

// Encodes JS objects as JSON with whitespace padding inside an array of numbers
const objectToArrayOfNumbers = (object: any): Array<number> => {
  const paddedArray = new Array(DATA_SIZE).fill(WHITESPACE_NUMBER);
  const string = JSON.stringify(object);
  const contentsArray = Array.from(
    new Uint8Array(Buffer.from(string, "utf-8"))
  );
  const end = contentsArray.length;
  paddedArray.splice(0, end, ...contentsArray);
  return paddedArray;
};

const arrayOfNumbersToObject = (array: Array<number>): any => {
  const buffer = Buffer.from(array);
  const string = buffer.toString("utf-8");
  const trimmedString = string.trimEnd();
  const object = JSON.parse(trimmedString);
  return object;
};

describe("encoding JS objects to arrays of numbers", () => {
  test("string to array of numbers", () => {
    const input = { greeting: "hello world" };
    const arrayOfNumbers = objectToArrayOfNumbers(input);
    assert(arrayOfNumbers.length === DATA_SIZE);
    log(arrayOfNumbers);
    const result = arrayOfNumbersToObject(arrayOfNumbers);
    assert(result.greeting === "hello world");
  });
});
