import { ServiceBusClient } from "@azure/service-bus";
import {
  errorHandler,
  plateMessageHandler,
  wantedMessageHandler,
} from "./handlers.js";
import { readFromFile } from "./readWrite.js";
import wantedRepoInstance from "./wantedRepo.js";

const connectionStringPlates =
  "Endpoint=sb://licenseplatepublisher.servicebus.windows.net/;SharedAccessKeyName=ConsumeReads;SharedAccessKey=VNcJZVQAVMazTAfrssP6Irzlg/pKwbwfnOqMXqROtCQ=";
const connectionStringWanted =
  "Endpoint=sb://licenseplatepublisher.servicebus.windows.net/;SharedAccessKeyName=listeneronly;SharedAccessKey=w+ifeMSBq1AQkedLCpMa8ut5c6bJzJxqHuX9Jx2XGOk=";

async function licensePlateBus() {
  const sbClientPlates = new ServiceBusClient(connectionStringPlates);

  const receiverPlates = sbClientPlates.createReceiver(
    "licenseplateread",
    "wzmoqfowbmugnomh"
  );

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

  receiverWanted.subscribe({
    processMessage: wantedMessageHandler,
    processError: errorHandler,
  });
}

readFromFile()
  .then((array) => {
    wantedRepoInstance.add(array);
    console.log("Done reading from file");
  })
  .catch((err) => {
    console.log("Error occurred: ", err);
    process.exit(1);
  });

wantedBus().catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});

licensePlateBus().catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});
