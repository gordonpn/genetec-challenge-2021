import axios from "axios";
import { sleeper } from "./logger.js";

const headers = {
  "Ocp-Apim-Subscription-Key": "6d6a5184401147978c50d51382ba2e86",
};

const postUrl =
  "https://genetectest123.cognitiveservices.azure.com/vision/v2.0/recognizeText?mode=Printed";

const testImageUrl =
  "https://stteam20strathack.blob.core.windows.net/images/673WAJ";

const formatAndValidatePlate = (plate) => {
  if (typeof plate !== "string") return null;

  // remove whitespace and non alpha-numeric values
  const newPlate = plate.trim().replace(/\W/g, "");

  // only return valid length plates
  if (newPlate.length >= 6 && newPlate.length <= 7) {
    return newPlate;
  } else {
    return null;
  }
};

const getImageToText = async (url) => {
  try {
    const res = await axios.get(url, {
      headers: headers,
    });

    const { data } = res;

    // loop through the text values found and format and val
    data.recognitionResult.lines.forEach((line) => {
      const formattedPlate = formatAndValidatePlate(line["text"]);

      // the plate is either null or a valid string here
      if (formattedPlate) {
        console.log(`we need to validate this plate ${formattedPlate}`);
        // if the formatted plate isn't null then we can check the repo and eventually send the post request
      } else {
        console.log(`Skipping this invalid text ${line["text"]}`);
      }
    });
  } catch (err) {
    console.log(err?.response);
  }
};

const poll = async (url) => {
  // status could be Failed, Succeeded, Running
  let pollingResponse = await axios.get(url, { headers: headers });

  while (pollingResponse?.data?.status !== "Succeeded") {
    console.log(`Operation status: ${pollingResponse?.data?.status}`);
    await sleeper(200)();
    pollingResponse = await axios.get(url, { headers: headers });
  }
};

const postImage = async (url) => {
  try {
    const res = await axios.post(
      postUrl,
      { url },
      {
        headers: headers,
      }
    );
    await poll(res.headers["operation-location"]);
    return await getImageToText(res.headers["operation-location"]);
  } catch (err) {
    console.log(err?.response);
  }
};

postImage(testImageUrl).then();
