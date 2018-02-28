const { assert } = require("chai");

describe("when a user visits the landing page with no existing videos", () => {
  it("renders an empty `videos-container` element", () => {
    browser.url("/");

    assert.equal(browser.getText("#videos-container"), "");
  });

  it("renders a link to `videos/create.html`", () => {
    browser.url("/");
    browser.click(".add-video-button");
    assert.include(browser.getText("body"), "Save a video");
  });
});
