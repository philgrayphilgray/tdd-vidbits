const { assert } = require('chai');
const request = require('supertest');
const { jsdom } = require('jsdom');

const app = require('../../app');
const {
  connectDatabase,
  disconnectDatabase
} = require('../database-utilities');
const Video = require('../../models/video');

const parseFromHTML = (htmlAsString, selector, type = 'textContent') => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement[type];
  } else {
    throw new Error(
      `No element with selector ${selector} found in HTML string.`
    );
  }
};

describe('Server path: `/videos`', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  const testVideoToCreate = {
    title: 'Magnetic Sound Effects',
    description: 'Collection of interesting magnetic sounds',
    url: 'https://www.youtube.com/watch?v=Du1a_dgGoXc'
  };

  describe('GET', () => {
    it('includes the values for a newly created video', async () => {
      const video = await Video.create(testVideoToCreate);
      const response = await request(app).get('/videos');

      assert.include(
        parseFromHTML(response.text, '#videos-container'),
        video.title
      );
    });

    describe('/videos/:id', () => {
      it('should render a specific video page', async () => {
        const video = await Video.create(testVideoToCreate);
        const response = await request(app).get(`/videos/${video._id}`);

        assert.include(
          parseFromHTML(response.text, '.contents-container'),
          video.title
        );
      });
    });
  });

  describe('POST', () => {
    it('saves a Video document with a video URL', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(testVideoToCreate);

      const video = await Video.findOne({});

      assert.equal(video.url, testVideoToCreate.url);
    });

    describe('when the title is missing', () => {
      it('does not save the video', async () => {
        // copy with only the description property
        const { description } = testVideoToCreate;
        const testVideoToCreateWithoutTitle = { description };

        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(testVideoToCreateWithoutTitle);

        const allItems = await Video.find({});

        assert.isEmpty(allItems);
      });

      it('responds with a status `400`', async () => {
        const { description } = testVideoToCreate;
        const testVideoToCreateWithoutTitle = { description };

        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(testVideoToCreateWithoutTitle);

        assert.equal(response.status, 400);
      });

      it('renders `videos/create`', async () => {
        const { description } = testVideoToCreate;
        const testVideoToCreateWithoutTitle = { description };

        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(testVideoToCreateWithoutTitle);

        assert.include(parseFromHTML(response.text, '.submit-button'), 'Save');
      });

      it('renders a validation error message', async () => {
        const { description } = testVideoToCreate;
        const testVideoToCreateWithoutTitle = { description };

        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(testVideoToCreateWithoutTitle);

        assert.include(
          parseFromHTML(response.text, 'textarea[name="description"]', 'value'),
          description
        );
      });
    });
  });
});
