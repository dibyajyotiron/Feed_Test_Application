const _ = require("lodash"),
  { ALLOWED_ROLES } = require("../constants"),
  keys = require("../config/keys"),
  { cacheStore } = require("../services/cache"),
  { oktaClient, oktaJwtVerifier, getAppUsers } = require("../services/okta");

const handleToken = async token => {
  const cachedUser = cacheStore.get(token);
  if (cachedUser) return cachedUser;

  let users = [];
  await oktaClient
    .listUsers({
      search: `profile.token eq "${token}"`
    })
    .each(user => users.push(user));

  if (!users.length) return;
  const oktaUser = users[0];

  let appUsers = await getAppUsers();
  if (!_.find(appUsers, appUser => appUser.profile.email === oktaUser.profile.email)) return null;

  const user = {
    status: oktaUser.status,
    role: oktaUser.profile.user_role,
    uid: oktaUser.id,
    email: oktaUser.profile.email,
    organization: oktaUser.profile.organization,
    is_owner: oktaUser.profile.is_owner,
    is_manager: oktaUser.profile.is_manager,
    labels: oktaUser.profile.labels
  };

  cacheStore.set(token, user);
  return user;
};

const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(400).json({
        error: true,
        message: "Token required"
      });
    let tokenList = req.headers.authorization.split(" ");
    if (!tokenList.length === 2)
      return res.status(400).json({
        error: true,
        message: "Token required"
      });
    let [tokenType, accessToken] = tokenList;

    if (tokenType.toUpperCase() === "JWT") {
      let jwt = await oktaJwtVerifier.verifyAccessToken(accessToken);

      req.user = {
        status: jwt.claims.status,
        role: jwt.claims.role,
        uid: jwt.claims.uid,
        email: jwt.claims.email,
        organization: jwt.claims.organization,
        is_owner: jwt.claims.is_owner,
        is_manager: jwt.claims.is_manager,
        labels: jwt.claims.labels
      };
      req.user.obj = { uid: req.user.uid.toString("hex"), email: req.user.email };
      return next();
    } else if (tokenType.toUpperCase() === "TOKEN") {
      user = await handleToken(accessToken);
      if (!user) return res.json({ error: true, message: "Invalid token" });
      req.user = user;
      req.user.obj = { uid: req.user.uid.toString("hex"), email: req.user.email };
      next();
    } else return res.json({ error: true, message: "Not implemented yet." });
  } catch (error) {
    return res.json({ error: true, message: error.message });
  }
};

const isActive = async (req, res, next) => {
  let user = req.user;
  if (!user || user.status !== "ACTIVE") {
    return res.status(400).json({ error: true, message: "User is not active." });
  }
  return next();
};

const checkOwnerOrAllowedRoles = resource => {
  return (req, res, next) => {
    let source = res.locals[resource];
    if ((source.owner.uid === req.user.uid && source.owner.email === req.user.email) || ALLOWED_ROLES.includes(req.user.role)) {
      return next();
    }
    return res.status(UNAUTHORIZED).json({
      error: true,
      message: "You do not have enough permissions!"
    });
  };
};

const isBot = async (req, res, next) => {
  let user = req.user;
  if (!user || user.role !== "bot") return res.status(400).json({ error: true, message: "You do not have enough permissions" });
  return next();
};

const hasRoles = roles => {
  return (req, res, next) => {
    if (!_.includes(roles, req.user.role)) return res.status(400).json({ error: true, message: "You do not have enough permissions" });
    return next();
  };
};

// TODO: refactor getusers, check readusers, writeusers in viewscontroller to use okta search by org

module.exports = {
  verifyToken,
  isActive,
  isBot,
  hasRoles,
  checkOwnerOrAllowedRoles
};
