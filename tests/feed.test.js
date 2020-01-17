process.env.NODE_ENV = "testing";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const request = require("supertest");
const { expect } = require("chai");
const colors = require("colors");

const { baseURL, mongoURI, validToken } = require("../config/keys");

const variables = {
  feedUID: "703db4d0-5087-11e9-bdb1-357aaf6bbbf5"
};

function createMongoConnection(db) {
  mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true });
  db.on("error", console.error.bind(console, "connection error"));
  db.once("open", function() {
    console.log(`We are connected to ${db.name} database!\n`.cyan);
  });
}
function clearDB(db) {
  mongoose.connection.dropDatabase(() => {
    console.log(`Cleaning - ${db.name} database dropped`.red);
  });
}

describe("Feed Routes".blue, async() => {
  const db = mongoose.connection;
  createMongoConnection(db);
  before(async () => {
    require("../specs/helpers/populate_data/populate")(db);
  });

  after(async () => {
    // drop database and close connection
    clearDB(db);
    await mongoose.disconnect();
  });

  const testCases = [
    {
      desc: "GET /feeds",
      motive: "should get all the feeds",
      relativeURL: "/feeds",
      token: validToken,
      matcher: {
        length: 3
      }
    },
    {
      desc: "GET /feeds/:uid",
      motive: "should get a particular feed",
      relativeURL: `/feeds/${variables.feedUID}`,
      token: validToken,

      matcher: {
        uid: variables.feedUID
      }
    },
    {
      desc: "POST /feeds",
      motive: "should create a new feed",
      relativeURL: "/feeds",
      token: validToken,
      body: {
        name: "An element oriented Feed",
        description: "new Feed",
        targetElementType: "group",
        targetElementUid: "12sdsdsa-asdsa3-sadsad-sweq",
        targetElementStage: "THERM",
        readUsers: [
          { uid: "00uhtrlx9cXkw9r3l0h4", email: "user4@scm.com" },
          { uid: "00uhtrlx9cXkw9r3l0h4", email: "user4@scm.com" }
        ],
        writeUsers: [
          { uid: "00uhtrlx9cXkw9r3l0h8", email: "user2@scm.com" },
          { uid: "00uhtrlx9cXkw9r3l0h9", email: "user3@scm.com" }
        ],
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
      relativeURL: `/feeds/${variables.feedUID}`,
      token: validToken,
      body: {
        name: "updated test feed",
        description: "test Feed",
        targetElementType: "group",
        targetElementUid: "12sdsdsa-asdsa3-sadsad-sweq",
        targetElementStage: "THERM",
        readUsers: [
          { uid: "00uhtrlx9cXkw9r3l0h4", email: "user4@scm.com" },
          { uid: "00uhtrlx9cXkw9r3l0h4", email: "user4@scm.com" }
        ],
        writeUsers: [
          { uid: "00uhtrlx9cXkw9r3l0h8", email: "user2@scm.com" },
          { uid: "00uhtrlx9cXkw9r3l0h9", email: "user3@scm.com" }
        ],
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
        // console.log(await request(baseURL).get(testCase.relativeURL).set("Authorization", testCase.token));
        // console.log(`${baseURL}${testCase.relativeURL}`.italic);
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
