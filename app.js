require("dotenv");
const winston = require("./services/logger");
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

require("express-async-errors");
require("colors");
require("./services/cors")(app);
require("./services/db")();
require("./services/morgan")(app);

require("./routes/index")(app);
app.listen(port, () => winston.info(`Server started on ${port}...`));
