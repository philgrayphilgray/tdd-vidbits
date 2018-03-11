const { assert } = require('chai');

// const generateRandomUrl = domain => `http//${domain}/${Math.random()}`;

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
    const title = 'Magnetic Sound Effects';
    const description = 'Collection of interesting magnetic sounds';

    browser.url('/videos/create');
    browser.setValue('form input[name=title]', title);
    browser.setValue('form textarea', description);
    browser.click('.submit-button');
    browser.url('/');
    assert.include(browser.getText('#videos-container'), title);
  });

  it('renders an iframe with a video URL', () => {
    const title = 'Magnetic Sound Effects';
    const description = 'Collection of interesting magnetic sounds';
    const url = 'https://www.youtube.com/watch?v=Du1a_dgGoXc';

    browser.url('/videos/create');
    browser.setValue('form input[name=title]', title);
    browser.setValue('form textarea', description);
    browser.setValue('form input[name=url]', url);
    browser.click('.submit-button');
    browser.url('/');
    assert.equal(browser.getAttribute('iframe', 'src'), url);
  });

  it('renders a link to the video details page at `videos/:videoId`', () => {
    const title = 'Magnetic Sound Effects';
    const description = 'Collection of interesting magnetic sounds';
    const url = 'https://www.youtube.com/watch?v=Du1a_dgGoXc';

    browser.url('/videos/create');
    browser.setValue('form input[name=title]', title);
    browser.setValue('form textarea', description);
    browser.setValue('form input[name=url]', url);
    browser.click('.submit-button');
    browser.url('/');
    browser.click('.video-title a');
    assert.include(browser.getText('.contents-container'), description);
  });
});
