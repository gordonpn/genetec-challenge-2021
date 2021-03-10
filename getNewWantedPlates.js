import axios from "axios";
import { performance } from "perf_hooks";
import makeFuzzy from "./fuzzyMaker.js";
import { logToDiscord } from "./logger.js";
import plateRepoInstance from "./platesRepo.js";
import { writeToFile } from "./readWrite.js";
import sendForValidation from "./sendForValidation.js";
import wantedRepoInstance from "./wantedRepo.js";

const getNewWantedPlates = async () => {
  // if (!shouldMakeGet()) {
  //   console.log("Skipped wanted plate request")
  //   logToDiscord("Skipped wanted plate request");
  //   return;
  // }

  try {
    const res = await axios({
      method: "get",
      url:
        "https://licenseplatevalidator.azurewebsites.net/api/lpr/wantedplates",
      headers: {
        Authorization: "Basic dGVhbTIwOltVaT1EJT9jRFBXMWdRJWs=",
        // Authorization: "Basic dGVhbTAyOi1BTU1wc25oW251T3IxcFM=",
        // Authorization: "Basic dGVhbTA4OjFBSz0kcUc/RDRlUzFGP0o=",
        // Authorization: "Basic dGVhbTIzOjN4KD1aQmdmK3k9bnZ1P2c= ",
      },
    });
    const { data } = res;
    console.log(data);
    logToDiscord(`New plates acquired ${data}`);

    wantedRepoInstance.clear();

    const t0 = performance.now();

    data.forEach((wantedStr) => {
      const fuzzySet = makeFuzzy(wantedStr);
      fuzzySet.forEach((fuzzyPlate) => {
        wantedRepoInstance.add(fuzzyPlate, wantedStr);
      });
      // wantedRepoInstance.add(Array.from(fuzzySet.values()));
    });

    const t1 = performance.now();
    console.log(`\nTotal fuzzy match took ${t1 - t0} ms\n`);

    wantedRepoInstance.get().forEach((fuzzyPlate, wantedPlate) => {
      const plate = plateRepoInstance.get(fuzzyPlate);

      if (!plate) {
        return;
      }

      console.log(
        `Sending old plate ${plate.LicensePlate}: ${plate.LicensePlateCaptureTime}`
      );
      // logToDiscord( `Sending old plate ${plate.LicensePlate}: ${plate.LicensePlateCaptureTime}`);

      sendForValidation(
        plate.LicensePlateCaptureTime,
        plate.LicensePlate,
        plate.Latitude,
        plate.Longitude,
        plate.ContextImageJpg
      );
    });

    logToDiscord(`New reverse index count: ${wantedRepoInstance.size()}`);

    writeToFile(wantedRepoInstance.get())
      .then(() => {
        console.log("Done writing to file");
      })
      .catch((err) => {
        logToDiscord("Caught error in writeToFile", true);
        console.log("Error occurred: ", err);
      });
  } catch (err) {
    logToDiscord("Caught error in getNewWantedPlates", true);
    console.warn("err -----", err);
  }
};

export default getNewWantedPlates;
