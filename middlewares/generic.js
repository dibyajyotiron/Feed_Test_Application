const { intersectionWith } = require("lodash");

function checkReadWriteConflict(readUsers, writeUsers) {
  if (intersectionWith(readUsers, writeUsers, (read, write) => read.uid === write.uid).length) return true;
  return false;
}

module.exports = {
  validateReqBody(joiSchema) {
    return (req, res, next) => {
      const { error } = joiSchema(req.body, req);
      const { readUsers, writeUsers } = req.body;

      if (joiSchema.name === "validateFeedSchema" && checkReadWriteConflict(readUsers, writeUsers))
        return res.status(400).json({ error: true, message: "Read and write users are conflicting!" });

      if (error)
        return res.status(400).json({
          error: true,
          message: error.details ? error.details[0].message : error.message
        });
      return next();
    };
  }
};
