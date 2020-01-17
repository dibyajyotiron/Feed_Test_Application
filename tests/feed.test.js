process.env.NODE_ENV = "testing";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const request = require("supertest");
// const { expect } = require("chai");
const colors = require("colors");

const { baseURL } = require("../config/keys");
const { mongoURI } = require("../config/keys");
const { validToken } = require("../config/keys");

const logger = require("../services/logger");

const variables = {
  feedUID: "703db4d0-5087-11e9-bdb1-357aaf6bbbf5"
};

describe("Feed routes".blue, () => {
  let connection;
  let db;

  beforeAll(async () => {
    function clearDB() {
      for (let i in mongoose.connection.collections) {
        mongoose.connection.collections[i].deleteMany();
      }
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true });
    }
    return clearDB();
  });

  afterAll(async () => {
    // drop database and close connection
    await mongoose.disconnect();
  });

  const testCases = [
    {
      desc: "GET /feeds",
      motive: "should get all the feeds",
      relativeURL: "feeds",
      token: validToken,
      matcher: {
        length: 4
      }
    },
    {
      desc: "GET /feeds/:uid",
      motive: "should get a particular feed",
      relativeURL: `feeds/${variables.feedUID}`,
      token: validToken,

      matcher: {
        uid: variables.feedUID
      }
    },
    {
      desc: "POST /feeds",
      motive: "should create a new feed",
      relativeURL: "feeds",
      token: validToken,
      body: {
        name: "An element oriented Feed",
        description: "new Feed",
        targetElementType: "group",
        targetElementUid: "12sdsdsa-asdsa3-sadsad-sweq",
        targetElementStage: "Therm",
        readUsers: [{ uid: "00uhtrlx9cXkw9r3l0h4", email: "user4@scm.com" }, { uid: "00uhtrlx9cXkw9r3l0h4", email: "user4@scm.com" }],
        writeUsers: [{ uid: "00uhtrlx9cXkw9r3l0h8", email: "user2@scm.com" }, { uid: "00uhtrlx9cXkw9r3l0h9", email: "user3@scm.com" }],
        labelsRead: ["labels1", "labels2", "labels2"],
        labelsWrite: ["label", "label1"]
      },
      matcher: {
        success: true
      }
    },
    {
      desc: "PUT /feeds/:uid",
      motive: "should update a feed",
      relativeURL: `feeds/${variables.feedUID}`,
      token: validToken,
      body: {
        name: "updated test feed",
        description: "test Feed",
        targetElementType: "group",
        targetElementUid: "12sdsdsa-asdsa3-sadsad-sweq",
        targetElementStage: "Therm",
        readUsers: [{ uid: "00uhtrlx9cXkw9r3l0h4", email: "user4@scm.com" }, { uid: "00uhtrlx9cXkw9r3l0h4", email: "user4@scm.com" }],
        writeUsers: [{ uid: "00uhtrlx9cXkw9r3l0h8", email: "user2@scm.com" }, { uid: "00uhtrlx9cXkw9r3l0h9", email: "user3@scm.com" }],
        labelsRead: ["labels1", "labels2", "labels2"],
        labelsWrite: ["label", "label1"]
      },
      matcher: {
        success: true
      }
    }
  ];

  for (let testCase of testCases) {
    describe(testCase.desc, () => {
      it(testCase.motive, async () => {
        let response;

        switch (testCase.desc.split(" ")[0]) {
          case "GET":
            response = await request(baseURL)
              .get(testCase.relativeURL)
              .set("Authorization", testCase.token);
            break;
          case "POST":
            response = await request(baseURL)
              .post(testCase.relativeURL)
              .set("Authorization", testCase.token)
              .send(testCase.body);
            break;

          case "PUT":
            response = await request(baseURL)
              .put(testCase.relativeURL)
              .set("Authorization", testCase.token);
            break;
          case "DELETE":
            response = await request(baseURL)
              .delete(testCase.relativeURL)
              .set("Authorization", testCase.token);
            break;
        }
        console.log(await request(baseURL).get(testCase.relativeURL));
        console.log(baseURL, testCase.relativeURL);
        expect(response.status).to.equals(200);
        if (Array.isArray(response.body)) {
          expect(response.body.length).to.equals(testCase.matcher.length);
        }
        for (let property in testCase.matcher) {
          expect(response.body[property]).to.equals(testCase.matcher[property]);
        }
      });
    });
  }
});
