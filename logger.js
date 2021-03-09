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

export default appendToLogs;
