const shouldMakeGet = () => {
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  if (currentHour >= 21 && currentMinute >= 45) {
    return false;
  }
  return true;
};

export default shouldMakeGet;
