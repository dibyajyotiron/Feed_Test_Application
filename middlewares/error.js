const logger = require("../services/logger");
module.exports = {
  notFoundError(req, res, next) {
    return res.status(404).json({
      error: true,
      message: "The resource you are looking for is not available"
    });
  },

  internalServerError(error, req, res, next) {
    console.error(error.message, error);
    return res.status(500).json({ error: true, message: "Something went wrong!" });
  }
};
