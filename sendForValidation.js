import axios from "axios";
import imageUploader from "./imageUploader.js";
import { logToDiscord } from "./logger.js";
import plateRepoInstance from "./platesRepo.js";
import isExpired from "./timeValidator.js";
import wantedRepoInstance from "./wantedRepo.js";

const sendForValidation = async (
  LicensePlateCaptureTime,
  LicensePlate,
  Latitude,
  Longitude,
  ContextImageJpg
) => {
  if (!wantedRepoInstance.has(LicensePlate)) {
    console.log("No match");
    return;
  }

  if (isExpired(LicensePlateCaptureTime)) {
    plateRepoInstance.delete(LicensePlate);
    console.log("Plate expired");
    logToDiscord(
      `Wanted to match ${LicensePlate} but it's expired\n${LicensePlateCaptureTime}`
    );
    return;
  }

  const actualWantedPlate = wantedRepoInstance.getOne(LicensePlate);
  const contextImgRef = await imageUploader(LicensePlate, ContextImageJpg);

  const payload = {
    LicensePlateCaptureTime,
    LicensePlate: actualWantedPlate,
    Latitude,
    Longitude,
    ContextImageReference: contextImgRef,
  };

  try {
    const res = await axios({
      method: "post",
      url:
        "https://licenseplatevalidator.azurewebsites.net/api/lpr/platelocation",
      data: payload,
      headers: {
        Authorization: "Basic dGVhbTIwOltVaT1EJT9jRFBXMWdRJWs=",
      },
    });

    console.log(
      `Payload sent for validation:\n${JSON.stringify(payload, null, 2)}`
    );

    if (actualWantedPlate !== LicensePlate) {
      console.log(`Fuzzy match ${LicensePlate}: ${actualWantedPlate}`);
      logToDiscord(`Fuzzy match ${LicensePlate}: ${actualWantedPlate}`);
    } else {
      console.log(`Exact match ${LicensePlate}: ${actualWantedPlate}`);
      logToDiscord(`Exact match ${LicensePlate}: ${actualWantedPlate}`);
    }
    console.log(`data ----- ${res.data}\n`);
    plateRepoInstance.delete(LicensePlate);
  } catch (err) {
    logToDiscord("Caught error in sendForValidation", true);
    console.warn(`err ----- ${err?.response}\n`);
  }
};

export default sendForValidation;
