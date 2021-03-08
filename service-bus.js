const { delay, ServiceBusClient, ServiceBusMessage } = require("@azure/service-bus");
const axios = require('axios')


// connection string to your Service Bus namespace
const connectionString = "Endpoint=sb://licenseplatepublisher.servicebus.windows.net/;SharedAccessKeyName=ConsumeReads;SharedAccessKey=VNcJZVQAVMazTAfrssP6Irzlg/pKwbwfnOqMXqROtCQ="

// name of the queue
const topicName = "licenseplateread"

const subscriptionName="wzmoqfowbmugnomh"

 async function main() {
	// create a Service Bus client using the connection string to the Service Bus namespace
	const sbClient = new ServiceBusClient(connectionString);

	// createReceiver() can also be used to create a receiver for a subscription.
	const receiver = sbClient.createReceiver(topicName, subscriptionName );

	// function to handle messages
	const myMessageHandler = async (messageReceived) => {
        sendPost(messageReceived);
	};

	// function to handle any errors
	const myErrorHandler = async (error) => {
		console.log(error);
	};

	// subscribe and specify the message and error handlers
	receiver.subscribe({
		processMessage: myMessageHandler,
		processError: myErrorHandler
	});

	// Waiting long enough before closing the sender to send messages
	await delay(5000);

	await receiver.close();	
	await sbClient.close();
}    
// call the main function
main().catch((err) => {
	console.log("Error occurred: ", err);
	process.exit(1);
 });


 function sendPost(messageReceived) {

    axios
      .post('https://licenseplatevalidator.azurewebsites.net/api/lpr/platelocation', {
        LicensePlateCaptureTime: messageReceived.LicensePlateCaptureTime,
        LicensePlate: messageReceived.LicensePlate,
        Latitude: messageReceived.Latitude,
        Longitude: messageReceived.Longitude,
      },
      {
        auth: {
            username: "team20",
            password: "[Ui=D%?cDPW1gQ%k"
          }
      })
      .then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
      })
      .catch(error => {
        console.error(error)
      })
 }