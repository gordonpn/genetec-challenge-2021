import { readFile, writeFile } from "fs/promises";
import { logToDiscord } from "./logger.js";

const JSON_FILE = "./wantedPlates.json";

const writeToFile = async (wantedMap) => {
  console.log("Deleting contents ", JSON_FILE);
  try {
    await writeFile(JSON_FILE, "");
    await writeFile(
      JSON_FILE,
      JSON.stringify(Array.from(wantedMap.entries()), null, 2)
    );
  } catch (err) {
    logToDiscord("Caught error in writeToFile", true);
    console.log("Error writing file", err);
  }
};

const readFromFile = async () => {
  try {
    const jsonString = await readFile(JSON_FILE, "utf8");
    return new Map(JSON.parse(jsonString));
  } catch (err) {
    logToDiscord("Caught error in readFromFile", true);
    console.log("File read failed:", err);
    return;
  }
};

export { writeToFile, readFromFile };
