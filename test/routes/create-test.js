const { assert } = require("chai");
const request = require("supertest");
const app = require("../../app");

describe("Server path: `/videos`", () => {
  describe("POST", () => {
    it("responds to new video creation with the status code 201", async () => {
      const response = await request(app)
        .post("/videos")
        .type("form");
      assert.equal(response.status, 201);
    });
  });
});
