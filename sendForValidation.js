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

  try {
    const res = await axios({
      method: "post",
      url:
        "https://licenseplatevalidator.azurewebsites.net/api/lpr/platelocation",
      data: {
        LicensePlateCaptureTime,
        LicensePlate: actualWantedPlate,
        Latitude,
        Longitude,
        ContextImageReference: contextImgRef,
      },
      headers: {
        Authorization: "Basic dGVhbTIwOltVaT1EJT9jRFBXMWdRJWs=",
      },
    });
    logToDiscord(`Successful match on ${LicensePlate}`);
    console.log("data -----", res.data);
    console.log();
    plateRepoInstance.delete(LicensePlate);
  } catch (err) {
    logToDiscord("Caught error in sendForValidation", true);
    console.warn("err -----", err);
    console.log();
  }
};

export default sendForValidation;
