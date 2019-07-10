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
      const server = require("../app");
      const io = require("./socket").init(server);
      io.on("connection", socket => {
        logger.info(`client connected using socket id of ${socket.id}`);

        socket.on("typing", data => {
          console.log(data);
          socket.broadcast.emit("typing", data);
        });

        socket.on("comments", async comment => {
          console.log(comment);
          await comment.save();
        });

        socket.on("disconnect", () => {
          logger.info(`client with id ${socket.id} got disconnected!`);
        });
      });
      if (process.env.NODE_ENV !== "production") return logger.info("Connected database: " + `${mongoURI}...`.green);
      return logger.info("connected to production environment of mongodb...".blue);
    })
    .catch(ex => logger.error(`${ex.message}`));
};
