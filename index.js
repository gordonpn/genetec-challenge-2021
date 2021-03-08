const {
  delay,
  ServiceBusClient,
  ServiceBusMessage,
} = require("@azure/service-bus");
const axios = require("axios");
var azure = require("azure-storage");

const connectionStringPlates =
  "Endpoint=sb://licenseplatepublisher.servicebus.windows.net/;SharedAccessKeyName=ConsumeReads;SharedAccessKey=VNcJZVQAVMazTAfrssP6Irzlg/pKwbwfnOqMXqROtCQ=";
const connectionStringWanted =
  "Endpoint=sb://licenseplatepublisher.servicebus.windows.net/;SharedAccessKeyName=listeneronly;SharedAccessKey=w+ifeMSBq1AQkedLCpMa8ut5c6bJzJxqHuX9Jx2XGOk= ";

const wantedSet = new Set();
const plateMap = new Map();

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

  // const diffInMilliseconds = Math.abs(
  //   new Date() - new Date(LicensePlateCaptureTime)
  // );

  // if (diffInMilliseconds >= 120000) {
  //   return;
  // }

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
    plateMap.delete(LicensePlate);
  } catch (err) {
    console.warn("err -----", err.response.status, err.response.statusText);
    console.log();
  }
};

const getNewWantedPlates = async () => {
  // -$30 every time this gets called

  try {
    const res = await axios({
      method: "get",
      url:
        "https://licenseplatevalidator.azurewebsites.net/api/lpr/wantedplates",
      headers: {
        Authorization: "Basic dGVhbTIwOltVaT1EJT9jRFBXMWdRJWs=",
        // Authorization: "Basic dGVhbTAyOi1BTU1wc25oW251T3IxcFM=",
      },
    });
    console.log(res.data);

    wantedSet.clear();

    res.data.forEach((wantedStr) => {
      wantedSet.add(wantedStr);
    });

    wantedSet.forEach((wantedPlate) => {
      const plate = plateMap.get(wantedPlate);

      if (!plate) {
        return;
      }

      sendForValidation(...plate);
    });

    return res.data;
  } catch (err) {
    console.warn("err -----", err.response.status, err.response.statusText);
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
    } = messageReceived.body;

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
    const { Url, TotalWantedCount } = messageReceived.body;
    console.log("TotalWantedCount", TotalWantedCount);
    console.log("Url", Url);
    console.log();
    getNewWantedPlates();
  };

  receiverWanted.subscribe({
    processMessage: wantedMessageHandler,
    processError: errorHandler,
  });
}

getNewWantedPlates();

wantedBus().catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});

licensePlateBus().catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});
