const { assert } = require('chai');

describe('when the user visits the `videos/create` page', () => {
  describe('and submits the form with a title and description', () => {
    const title = 'Magnetic Sound Effects';
    const description = 'Collection of interesting magnetic sounds';
    it('it returns the user to the landing page which contains the newly submitted information', () => {
      browser.url('/videos/create.html');
      browser.setValue('form input[name=title]', title);
      browser.setValue('form textarea', description);
      browser.click('.submit-button');
      assert.include(browser.getText('.contents-container'), title);
      // assert.include(browser.getText('.contents-container'), description);
    });
  });
});
