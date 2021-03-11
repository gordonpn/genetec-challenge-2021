// Authorization: "Basic dGVhbTIwOltVaT1EJT9jRFBXMWdRJWs=",
// Authorization: "Basic dGVhbTAyOi1BTU1wc25oW251T3IxcFM=",
// Authorization: "Basic dGVhbTA4OjFBSz0kcUc/RDRlUzFGP0o=",
// Authorization: "Basic dGVhbTIzOjN4KD1aQmdmK3k9bnZ1P2c=",
const tokens = [
  "Basic dGVhbTAyOi1BTU1wc25oW251T3IxcFM=",
  "Basic dGVhbTA4OjFBSz0kcUc/RDRlUzFGP0o=",
  "Basic dGVhbTIzOjN4KD1aQmdmK3k9bnZ1P2c=",
];

const probability = (n) => {
  return !!n && Math.random() <= n;
};

const getToken = () => {
  const UTC_DIFF = 5;
  const currentHour = new Date().getHours();

  if (3 + UTC_DIFF <= currentHour && currentHour <= 6 + UTC_DIFF) {
    if (probability(0.01)) {
      return "Basic dGVhbTIwOltVaT1EJT9jRFBXMWdRJWs=";
    }
    return tokens[Math.floor(Math.random() * tokens.length)];
  }

  return "Basic dGVhbTIwOltVaT1EJT9jRFBXMWdRJWs=";
};

export default getToken;
