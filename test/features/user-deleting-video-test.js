const { assert } = require('chai');

const title = {
  value: 'Magnetic Sound Effects',
  selector: 'form input[name=title]'
};
const description = {
  value: 'Collection of interesting magnetic sounds',
  selector: 'form textarea'
};
const url = {
  value: 'https://www.youtube.com/watch?v=Du1a_dgGoXc',
  selector: 'form input[name=url]'
};

submitVideo = (...fields) => {
  browser.url('/videos/create');
  fields.forEach(field => {
    browser.setValue(field.selector, field.value);
  });
  browser.click('.submit-button');
};

describe('when a user clicks the button to delete a video', () => {
  it('removes the video from the list', () => {
    submitVideo(title, description, url);
    browser.click('#delete');
    browser.url('/');
    assert.notInclude(browser.getText('#videos-container'), title.value);
  });
});
