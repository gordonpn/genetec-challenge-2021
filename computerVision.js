import axios from "axios";
import sharp from "sharp";
import imageUploader from "./imageUploader.js";
import { logToDiscord, sleeper } from "./logger.js";
import wantedRepoInstance from "./wantedRepo.js";

const headers = {
  "Ocp-Apim-Subscription-Key": "5a183987e401460ca913ded10a40d67a",
};

const postUrl =
  "https://eastus.api.cognitive.microsoft.com/vision/v2.0/recognizeText?mode=Printed";

const formatAndValidatePlate = (plate) => {
  if (typeof plate !== "string") return null;

  // remove whitespace and non alpha-numeric values
  const newPlate = plate.trim().replace(/\W/g, "");

  return newPlate;
};

const getImageToText = async (url) => {
  try {
    const res = await axios.get(url, {
      headers: headers,
    });

    const { data } = res;

    // // loop through the text values found and format and val
    // data.recognitionResult.lines.forEach((line) => {
    //   const formattedPlate = formatAndValidatePlate(line.text);

    //   // the plate is either null or a valid string here
    //   if (formattedPlate) {
    //     console.log(`We need to validate this plate ${formattedPlate}`);
    //     if (wantedRepoInstance.has(formattedPlate)) {
    //       wantedPlates.push(formattedPlate);
    //     }

    //     // if the formatted plate isn't null then we can check the repo and eventually send the post request
    //   } else {
    //     console.log(`Skipping this invalid text ${line.text}`);
    //   }
    // });
    const wantedPlates = [];
    data.recognitionResult.lines.forEach((line, index) => {
      const formattedText = formatAndValidatePlate(line.text);
      if (formattedText === null) return;

      if (
        formattedText.length >= 6 &&
        formattedText.length <= 7 &&
        wantedRepoInstance.has(formattedText)
      ) {
        console.log(`Found an OCR Wanted plate ${formattedText}`);
        wantedPlates.push(formattedText);
        return;
      }

      console.log(`Skipping this invalid text ${formattedText}`);

      const nextText = data[index + 1];
      if (!nextText) return;

      const concatPlate = formattedText + formatAndValidatePlate(nextText.text);

      if (
        concatPlate.length >= 6 &&
        concatPlate.length <= 7 &&
        wantedRepoInstance.has(concatPlate)
      ) {
        console.log(`Found an OCR Wanted plate ${concatPlate}`);
        wantedPlates.push(concatPlate);
        return;
      }
      console.log(`Skipping this invalid concat ${formattedText}`);
    });
    return wantedPlates;
  } catch (err) {
    console.log(err?.response?.data);
    logToDiscord(
      `getImageToText Error: ${JSON.stringify(err?.response?.data, null, 2)}`,
      true
    );
    return [];
  }
};

const pollingSuccess = async (url) => {
  // status could be Failed, Succeeded, Running
  await sleeper(800)();
  let pollingResponse = await axios.get(url, { headers: headers });

  while (
    pollingResponse?.data?.status !== "Succeeded" &&
    pollingResponse?.data?.status !== "Failed"
  ) {
    console.log(`OCR operation status: ${pollingResponse?.data?.status}`);
    await sleeper(800)();
    pollingResponse = await axios.get(url, { headers: headers });
  }

  if (pollingResponse?.data?.status === "Succeeded") {
    console.log(`OCR operation status: ${pollingResponse?.data?.status}`);
    return true;
  } else if (pollingResponse?.data?.status === "Failed") {
    console.log(`OCR operation status: ${pollingResponse?.data?.status}`);
    return false;
  }
};

const postImage = async (url) => {
  try {
    let requestSuccess = false;
    let res;
    let retries = 0;

    while (!requestSuccess) {
      retries++;
      if (retries > 3) {
        return;
      }
      res = await axios.post(
        postUrl,
        { url },
        {
          headers: headers,
        }
      );
      console.log(`Sent for OCR\n${url}\n`);
      requestSuccess = await pollingSuccess(res.headers["operation-location"]);
    }
    return await getImageToText(res.headers["operation-location"]);
  } catch (err) {
    logToDiscord(
      `postImage Error: ${JSON.stringify(err?.response?.data, null, 2)}`,
      true
    );
    console.log(err?.response?.data);
    return [];
  }
};

const ocrHandler = async (
  LicensePlateCaptureTime,
  LicensePlate,
  Latitude,
  Longitude,
  ContextImageJpg,
  LicensePlateImageJpg
) => {
  let resizedBuffer;

  try {
    resizedBuffer = await sharp(Buffer.from(LicensePlateImageJpg, "base64"))
      .resize({ width: 500 })
      .jpeg()
      .toBuffer();
  } catch (err) {
    console.log("sharp error:", err);
  }

  const licensePlateImageRef = await imageUploader(
    LicensePlate,
    // LicensePlateImageJpg
    resizedBuffer ? resizedBuffer.toString("base64") : LicensePlateImageJpg
  );

  const arrayWantedOcr = await postImage(licensePlateImageRef);

  arrayWantedOcr.forEach(async (wantedStr) => {
    const contextImageRef = await imageUploader(LicensePlate, ContextImageJpg);

    const payload = {
      LicensePlateCaptureTime,
      LicensePlate: wantedStr,
      Latitude,
      Longitude,
      ContextImageReference: contextImageRef,
    };

    try {
      const res = await axios({
        method: "post",
        url:
          "https://licenseplatevalidator.azurewebsites.net/api/lpr/platelocation",
        data: payload,
        headers: {
          Authorization: "Basic dGVhbTIwOltVaT1EJT9jRFBXMWdRJWs=",
        },
      });

      console.log(
        `Payload sent for validation:\n${JSON.stringify(payload, null, 2)}`
      );

      console.log(`OCR match ${LicensePlate}: ${wantedStr}`);
      logToDiscord(`OCR match ${LicensePlate}: ${wantedStr}`);
      console.log(`data ----- ${res.data}\n`);
    } catch (err) {
      logToDiscord("Caught error in arrayWantedOcr.forEach", true);
      console.warn(`error ----- ${err?.response}\n`);
    }
  });

  // upload LicensePlateImageJpg image to blob
  // upload LicensePlateImageJpg to ocr (only return matches with our reverse index)
  // upload context image to blob
  // validate with payload with actual wanted plate from reverse index
};

// postImage(testImageUrl).catch((err) => console.log(err));

export default ocrHandler;
