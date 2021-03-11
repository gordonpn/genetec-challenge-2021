import { BlobServiceClient } from "@azure/storage-blob";
import { logToDiscord } from "./logger.js";

class blobConnection {
  constructor() {
    const AZURE_STORAGE_CONNECTION_STRING =
      "DefaultEndpointsProtocol=https;AccountName=stteam20strathack;AccountKey=uM7g/7jhsIoFcJxsOv0o0U0r4RgliM+80m9T7qmx/uCCMMdD5Pa63ewz7Ub2viqDSb4zVbDV78CLUVmw5QxmfA==;EndpointSuffix=core.windows.net";

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );

    const containerName = "images";

    console.log("\nCreating container...");
    console.log("\t", containerName);

    this.containerClient = blobServiceClient.getContainerClient(containerName);
    this.containerClient.setAccessPolicy("blob");

    this.containerClient
      .createIfNotExists()
      .then((res) =>
        console.log("Successfully created container client", res?.errorCode)
      )
      .catch((err) => {
        logToDiscord(err?.code, true);
        console.log(err);
      });
  }

  getContainerClient() {
    return this.containerClient;
  }
}

const blobConnectionInstance = new blobConnection();
Object.freeze(blobConnectionInstance);

export default blobConnectionInstance;
