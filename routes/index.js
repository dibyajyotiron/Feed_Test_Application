const express = require("express");

const feed = require("./feeds");
const comment = require("./comments");
const vote = require("./votes");

const { internalServerError, notFoundError } = require("../middlewares/error");

module.exports = app => {
  app.use(express.json());
  app.use("/feeds", feed);
  app.use("/comments", comment);
  app.use("/vote", vote);
  app.use(notFoundError);
  app.use(internalServerError);
};
