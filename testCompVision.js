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
    const { data } = await axios.get(url, {
      headers: headers,
    });

    // loop through the text values found and format and val
    data.recognitionResult.lines.forEach((line) => {
      const formattedPlate = formatAndValidatePlate(line["text"]);

      // the plate is either null or a valid string here
      if (formattedPlate) {
        console.log(`we need to validate this plate ${formattedPlate}`);
        // if the formatted plate isnt null then we can check the repo and eventually send the post request
      } else {
        console.log(`Skipping this invalid text ${line["text"]}`);
      }
    });

  } catch (err) {
    console.log(err?.response);
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
    await sleeper(1000)();
    return await getImageToText(res.headers["operation-location"]);
  } catch (err) {
    console.log(err?.response);
  }
};

postImage(testImageUrl).then();
