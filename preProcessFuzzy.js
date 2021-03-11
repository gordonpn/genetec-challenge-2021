import axios from "axios";
import { writeFile } from "fs/promises";
import makeFuzzy from "./fuzzyMaker.js";

const JSON_FILE = "./wantedPlates.json";

const writeToFile = async (wantedMap) => {
  console.log("Deleting contents", JSON_FILE);
  try {
    await writeFile(JSON_FILE, "");
    await writeFile(
      JSON_FILE,
      JSON.stringify(Array.from(wantedMap.entries()), null, 2)
    );
    console.log("Done writing", JSON_FILE);
  } catch (err) {
    console.log("Error writing file", err);
  }
};

const generateFuzzy = async () => {
  const tempMap = new Map();
  const res = await axios({
    method: "get",
    url: "https://licenseplatevalidator.azurewebsites.net/api/lpr/wantedplates",
    headers: {
      Authorization: "Basic dGVhbTIwOltVaT1EJT9jRFBXMWdRJWs=",
    },
  });
  const { data } = res;

  data.forEach((wantedStr) => {
    const fuzzySet = makeFuzzy(wantedStr);
    fuzzySet.forEach((str) => {
      tempMap.set(str, wantedStr);
    });
  });

  writeToFile(tempMap);
};

generateFuzzy();
