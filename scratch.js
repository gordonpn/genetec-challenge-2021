const tempMap = new Map();

tempMap.set("naasir", "got coffee");
tempMap.set("patate", "douce");

const stringified = JSON.stringify(Array.from(tempMap.entries()), null, 2);

console.log(stringified);

// console.log(typeof JSON.parse(stringified));

const map = new Map(JSON.parse(stringified));

// console.log(typeof map);

console.log(map.entries());
console.log(map.size);

console.log(map.get("naasir"));
console.log(map.get("patate"));
