function isExpired(rawTime) {
  const receivedTime = Date.parse(rawTime);
  // const FIVE_HOURS = 18000000;
  // const convertedTime = receivedTime - FIVE_HOURS;
  const timeNow = new Date().getTime();
  const diffInMilliseconds = Math.abs(timeNow - receivedTime);

  console.log(`receivedTime: ${receivedTime}, timeNow: ${timeNow}`);
  if (diffInMilliseconds <= 540000) {
    console.log("Has not expired");
    return false;
  }
  console.log("Has expired");
  return true;
}

export default isExpired;
