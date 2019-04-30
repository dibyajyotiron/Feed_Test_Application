process.env.NODE_ENV = "testing";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const nock = require("nock");
const request = require("supertest");

const { expect } = require("chai");
const colors = require("colors");

const { Feed } = require("../models/feed");

const baseURL = require("../config/keys").baseURL;
const mongoURI = require("../config/keys").mongoURI;
const validToken = require("../config/keys").validToken;

const logger = require("../services/logger");

let relativeURL;

const variables = {
  feedUID: "703db4d0-5087-11e9-bdb1-357aaf6bbbf5"
};

describe("Feed routes".blue, () => {
  before(done => {
    // making db connection
    mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true });
    const db = mongoose.connection;
    db.on("error", logger.error.bind(console.name, "error"));
    db.once("open", () => {
      logger.info(`connected to ${mongoURI}`);
      done();
    });
    // insert data into db
    require("../specs/helpers/populate_data/populate")(db);
  });

  after(done => {
    // drop database and close connection
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });
  describe("GET /feeds", () => {
    it("should get all the feeds", async () => {
      relativeURL = "feeds";

      // const response = await nock(baseURL, { reqheaders: { authorization: validToken } })
      //   .get(relativeURL)
      //   .reply(200, allFeeds);
      const response = await request(baseURL)
        .get(relativeURL)
        .set("Content-Type", "application/json")
        .set("Authorization", validToken);
      expect(response.status).to.equals(200);
    });
  });
  describe("GET /feeds/:id", () => {
    it("should get a feed by uid", async () => {
      relativeURL = `feeds/${variables.feedUID}`;
      const response = await request(baseURL)
        .get(relativeURL)
        .set("Authorization", validToken);

      expect(response.status).to.be.equals(200);
      expect(response.body.uid).to.be.equals("703db4d0-5087-11e9-bdb1-357aaf6bbbf5");
      expect(response.body.owner.uid).to.be.equals("00uhtrlx9cXkw9r3l0h7");
    });
  });
  describe("POST /feeds/", () => {
    it("should create a feed", async () => {
      relativeURL = "feeds";
      const response = await request(baseURL)
        .post(relativeURL)
        .set("Authorization", validToken)
        .send({
          name: "An element oriented Feed",
          description: "new Feed",
          targetElementType: "group",
          targetElementUid: "12sdsdsa-asdsa3-sadsad-sweq",
          targetElementStage: "Therm",
          readUsers: [{ uid: "00uhtrlx9cXkw9r3l0h4", email: "user4@scm.com" }, { uid: "00uhtrlx9cXkw9r3l0h4", email: "user4@scm.com" }],
          writeUsers: [{ uid: "00uhtrlx9cXkw9r3l0h8", email: "user2@scm.com" }, { uid: "00uhtrlx9cXkw9r3l0h9", email: "user3@scm.com" }],
          labelsRead: ["labels1", "labels2", "labels2"],
          labelsWrite: ["label", "label1"]
        });

      expect(response.status).to.be.equals(200);
      expect(response.body.success).to.be.equals(true);
    });
  });
});
