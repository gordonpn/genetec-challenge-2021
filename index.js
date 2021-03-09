import { ServiceBusClient } from "@azure/service-bus";
import axios from "axios";
import { readFile, writeFile } from "fs/promises";
import isExpired from "./timeValidator.js";

const connectionStringPlates =
  "Endpoint=sb://licenseplatepublisher.servicebus.windows.net/;SharedAccessKeyName=ConsumeReads;SharedAccessKey=VNcJZVQAVMazTAfrssP6Irzlg/pKwbwfnOqMXqROtCQ=";
const connectionStringWanted =
  "Endpoint=sb://licenseplatepublisher.servicebus.windows.net/;SharedAccessKeyName=listeneronly;SharedAccessKey=w+ifeMSBq1AQkedLCpMa8ut5c6bJzJxqHuX9Jx2XGOk= ";

let wantedSet = new Set();
const plateMap = new Map();
const JSON_FILE = "./wantedPlates.json";

const errorHandler = async (error) => {
  console.log(error);
};

const sendForValidation = async (
  LicensePlateCaptureTime,
  LicensePlate,
  Latitude,
  Longitude
) => {
  if (!wantedSet.has(LicensePlate)) {
    return;
  }

  // @ts-ignore
  if (isExpired(LicensePlateCaptureTime)) {
    return;
  }

  try {
    // @ts-ignore
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
    plateMap.delete(LicensePlate);
  } catch (err) {
    console.warn("err -----", err?.response?.status, err?.response?.statusText);
    console.log();
  }
};

const writeToFile = async () => {
  console.log("Deleting contents ", JSON_FILE);
  try {
    await writeFile(JSON_FILE, "");
    await writeFile(JSON_FILE, JSON.stringify(Array.from(wantedSet.values())));
  } catch (err) {
    console.log("Error writing file", err);
  }
};

const getNewWantedPlates = async () => {
  // -$30 every time this gets called

  try {
    // @ts-ignore
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

    wantedSet.clear();

    res.data.forEach((wantedStr) => {
      wantedSet.add(wantedStr);
    });

    wantedSet.forEach((wantedPlate) => {
      const plate = plateMap.get(wantedPlate);
      // plate could be expired

      if (!plate) {
        return;
      }

      sendForValidation(...plate);
    });

    writeToFile()
      .then(() => {
        console.log("Done writing to file");
      })
      .catch((err) => {
        console.log("Error occurred: ", err);
      });
  } catch (err) {
    console.warn("err -----", err?.response?.status, err?.response?.statusText);
  }
};

async function licensePlateBus() {
  const sbClientPlates = new ServiceBusClient(connectionStringPlates);

  const receiverPlates = sbClientPlates.createReceiver(
    "licenseplateread",
    "wzmoqfowbmugnomh"
  );

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

    plateMap.set(LicensePlate, {
      LicensePlateCaptureTime,
      LicensePlate,
      Latitude,
      Longitude,
    });

    sendForValidation(
      LicensePlateCaptureTime,
      LicensePlate,
      Latitude,
      Longitude
    );

    // console.log("LicensePlateImageJpg", LicensePlateImageJpg);
    // console.log("ContextImageJpg", ContextImageJpg);
    // console.log("Longitude", Longitude);
    // console.log("Latitude", Latitude);
    console.log("LicensePlate", LicensePlate);
    console.log("LicensePlateCaptureTime", LicensePlateCaptureTime);
    console.log();
  };

  receiverPlates.subscribe({
    processMessage: plateMessageHandler,
    processError: errorHandler,
  });
}

async function wantedBus() {
  const sbClientWanted = new ServiceBusClient(connectionStringWanted);

  const receiverWanted = sbClientWanted.createReceiver(
    "wantedplatelistupdate",
    "wzmoqfowbmugnomh"
  );

  const wantedMessageHandler = async (messageReceived) => {
    const { TotalWantedCount } = messageReceived.body;
    console.log("TotalWantedCount", TotalWantedCount);
    console.log();

    if (wantedSet.size < Number(TotalWantedCount)) {
      getNewWantedPlates();
    }
  };

  receiverWanted.subscribe({
    processMessage: wantedMessageHandler,
    processError: errorHandler,
  });
}

const readFromFile = async () => {
  try {
    const jsonString = await readFile(JSON_FILE, "utf8");
    console.log("jsonString", jsonString);
    wantedSet = new Set(JSON.parse(jsonString));
  } catch (err) {
    console.log("File read failed:", err);
    return;
  }
};

readFromFile()
  .then(() => {
    console.log("Done reading from file");
  })
  .catch((err) => {
    console.log("Error occurred: ", err);
  });

wantedBus().catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});

licensePlateBus().catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});
