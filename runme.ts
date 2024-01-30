const log = console.log;
const array = ["apple", "apple", "apple", "apple"];
const paddedArray = array.fill("pear", 1, 4);
log(paddedArray.length);
log(paddedArray);

// const array1 = [1, 2, 3, 4];

// // Fill with 0 from position 2 until position 4
// console.log(array1.fill(0, 2, 4));
// // Expected output: Array [1, 2, 0, 0]
