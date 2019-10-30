const _ = require("lodash"),
  { ALLOWED_ROLES } = require("../constants"),
  { cacheStore } = require("../services/cache"),
  { oktaJwtVerifier, getExistingUsers } = require("../services/okta");

const handleToken = async token => {
  const cachedUser = cacheStore.get(token);
  if (cachedUser) return cachedUser;

  let existingUser = await getExistingUsers(token);

  const user = {
    status: existingUser.status,
    role: (existingUser.user_role || {}).name,
    uid: existingUser.user_id,
    email: existingUser.email,
    app_permissions: existingUser.app_permissions || {},
    organization: (existingUser.user_organization || {}).uid,
    is_owner: existingUser.is_owner || false,
    is_manager: existingUser.is_manager || false,
    labels: (existingUser.labels || []).map(l => l.uid) || []
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
    switch (tokenType.toUpperCase()) {
      case "JWT": {
        let jwt = await oktaJwtVerifier.verifyAccessToken(accessToken);
        req.user = {
          status: jwt.claims.status,
          role: (jwt.claims.user_role || {}).name,
          uid: jwt.claims.user_id,
          email: jwt.claims.email,
          organization: (jwt.claims.user_organization || {}).uid,
          app_permissions: jwt.claims.app_permissions || {},
          is_owner: jwt.claims.is_owner,
          is_manager: jwt.claims.is_manager,
          labels: (jwt.claims.labels || []).map(label => label.uid) || []
        };
        req.claims = jwt.claims;

        if (!req.user.uid)
          return res.status(httpStatusCodes.UNAUTHORIZED).json({
            error: true,
            message: "User is not logged in!"
          });

        req.user.obj = { uid: req.user.uid.toString("hex"), email: req.user.email };

        return next();
      }
      case "TOKEN": {
        let user = await handleToken(accessToken);
        if (!user) return res.json({ error: true, message: "Invalid token" });
        req.user = user;
        req.user.obj = { uid: req.user.uid, email: req.user.email };
        req.claims = user.existingUser;
        return next();
      }
      default:
        return res.status(401).json({ error: true, message: "The auth token should start with JWT or TOKEN." });
    }
  } catch (error) {
    return res
    .status(error.response.status)
    .json({ error: true, message: error.message, reason: error.response.data.detail });
  }
};

const isActive = async (req, res, next) => {
  let user = req.user;
  if (!user || user.status.toUpperCase() !== "ACTIVE") {
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
    return res.status(403).json({
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
    if (!roles.includes(req.user.role)) return res.status(400).json({ error: true, message: "You do not have enough permissions" });
    return next();
  };
};
const checkPermission = (resource, perm) => {
  return (req, res, next) => {
    if (req.user.organization && (req.user.is_manager || req.user.is_owner)) return next();
    if (ALLOWED_ROLES.includes(req.user.role)) return next();

    const newResource = res.locals[resource];

    const userLabels = req.user.labels || [];

    const labelsRead = newResource.labelsRead || [];
    const labelsWrite = newResource.labelsWrite || [];

    const owner = newResource.owner;

    const readUsersList = newResource.readUsers.map(user => user.uid);
    const writeUsersList = newResource.writeUsers.map(user => user.uid);

    const readLabelsList = labelsRead.some(label => userLabels.indexOf(label) >= 0);
    const writeLabelsList = labelsWrite.some(label => userLabels.indexOf(label) >= 0);

    const readUserAccess = readUsersList.includes(req.user.uid) || writeUsersList.includes(req.user.uid);
    const writeUserAccess = writeUsersList.includes(req.user.uid);

    const readLabelsAccess = readLabelsList || writeLabelsList;
    const writeLabelsAccess = writeLabelsList;

    const readAccess = readUserAccess || readLabelsAccess ? true : false;
    const writeAccess = writeUserAccess || writeLabelsAccess ? true : false;

    const ownerAccess = owner.uid === req.user.uid;

    switch (true) {
      case perm === "read" && readAccess:
        return next();
      case perm === "write" && writeAccess:
        return next();
      case perm === "owner" && ownerAccess:
        return next();
      default:
        return res.status(403).json({ error: true, message: "You do not have the necessary permissions!" });
    }
  };
};
module.exports = {
  verifyToken,
  isActive,
  isBot,
  hasRoles,
  checkPermission,
  checkOwnerOrAllowedRoles
};
