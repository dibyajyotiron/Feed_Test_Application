module.exports = {
  mongoURI: process.env.mongoURI,
  okta: {
    url: process.env.OKTA_URI,
    issuer: process.env.ISSUER,
    clientId: process.env.OKTA_CLIENT_ID,
    oktaAPIKey: process.env.OKTA_API_KEY
  }
};
