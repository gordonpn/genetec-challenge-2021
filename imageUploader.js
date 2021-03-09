import blobConnectionInstance from "./blobConnection.js";

async function imageUploader(licensePlate, imageString) {
  const containerClient = blobConnectionInstance.getContainerClient();

  // Get a block blob client
  const blockBlobClient = containerClient.getBlockBlobClient(licensePlate);

  console.log("\nUploading to Azure storage as blob:\n\t", licensePlate);

  try {
    // Upload data to the blob
    const imageBuffer = Buffer.from(imageString, "base64");
    const uploadBlobResponse = await blockBlobClient.uploadData(imageBuffer);
    console.log(
      "Blob was uploaded successfully. requestId: ",
      uploadBlobResponse.requestId
    );
  } catch (err) {
    console.log(err);
  }

  console.log(blockBlobClient.url);
  return blockBlobClient.url;
}

export default imageUploader;
