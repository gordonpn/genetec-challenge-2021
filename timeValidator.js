export default function isExpired(rawTime) {
  const receivedTime = Date.parse(rawTime);
  const FIVE_HOURS = 18000000;
  const convertedTime = receivedTime - FIVE_HOURS;
  const timeNow = new Date().getTime();
  const diffInMilliseconds = Math.abs(timeNow - convertedTime);

  if (diffInMilliseconds <= 120000) {
    return false;
  }
  return true;
}
