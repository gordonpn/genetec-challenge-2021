import csv from "csv-parser";
import { createReadStream } from "fs";

const possiblePlates = new Set();

createReadStream("./seenPlates.csv")
  .pipe(csv())
  .on("data", (row) => {
    if (row.LicensePlate) {
      possiblePlates.add(row.LicensePlate);
    }
    console.log(row.LicensePlate);
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
    console.log(`possiblePlates.size: ${possiblePlates.size}`);
  });
