import getNewWantedPlates from "./getNewWantedPlates.js";
import { logToDiscord } from "./logger.js";
import plateRepoInstance from "./platesRepo.js";
import sendForValidation from "./sendForValidation.js";
import wantedRepoInstance from "./wantedRepo.js";

const errorHandler = async (error) => {
  logToDiscord("Caught error in a bus", true);
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

  // appendToLogs(LicensePlate, LicensePlateCaptureTime);

  // console.log(Object.keys(messageReceived.body));

  plateRepoInstance.add(LicensePlate, {
    LicensePlateCaptureTime,
    LicensePlate,
    Latitude,
    Longitude,
    ContextImageJpg,
    LicensePlateImageJpg,
  });

  sendForValidation(
    LicensePlateCaptureTime,
    LicensePlate,
    Latitude,
    Longitude,
    ContextImageJpg
  );

  // console.log("LicensePlateImageJpg", LicensePlateImageJpg);
  // console.log("ContextImageJpg", ContextImageJpg);
  // console.log("Longitude", Longitude);
  // console.log("Latitude", Latitude);
  console.log("LicensePlate", LicensePlate);
  console.log(`LicensePlateCaptureTime ${LicensePlateCaptureTime}\n`);
};

const wantedMessageHandler = async (messageReceived) => {
  const { TotalWantedCount } = messageReceived.body;
  console.log(`TotalWantedCount ${TotalWantedCount}\n`);
  logToDiscord(
    `New plates on the bus, count: ${TotalWantedCount}\nCurrent reverse index size ${wantedRepoInstance.size()}`
  );

  // if (wantedRepoInstance.size() < Number(TotalWantedCount)) {
  await getNewWantedPlates();
  // }

  // if (wantedRepoInstance.lastTime() === undefined) {
  //   await getNewWantedPlates();
  //   wantedRepoInstance.lastTime(new Date().getTime());
  //   return;
  // }

  // const ONE_HOUR = 7200000;
  // const timeNow = new Date().getTime();
  // const diffInMilliseconds = Math.abs(wantedRepoInstance.lastTime() - timeNow);

  // if (diffInMilliseconds >= ONE_HOUR) {
  //   await getNewWantedPlates();
  //   wantedRepoInstance.lastTime(new Date().getTime());
  // }
};

export { errorHandler, plateMessageHandler, wantedMessageHandler };
