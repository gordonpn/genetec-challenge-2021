import getNewWantedPlates from "./getNewWantedPlates.js";
import plateRepoInstance from "./platesRepo.js";
import sendForValidation from "./sendForValidation.js";
import wantedRepoInstance from "./wantedRepo.js";

const errorHandler = async (error) => {
  console.log(error);
};

const plateMessageHandler = async (messageReceived) => {
  const {
    LicensePlateCaptureTime,
    LicensePlate,
    Latitude,
    Longitude,
    ContextImageJpg,
    LicensePlateImageJpg,
  } = messageReceived.body;

  // console.log(Object.keys(messageReceived.body));

  plateRepoInstance.add(LicensePlate, {
    LicensePlateCaptureTime,
    LicensePlate,
    Latitude,
    Longitude,
    ContextImageJpg,
    LicensePlateImageJpg,
  });

  sendForValidation(LicensePlateCaptureTime, LicensePlate, Latitude, Longitude);

  // console.log("LicensePlateImageJpg", LicensePlateImageJpg);
  // console.log("ContextImageJpg", ContextImageJpg);
  // console.log("Longitude", Longitude);
  // console.log("Latitude", Latitude);
  console.log("LicensePlate", LicensePlate);
  console.log("LicensePlateCaptureTime", LicensePlateCaptureTime);
  console.log();
};

const wantedMessageHandler = async (messageReceived) => {
  const { TotalWantedCount } = messageReceived.body;
  console.log("TotalWantedCount", TotalWantedCount);
  console.log();

  if (wantedRepoInstance.size() < Number(TotalWantedCount)) {
    getNewWantedPlates();
  }
};

export { errorHandler, plateMessageHandler, wantedMessageHandler };
