const { assert } = require("chai");

describe("when the user visits the `videos/create` page", () => {
  describe("and submits the form with a title and description", () => {
    const title = "Magnetic Sound Effects";
    const description = "Collection of interesting magnetic sounds";
    browser.url("/videos/create.html");
    browser.setValue("form input[name=title]", title);
    browser.setValue("form textarea", description);
    browser.click(".submit-button");
    assert.include(browser.getText(".contents-container"), "Videos");
  });
});
