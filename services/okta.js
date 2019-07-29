const OktaJwtVerifier = require("@okta/jwt-verifier"),
  okta = require("@okta/okta-sdk-nodejs"),
  axios = require("axios"),
  keys = require("../config/keys");

const oktaClient = new okta.Client({
  orgUrl: keys.okta.url,
  token: keys.okta.oktaAPIKey
});

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: keys.okta.issuer,
  clientId: keys.okta.clientId
});

const oktaHeader = {
  Authorization: `SSWS ${keys.okta.oktaAPIKey}`
};

const getExistingUsers = async token => {
  const queryUrl = `${keys.tokenApi}/api/v1/api-token-auth`;
  let { data } = await axios.get(queryUrl, { headers: { Authorization: `Token ${token}` } });
  return data;
};

const getAppUsers = async () => {
  const queryUrl = `${keys.okta.url}/api/v1/users?limit=999999999`;
  let { data } = await axios.get(queryUrl, { headers: oktaHeader });
  return data;
};

module.exports = {
  oktaJwtVerifier,
  oktaClient,
  getAppUsers,
  getExistingUsers
};
