import { BlobServiceClient } from "@azure/storage-blob";
import { logToDiscord } from "./logger";

class blobConnection {
  constructor() {
    //Connection String
    const AZURE_STORAGE_CONNECTION_STRING =
      "DefaultEndpointsProtocol=https;AccountName=stteam20strathack;AccountKey=uM7g/7jhsIoFcJxsOv0o0U0r4RgliM+80m9T7qmx/uCCMMdD5Pa63ewz7Ub2viqDSb4zVbDV78CLUVmw5QxmfA==;EndpointSuffix=core.windows.net";

    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );

    // Create a unique name for the container
    const containerName = "images";

    console.log("\nCreating container...");
    console.log("\t", containerName);

    // Get a reference to a container
    this.containerClient = blobServiceClient.getContainerClient(containerName);
    this.containerClient.setAccessPolicy("blob");

    // Create the container
    this.containerClient
      .createIfNotExists()
      .then((res) =>
        console.log("Successfully created container client", res?.errorCode)
      )
      .catch((err) => {
        logToDiscord(err, true);
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
