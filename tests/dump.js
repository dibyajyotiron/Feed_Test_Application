// describe("GET /feeds", () => {
//   it("should get all the feeds", async () => {
//     relativeURL = "feeds";

//     // const response = await nock(baseURL, { reqheaders: { authorization: validToken } })
//     //   .get(relativeURL)
//     //   .reply(200, allFeeds);
//     const response = await request(baseURL)
//       .get(relativeURL)
//       .set("Content-Type", "application/json")
//       .set("Authorization", validToken);
//     expect(response.status).to.equals(200);
//   });
// });
// describe("GET /feeds/:uid", () => {
//   it("should get a feed by uid", async () => {
//     relativeURL = `feeds/${variables.feedUID}`;
//     const response = await request(baseURL)
//       .get(relativeURL)
//       .set("Authorization", validToken);

//     expect(response.status).to.be.equals(200);
//     expect(response.body.uid).to.be.equals("703db4d0-5087-11e9-bdb1-357aaf6bbbf5");
//     expect(response.body.owner.uid).to.be.equals("00uhtrlx9cXkw9r3l0h7");
//   });
// });
// describe("POST /feeds/", () => {
//   it.only("should create a feed", async () => {
//     relativeURL = "feeds";
//     const response = await request(baseURL)
//       .post(relativeURL)
//       .set("Authorization", validToken)

//     expect(response.status).to.be.equals(200);
//     expect(response.body.success).to.be.equals(true);
//   });
// });
// describe("PUT /feeds/:uid", () => {
//   it("should update a feed", async () => {
//     relativeURL = `feeds/${variables.feedUID}`;

//     const response = await request(baseURL)
//       .put(relativeURL)
//       .set("Authorization", validToken)
// .send();

//     console.log(validToken);

//     expect(response.status).to.be.equals(200);
//     expect(response.body.success).to.be.equals(true);
//   });
// });
