const logger = require("./logger");
const mongoose = require("mongoose");
const { mongoURI } = require("../config/keys");

module.exports = app => {
  mongoose
    .connect(mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(() => {
      const server = app.listen(8080);
      const io = require("./socket").init(server);
      io.on("connection", socket => {
        // socket.emit('request', {})
        console.log(`client connected using socket `);
      });
      if (process.env.NODE_ENV !== "production") return logger.info("Connected database: " + `${mongoURI}...`.green);
      return logger.info("connected to production environment of mongodb...".blue);
    })
    .catch(ex => logger.error(`${ex.message}`));
};
