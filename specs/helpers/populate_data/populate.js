const { ObjectId } = require("mongoose").Types;

const allFeeds = [
  {
    data: [],
    labelsRead: [],
    labelsWrite: [],
    active: true,
    _id: ObjectId("5c9b6510ef6bde4ce37c2faf"),
    uid: "703db4d0-5087-11e9-bdb1-357aaf6bbbf5",
    owner: {
      uid: "00uhtrlx9cXkw9r3l0h7",
      email: "user1@scm.com"
    },
    targetElementType: "group",
    targetElementUid: "12sdsdsa-asdsa3-sadsad-sweq",
    targetElementStage: "THERM",
    _element: ObjectId("5cc6d3846b2afc401a2a4803"),
    description: "Hello Comment",
    readUsers: [
      {
        uid: "00uhtrlx9cXkw9r3l0h8",
        email: "user2@scm.com"
      },
      {
        uid: "00uhtrlx9cXkw9r3l0h7",
        email: "user1@scm.com"
      },
      {
        uid: "00uhtrlx9cXkw9r3l0h4",
        email: "user4@scm.com"
      }
    ],
    writeUsers: [
      {
        uid: "00uhtrlx9cXkw9r3l0h8",
        email: "user2@scm.com"
      },
      {
        uid: "00uhtrlx9cXkw9r3l0h6",
        email: "user1@scm.com"
      },
      {
        uid: "00uhtrlx9cXkw9r3l0h9",
        email: "user3@scm.com"
      }
    ],
    __v: 19
  },
  {
    data: [],
    labelsRead: [],
    labelsWrite: [],
    active: true,
    _id: ObjectId("5ca5056de4afb34e9e7b28ad"),
    name: "Third Feed",
    uid: "4ff45bd0-5644-11e9-ab54-e798fdc4b6a8",
    owner: {
      uid: "00uhtrlx9cXkw9r3l0h7",
      email: "user1@scm.com"
    },
    description: "Third Feed",
    _element: ObjectId("5cc6d3846b2afc401a2a4803"),
    targetElementUid: "Abc1233423",
    targetElementType: "Abc1233423",
    targetElementStage: "THERM",
    readUsers: [
      {
        uid: "00uhtrlx9cXkw9r3l0h4",
        email: "user4@scm.com"
      }
    ],
    writeUsers: [
      {
        uid: "00uhtrlx9cXkw9r3l0h8",
        email: "user2@scm.com"
      },
      {
        uid: "00uhtrlx9cXkw9r3l0h9",
        email: "user3@scm.com"
      },
      {
        uid: "00uhtrlx9cXkw9r3l0h7",
        email: "user1@scm.com"
      }
    ],
    createdAt: "2019-04-03T19:11:41.084Z",
    updatedAt: "2019-04-03T19:11:41.084Z",
    __v: 0
  },
  {
    data: [],
    labelsRead: ["label2"],
    labelsWrite: [],
    active: true,
    _id: ObjectId("5ca5a3c3e8430b1e7aa4e9c1"),
    name: "A brand new Feed",
    uid: "b03d5150-56a2-11e9-81b3-fb9c5237dfe3",
    owner: {
      uid: "00uhtrlx9cXkw9r3l0h7",
      email: "user1@scm.com"
    },
    description: "new Feed",
    _element: ObjectId("5cc6d3846b2afc401a2a4803"),
    targetElementUid: "Abc1233423",
    targetElementType: "Abc1233423",
    targetElementStage: "THERM",
    readUsers: [
      {
        uid: "00uhtrlx9cXkw9r3l0h4",
        email: "user4@scm.com"
      },
      {
        uid: "00uhtrlx9cXkw9r3l0h5",
        email: "user5@scm.com"
      }
    ],
    writeUsers: [
      {
        uid: "00uhtrlx9cXkw9r3l0h8",
        email: "user2@scm.com"
      },
      {
        uid: "00uhtrlx9cXkw9r3l0h9",
        email: "user3@scm.com"
      },
      {
        uid: "00uhtrlx9cXkw9r3l0h7",
        email: "user1@scm.com"
      },
      {
        uid: "00uhtrlx9cXkw9r3l0h6",
        email: "user@scm.com"
      }
    ],
    createdAt: "2019-04-04T06:27:15.317Z",
    updatedAt: "2019-04-04T10:48:11.524Z",
    __v: 7
  }
];

const allComments = [
  {
    _id: ObjectId("5c9c8b8abb137d1ebd85a8fe"),
    comment: "Hello Comment",
    _owner: { uid: "00uhtrlx9cXkw9r3l0h7", email: "user1@scm.com" },
    _feed: ObjectId("5c9b6510ef6bde4ce37c2faf"),
    uid: "f5a47370-5136-11e9-af63-8d97d884b2e7",
    createdAt: "1553763210282",
    __v: "0"
  },
  {
    _id: ObjectId("5c9c96a225405d2a13dc13af"),
    comment: "Hello Comment Reply",
    _parentCommentUid: "f5a47370-5136-11e9-af63-8d97d884b2e7",
    _owner: { uid: "00uhtrlx9cXkw9r3l0h7", email: "user1@scm.com" },
    _feed: ObjectId("5c9b6510ef6bde4ce37c2faf"),
    uid: "92c88320-513d-11e9-a370-81eb0fcdf4f9",
    createdAt: "1553766050900",
    __v: "0"
  },
  {
    _id: ObjectId("5ca481bb3750d040bded8b59"),
    comment: "Hello Comment 2",
    _owner: { uid: "00uhtrlx9cXkw9r3l0h7", email: "user1@scm.com" },
    _feed: ObjectId("5c9b6510ef6bde4ce37c2faf"),
    uid: "d0cf3620-55f5-11e9-aeb3-91bbba655b25",
    createdAt: "1554284987012",
    __v: "0"
  },
  {
    _id: ObjectId("5ca481ed9f1cf040ad782999"),
    comment: "Hello Comment 2 Reply",
    _owner: { uid: "00uhtrlx9cXkw9r3l0h7", email: "user1@scm.com" },
    _feed: ObjectId("5c9b6510ef6bde4ce37c2faf"),
    uid: "eec24b90-55f5-11e9-80a4-adb0bb0c8071",
    createdAt: "1554285037259",
    _parentCommentUid: "d0cf3620-55f5-11e9-aeb3-91bbba655b25",
    __v: "0"
  },
  {
    _id: ObjectId("5ca48245aff10240d1cce9bf"),
    comment: "Hello Comment 3",
    _owner: { uid: "00uhtrlx9cXkw9r3l0h7", email: "user1@scm.com" },
    _feed: ObjectId("5c9b6510ef6bde4ce37c2faf"),
    uid: "2357c060-55f6-11e9-8c62-ef313d103c65",
    createdAt: "1554285125480",
    __v: "0"
  },
  {
    _id: ObjectId("5ca5e92ee8d91d1ac05b5752"),
    comment: "Hello Comment 4",
    _owner: { uid: "00uhtrlx9cXkw9r3l0h7", email: "user1@scm.com" },
    _feed: ObjectId("5c9b6510ef6bde4ce37c2faf"),
    uid: "10b36460-56cc-11e9-af6c-4be39aba6e76",
    createdAt: "1554377006507",
    updatedAt: "1554377006507",
    __v: "0"
  },
  {
    _id: ObjectId("5ca5e9523952031ac4cc10c0"),
    comment: "Hello Comment 4 Reply",
    _owner: { uid: "00uhtrlx9cXkw9r3l0h7", email: "user1@scm.com" },
    _feed: ObjectId("5c9b6510ef6bde4ce37c2faf"),
    uid: "2606ae80-56cc-11e9-9e2b-2f284a97ad08",
    _parentCommentUid: "10b36460-56cc-11e9-af6c-4be39aba6e76",
    createdAt: "1554377042285",
    updatedAt: "1554377042285",
    __v: "0"
  }
];

const allVotes = [
  {
    _id: ObjectId("5c9ca2efeb751e353a8113c7"),
    value: "-1",
    _voter: { uid: "00uhtrlx9cXkw9r3l0h7", email: "user1@scm.com" },
    _comment: ObjectId("5c9c96a225405d2a13dc13af"),
    createdAt: "1553769199060",
    __v: "0"
  },
  {
    _id: ObjectId("5c9cab4d0a71900814535023"),
    value: "-1",
    _voter: { uid: "00uhtrlx9cXkw9r3l0h8", email: "user2@scm.com" },
    _comment: ObjectId("5c9c96a225405d2a13dc13af"),
    createdAt: "1553769199060",
    __v: "0"
  },
  {
    _id: ObjectId("5c9cab600a71900814535024"),
    value: "1",
    _voter: { uid: "00uhtrlx9cXkw9r3l0h9", email: "user3@scm.com" },
    _comment: ObjectId("5c9c96a225405d2a13dc13af"),
    createdAt: "1553769199060",
    __v: "0"
  },
  {
    _id: ObjectId("5c9e3879f6eb04443050df06"),
    value: "-1",
    _voter: { uid: "00uhtrlx9cXkw9r3l0h7", email: "user1@scm.com" },
    _comment: ObjectId("5c9c8b8abb137d1ebd85a8fe"),
    createdAt: "1553873017775",
    __v: "0"
  }
];

const allElements = [{ _id: ObjectId("5cc6d3846b2afc401a2a4803"), type: "group", data: "THERM", uid: "e75083a0-6a67-11e9-b2db-7170f20a862a", __v: 0 }];

function populateDB(db, collection, data) {
  // insert data into db
  db.collection(collection).insertMany(data);
}
module.exports = db => {
  populateDB(db, "feeds", allFeeds);
  populateDB(db, "votes", allVotes);
  populateDB(db, "comments", allComments);
  populateDB(db, "elements", allElements);
};
