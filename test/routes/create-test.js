const { assert } = require('chai');
const request = require('supertest');
const { jsdom } = require('jsdom');

const app = require('../../app');
const Video = require('../../models/video');
const {
  connectDatabase,
  disconnectDatabase
} = require('../database-utilities');

const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(
      `No element with selector ${selector} found in HTML string.`
    );
  }
};

describe('Server path: `/videos`', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('POST', () => {
    it('responds to new video creation with the status code 302', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send({ title: 'Magnetic Sound Effects' });
      assert.equal(response.status, 302);
    });
  });
  describe('when a video is submitted to the server', () => {
    const sampleData = {
      title: 'Magnetic Sound Effects',
      description: 'Collection of interesting magnetic sounds'
    };

    it('submits a video with a title and description', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(sampleData);

      const video = await Video.findOne({});

      assert.equal(video.title, sampleData.title);

      // now check the video page
      const { _id } = video;
      const getResponse = await request(app).get(`/videos/${_id}`);

      assert.equal(parseTextFromHTML(getResponse.text, 'h1'), sampleData.title);
      assert.equal(
        parseTextFromHTML(getResponse.text, 'p'),
        sampleData.description
      );
    });
  });
});
