import axios from "axios";
import plateRepoInstance from "./platesRepo.js";
import isExpired from "./timeValidator.js";
import wantedRepoInstance from "./wantedRepo.js";

const sendForValidation = async (
  LicensePlateCaptureTime,
  LicensePlate,
  Latitude,
  Longitude
) => {
  if (!wantedRepoInstance.has(LicensePlate)) {
    console.log("No match");
    return;
  }

  if (isExpired(LicensePlateCaptureTime)) {
    return;
  }

  try {
    const res = await axios({
      method: "post",
      url:
        "https://licenseplatevalidator.azurewebsites.net/api/lpr/platelocation",
      data: {
        LicensePlateCaptureTime,
        LicensePlate,
        Latitude,
        Longitude,
      },
      headers: {
        Authorization: "Basic dGVhbTIwOltVaT1EJT9jRFBXMWdRJWs=",
      },
    });
    console.log("data -----", res.data);
    console.log();
    plateRepoInstance.delete(LicensePlate);
  } catch (err) {
    console.warn("err -----", err?.response?.status, err?.response?.statusText);
    console.log();
  }
};

export default sendForValidation;
