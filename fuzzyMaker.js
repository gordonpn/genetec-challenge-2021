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
  const fuzzyMatches = new Set();
  fuzzyMatches.add(plate);

  const makeFuzzyB = (aPlate, givenIndex) => {
    bGroup.forEach((char) => {
      fuzzyMatches.add(replaceChar(aPlate, char, givenIndex));
    });
  };

  const makeFuzzyC = (aPlate, givenIndex) => {
    cGroup.forEach((char) => {
      fuzzyMatches.add(replaceChar(aPlate, char, givenIndex));
    });
  };

  const makeFuzzyE = (aPlate, givenIndex) => {
    eGroup.forEach((char) => {
      fuzzyMatches.add(replaceChar(aPlate, char, givenIndex));
    });
  };

  const makeFuzzyK = (aPlate, givenIndex) => {
    kGroup.forEach((char) => {
      fuzzyMatches.add(replaceChar(aPlate, char, givenIndex));
    });
  };

  const makeFuzzyI = (aPlate, givenIndex) => {
    iGroup.forEach((char) => {
      fuzzyMatches.add(replaceChar(aPlate, char, givenIndex));
    });
  };

  const makeFuzzyS = (aPlate, givenIndex) => {
    sGroup.forEach((char) => {
      fuzzyMatches.add(replaceChar(aPlate, char, givenIndex));
    });
  };

  const makeFuzzyO = (aPlate, givenIndex) => {
    oGroup.forEach((char) => {
      fuzzyMatches.add(replaceChar(aPlate, char, givenIndex));
    });
  };

  const makeFuzzyP = (aPlate, givenIndex) => {
    pGroup.forEach((char) => {
      fuzzyMatches.add(replaceChar(aPlate, char, givenIndex));
    });
  };

  const makeFuzzyZ = (aPlate, givenIndex) => {
    zGroup.forEach((char) => {
      fuzzyMatches.add(replaceChar(aPlate, char, givenIndex));
    });
  };

  fuzzyMatches.forEach((thisPlate) => {
    // console.log(`Processing ${thisPlate}`);
    [...thisPlate].forEach((letter, index) => {
      if (fuzzyChars.has(letter)) {
        if (bGroup.has(letter)) {
          makeFuzzyB(thisPlate, index);
        } else if (cGroup.has(letter)) {
          makeFuzzyC(thisPlate, index);
        } else if (eGroup.has(letter)) {
          makeFuzzyE(thisPlate, index);
        } else if (kGroup.has(letter)) {
          makeFuzzyK(thisPlate, index);
        } else if (iGroup.has(letter)) {
          makeFuzzyI(thisPlate, index);
        } else if (sGroup.has(letter)) {
          makeFuzzyS(thisPlate, index);
        } else if (oGroup.has(letter)) {
          makeFuzzyO(thisPlate, index);
        } else if (pGroup.has(letter)) {
          makeFuzzyP(thisPlate, index);
        } else if (zGroup.has(letter)) {
          makeFuzzyZ(thisPlate, index);
        }
        // console.log(`index: ${index} has fuzzy char ${letter}`);
      }
    });
  });

  const t1 = performance.now();
  console.log(`\nFuzzy match for ${plate} took ${t1 - t0} ms\n`);
  console.log(`${fuzzyMatches} size: ${fuzzyMatches.size}`);
  return fuzzyMatches;
};

// const total0 = performance.now();
// console.log(makeFuzzy("027SSD").values());
// const total1 = performance.now();
// console.log(`\nTotal fuzzy match took ${total1 - total0} ms\n`);

export default makeFuzzy;
