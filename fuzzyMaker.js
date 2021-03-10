import { performance } from "perf_hooks";

const fuzzyChars = new Set([
  "B",
  "8",
  "C",
  "G",
  "E",
  "F",
  "K",
  "X",
  "Y",
  "I",
  "1",
  "T",
  "J",
  "S",
  "5",
  "O",
  "D",
  "Q",
  "0",
  "P",
  "R",
  "Z",
  "2",
]);

const bGroup = new Set(["B", "8"]);
const cGroup = new Set(["C", "G"]);
const eGroup = new Set(["E", "F"]);
const kGroup = new Set(["K", "X", "Y"]);
const iGroup = new Set(["I", "1", "T", "J"]);
const sGroup = new Set(["S", "5"]);
const oGroup = new Set(["O", "D", "Q", "0"]);
const pGroup = new Set(["P", "R"]);
const zGroup = new Set(["Z", "2"]);

const replaceChar = (origString, newChar, index) => {
  const firstPart = origString.substr(0, index);
  const lastPart = origString.substr(index + 1);
  const newString = firstPart + newChar + lastPart;
  return newString;
};

const makeFuzzy = (plate) => {
  const t0 = performance.now();
  const fuzzyMatches = [];
  let index = 0;

  const makeFuzzyB = (givenIndex) => {
    bGroup.forEach((char) => {
      fuzzyMatches.push(replaceChar(plate, char, givenIndex));
    });
  };

  const makeFuzzyC = (givenIndex) => {
    cGroup.forEach((char) => {
      fuzzyMatches.push(replaceChar(plate, char, givenIndex));
    });
  };

  const makeFuzzyE = (givenIndex) => {
    eGroup.forEach((char) => {
      fuzzyMatches.push(replaceChar(plate, char, givenIndex));
    });
  };

  const makeFuzzyK = (givenIndex) => {
    kGroup.forEach((char) => {
      fuzzyMatches.push(replaceChar(plate, char, givenIndex));
    });
  };

  const makeFuzzyI = (givenIndex) => {
    iGroup.forEach((char) => {
      fuzzyMatches.push(replaceChar(plate, char, givenIndex));
    });
  };

  const makeFuzzyS = (givenIndex) => {
    sGroup.forEach((char) => {
      fuzzyMatches.push(replaceChar(plate, char, givenIndex));
    });
  };

  const makeFuzzyO = (givenIndex) => {
    oGroup.forEach((char) => {
      fuzzyMatches.push(replaceChar(plate, char, givenIndex));
    });
  };

  const makeFuzzyP = (givenIndex) => {
    pGroup.forEach((char) => {
      fuzzyMatches.push(replaceChar(plate, char, givenIndex));
    });
  };

  const makeFuzzyZ = (givenIndex) => {
    zGroup.forEach((char) => {
      fuzzyMatches.push(replaceChar(plate, char, givenIndex));
    });
  };

  [...plate].forEach((letter) => {
    if (fuzzyChars.has(letter)) {
      if (bGroup.has(letter)) {
        makeFuzzyB(index);
      } else if (cGroup.has(letter)) {
        makeFuzzyC(index);
      } else if (eGroup.has(letter)) {
        makeFuzzyE(index);
      } else if (kGroup.has(letter)) {
        makeFuzzyK(index);
      } else if (iGroup.has(letter)) {
        makeFuzzyI(index);
      } else if (sGroup.has(letter)) {
        makeFuzzyS(index);
      } else if (oGroup.has(letter)) {
        makeFuzzyO(index);
      } else if (pGroup.has(letter)) {
        makeFuzzyP(index);
      } else if (zGroup.has(letter)) {
        makeFuzzyZ(index);
      }
      console.log(`index: ${index} has fuzzy char ${letter}`);
    }
    index++;
  });

  const t1 = performance.now();
  console.log(`\nFuzzy match for ${plate} took ${t1 - t0} ms\n`);
  return fuzzyMatches;
};

console.log(makeFuzzy("003VLH"));
console.log(makeFuzzy("025WFD"));
console.log(makeFuzzy("027SSD"));
console.log(makeFuzzy("047PGM"));
console.log(makeFuzzy("065TZN"));
