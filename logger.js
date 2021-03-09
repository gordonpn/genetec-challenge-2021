import axios from "axios";
import { appendFile } from "fs/promises";

const appendToLogs = async (licensePlate, recordedTime) => {
  try {
    await appendFile(
      "./seenPlates.csv",
      `\n"${licensePlate}", "${recordedTime}"`
    );
  } catch (err) {
    console.log(err);
  }
};

const logToDiscord = async (message, isError = false) => {
  let discordUrl =
    "https://discord.com/api/webhooks/818944083425755148/-uXqQ2tNDG-rGaOEDpLXgkcys_flMwJ5bFJ8gr9nQDr4s-Lb_XnoLC3m3581sSMfWLhH";

  if (isError) {
    discordUrl =
      "https://discord.com/api/webhooks/818948024751095840/tGqzdT52AF2dAxWBv_PYPJdtvVyRnxEoONNPTKRzgsoK2ptppxt5-M49c2-akETqeG0Y";
  }

  try {
    await axios({
      method: "post",
      url: discordUrl,
      data: { content: message },
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export { appendToLogs, logToDiscord };
