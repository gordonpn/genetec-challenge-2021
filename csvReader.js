import csv from "csv-parser";
import { createReadStream } from "fs";

const possiblePlates = new Set();
let shortest = 10;
let longest = 0;
let processed = 0;

createReadStream("./seenPlates.csv")
  .pipe(csv())
  .on("data", (row) => {
    if (row.LicensePlate) {
      possiblePlates.add(row.LicensePlate);
      shortest = Math.min(row.LicensePlate.length, shortest);
      longest = Math.max(row.LicensePlate.length, longest);
      processed++;
    }
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
    console.log(`possiblePlates.size: ${possiblePlates.size}`);
    console.log(`shortest: ${shortest}`);
    console.log(`longest: ${longest}`);
    console.log(`lines processed: ${processed}`);
  });
