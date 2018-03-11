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

describe('when a user visits the landing page with no existing videos', () => {
  it('renders an empty `videos-container` element', () => {
    browser.url('/');

    assert.equal(browser.getText('#videos-container'), '');
  });

  it('renders a link that allows users to navigate to `videos/create.html`', () => {
    browser.url('/');
    browser.click('.add-video-button');
    assert.include(browser.getText('body'), 'Save a video');
  });
});

describe('when a user visits the landing page with an exiting video', () => {
  it('renders it in the list', () => {
    submitVideo(title, description, url);
    browser.url('/');
    assert.include(browser.getText('#videos-container'), title.value);
  });

  it('renders an iframe with a video URL', () => {
    submitVideo(title, description, url);
    browser.url('/');
    assert.equal(browser.getAttribute('iframe', 'src'), url.value);
  });

  it('renders a link to the video details page at `videos/:videoId`', () => {
    submitVideo(title, description, url);
    browser.url('/');
    browser.click('.video-title a');
    assert.include(browser.getText('.contents-container'), description.value);
  });
});
