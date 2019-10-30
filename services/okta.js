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

const getAppUsers = async (tokenTyp, token, orgUid) => {
  let queryUrl, data;
  if (orgUid)
      queryUrl = `${config.get("tokenApi")}/api/v1/users/?organization=${orgUid}&active=true`;
  else queryUrl = `${config.get("tokenApi")}/api/v1/users/?active=true`;

  if (tokenTyp.toUpperCase() === "TOKEN")
      data = (await axios.get(queryUrl, { headers: { Authorization: `Token ${token}` } })).data;
  if (tokenTyp.toUpperCase() === "JWT")
      data = (await axios.get(queryUrl, { headers: { Authorization: `JWT ${token}` } })).data;
  return data;
};

const getExistingUsers = async token => {
  const queryUrl = `${keys.tokenApi}/api/v1/api-token-auth`;
  let { data } = await axios.get(queryUrl, { headers: { Authorization: `Token ${token}` } });
  return data;
};

module.exports = {
  oktaJwtVerifier,
  oktaClient,
  getAppUsers,
  getExistingUsers
};
