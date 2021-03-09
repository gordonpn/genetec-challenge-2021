import { readFile, writeFile } from "fs/promises";
import { logToDiscord } from "./logger";

const JSON_FILE = "./wantedPlates.json";

const writeToFile = async (wantedSet) => {
  console.log("Deleting contents ", JSON_FILE);
  try {
    await writeFile(JSON_FILE, "");
    await writeFile(JSON_FILE, JSON.stringify(Array.from(wantedSet.values())));
  } catch (err) {
    logToDiscord(err, true);
    console.log("Error writing file", err);
  }
};

const readFromFile = async () => {
  try {
    const jsonString = await readFile(JSON_FILE, "utf8");
    console.log("jsonString", jsonString);
    return JSON.parse(jsonString);
  } catch (err) {
    logToDiscord(err, true);
    console.log("File read failed:", err);
    return;
  }
};

export { writeToFile, readFromFile };
