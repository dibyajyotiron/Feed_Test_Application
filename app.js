require("dotenv").config();
const winston = require("./services/logger");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const port = process.env.PORT || 4000;

require("colors");
require("express-async-errors");
require("./services/cors")(app);
require("./services/db")(app);
require("./services/morgan")(app);

require("./routes/index")(app);

module.exports = http.listen(port, () => winston.info(`Server started on ${port}...`));
