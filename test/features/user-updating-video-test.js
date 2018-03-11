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

describe('when a user clicks to edit a Video', () => {
  it('navigates the user to the video edit form', () => {
    submitVideo(title, description, url);
    browser.click('#edit');
    // assert.equal(browser.getText('h1'), `Edit ${title}`);
    const newTitle = { ...title, value: 'New Title' };
    submitVideo(newTitle);
    assert.equal(browser.getText('.video-title h1'), newTitle.value);
  });
});
