const receivedTime = Date.parse("2021-03-09T13:41:00");
const FIVE_HOURS = 18000000;
const convertedTime = receivedTime - FIVE_HOURS;
console.log("file: scratch.js | line 4 | convertedTime", convertedTime);
const timeNow = new Date().getTime();
console.log("file: scratch.js | line 6 | timeNow", timeNow);
const diffInMilliseconds = Math.abs(timeNow - convertedTime);

if (diffInMilliseconds <= 120000) {
  console.log(
    "file: scratch.js | line 10 | diffInMilliseconds >= 120",
    diffInMilliseconds <= 120000, diffInMilliseconds, 'Good'
  );
}

else if (diffInMilliseconds >= 120000) {
  console.log(
    "file: scratch.js | line 10 | diffInMilliseconds >= 120",
    diffInMilliseconds >= 120000, diffInMilliseconds, 'expired'
  );
}
