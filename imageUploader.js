const { BlobServiceClient } = require('@azure/storage-blob');

export default function ImageUploader(licensePlate, imageString) {
//Connection String
const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=stteam20strathack;AccountKey=uM7g/7jhsIoFcJxsOv0o0U0r4RgliM+80m9T7qmx/uCCMMdD5Pa63ewz7Ub2viqDSb4zVbDV78CLUVmw5QxmfA==;EndpointSuffix=core.windows.net";
    
// Create the BlobServiceClient object which will be used to create a container client
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

// Create a unique name for the container
const containerName = 'Objective3ImageContainer';

console.log('\nCreating container...');
console.log('\t', containerName);

// Get a reference to a container
const containerClient = blobServiceClient.getContainerClient(containerName);

// Create the container
const createContainerResponse = await containerClient.create();
console.log("Container was created successfully. requestId: ", createContainerResponse.requestId);

/*    we only need to create one container so we need to move everything above somewhere else      */

// Get a block blob client
const blockBlobClient = containerClient.getBlockBlobClient(licensePlate);

console.log('\nUploading to Azure storage as blob:\n\t', licensePlate);

// Upload data to the blob
const uploadBlobResponse = await blockBlobClient.upload(imageString, imageString.length);
console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);


return blockBlobClient.url;
}