module.exports = {
  baseURL: "https://feed-prod.herokuapp.com/",
  mongoURI: process.env.mongoURI,
  okta: {
    url: process.env.OKTA_URI,
    issuer: process.env.OKTA_ISSUER,
    clientId: process.env.OKTA_CLIENT_ID,
    oktaAPIKey: process.env.OKTA_API_KEY
  },
  tokenApi: "https://core-stage-server.sensehawk.com"
};
