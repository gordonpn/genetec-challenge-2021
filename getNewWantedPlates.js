import axios from "axios";
import { logToDiscord } from "./logger.js";
import plateRepoInstance from "./platesRepo.js";
import { writeToFile } from "./readWrite.js";
import sendForValidation from "./sendForValidation.js";
import wantedRepoInstance from "./wantedRepo.js";

const getNewWantedPlates = async () => {
  // -$30 every time this gets called

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
    console.log(res.data);
    logToDiscord(`New plates acquired ${res.data}`);

    res.data.forEach((wantedStr) => {
      wantedRepoInstance.add(wantedStr);
    });

    wantedRepoInstance.get().forEach((wantedPlate) => {
      const plate = plateRepoInstance.get(wantedPlate);

      if (!plate) {
        return;
      }

      console.log(
        `Sending old plate ${plate.LicensePlate}: ${plate.LicensePlateCaptureTime}`
      );
      logToDiscord(
        `Sending old plate ${plate.LicensePlate}: ${plate.LicensePlateCaptureTime}`
      );

      sendForValidation(...plate);
    });

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
    console.warn("err -----", err?.response?.status, err?.response?.statusText);
  }
};

export default getNewWantedPlates;
