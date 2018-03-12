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
    url: 'https://www.youtube.com/embed/Du1a_dgGoXc'
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

    it('contains an iframe with the submitted src value', async () => {
      const video = await Video.create(testVideoToCreate);
      const response = await request(app).get('/videos');

      assert.equal(
        parseFromHTML(response.text, '.video-player', 'src'),
        video.url
      );
    });

    describe('/videos/:videoId', () => {
      it('should render a page with an iframe with the correct video URL as the src', async () => {
        const video = await Video.create(testVideoToCreate);
        const response = await request(app).get(`/videos/${video._id}`);

        assert.include(
          parseFromHTML(response.text, 'iframe', 'src'),
          video.url
        );
      });
    });

    describe('`/videos/:videoId/edit`', () => {
      it('should render an edit form with the current values', async () => {
        const video = await Video.create(testVideoToCreate);
        const response = await request(app).get(`/videos/${video._id}/edit`);

        assert.include(
          parseFromHTML(response.text, 'input[name="title"]', 'value'),
          video.title
        );
      });
    });
  });

  describe('POST', () => {
    describe('when a new video is submitted to the server', () => {
      it('saves a Video document with a video URL', async () => {
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(testVideoToCreate);

        const video = await Video.findOne({});

        assert.equal(video.url, testVideoToCreate.url);
      });
      it('responds to new video creation with the status code 302', async () => {
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(testVideoToCreate);
        assert.equal(response.status, 302);
      });

      it('submits a video with a title and description', async () => {
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(testVideoToCreate);

        const video = await Video.findOne({});

        assert.equal(video.title, testVideoToCreate.title);

        // now check the video page
        const { _id } = video;
        const getResponse = await request(app).get(`/videos/${_id}`);

        assert.equal(
          parseFromHTML(getResponse.text, 'h1'),
          testVideoToCreate.title
        );
        assert.equal(
          parseFromHTML(getResponse.text, 'p'),
          testVideoToCreate.description
        );
      });

      describe('when the title is missing', () => {
        // destructure values from test object for remixing
        const { description, url, title } = testVideoToCreate;
        const testVideoToCreateWithoutTitle = { description, url };

        it('does not save the video', async () => {
          const response = await request(app)
            .post('/videos')
            .type('form')
            .send(testVideoToCreateWithoutTitle);

          const allItems = await Video.find({});

          assert.isEmpty(allItems);
        });

        it('responds with a status `400`', async () => {
          const response = await request(app)
            .post('/videos')
            .type('form')
            .send(testVideoToCreateWithoutTitle);

          assert.equal(response.status, 400);
        });

        it('renders `videos/create`', async () => {
          const response = await request(app)
            .post('/videos')
            .type('form')
            .send(testVideoToCreateWithoutTitle);

          assert.include(
            parseFromHTML(response.text, '.submit-button'),
            'Save'
          );
        });

        it('renders a validation error message', async () => {
          const response = await request(app)
            .post('/videos')
            .type('form')
            .send(testVideoToCreateWithoutTitle);

          assert.include(
            parseFromHTML(response.text, '.error'),
            'Title is required.'
          );
        });

        it('preserves other field values', async () => {
          const response = await request(app)
            .post('/videos')
            .type('form')
            .send(testVideoToCreateWithoutTitle);
          assert.equal(
            parseFromHTML(
              response.text,
              'textarea[name="description"]',
              'value'
            ),
            description
          );
        });
      });

      describe('when the URL field is missing', () => {
        const { description, url, title } = testVideoToCreate;
        const testVideoToCreateWithoutUrl = { description, title };

        it('renders a validation error message', async () => {
          const response = await request(app)
            .post('/videos')
            .type('form')
            .send(testVideoToCreateWithoutUrl);

          assert.include(
            parseFromHTML(response.text, '.error'),
            'Video URL is required.'
          );
        });
      });
    });

    describe('`videos/:id/updates`', () => {
      describe('when the update is submitted with validation errors', () => {
        it('renders the edit form with an error message', async () => {
          const updatedTitle = '';
          const video = await Video.create(testVideoToCreate);
          const response = await request(app)
            .post(`/videos/${video._id}/updates`)
            .type('form')
            .send({ title: updatedTitle });

          assert.include(
            parseFromHTML(response.text, '.error'),
            'Title is required.'
          );
        });
        it('responds with status 400', async () => {
          const updatedTitle = '';
          const video = await Video.create(testVideoToCreate);
          const response = await request(app)
            .post(`/videos/${video._id}/updates`)
            .type('form')
            .send({ title: updatedTitle });

          assert.equal(response.status, 400);
        });
      });

      describe('when the update is submitted without validation errors', () => {
        it('updates the current record', async () => {
          const updatedTitle = 'Updated Title';
          const video = await Video.create(testVideoToCreate);
          const response = await request(app)
            .post(`/videos/${video._id}/updates`)
            .type('form')
            .send({ ...testVideoToCreate, title: updatedTitle });

          const updatedVideo = await Video.findOne({});

          assert.equal(updatedVideo.title, updatedTitle);
        });

        it('redirects to the `/videos/:id` and returns a status of 302', async () => {
          const updatedTitle = 'Updated Title';
          const video = await Video.create(testVideoToCreate);
          const response = await request(app)
            .post(`/videos/${video._id}/updates`)
            .type('form')
            .send({ ...testVideoToCreate, title: updatedTitle });

          assert.equal(response.status, 302);

          const updatedVideoResponse = await request(app).get(
            `/videos/${video._id}`
          );

          assert.include(
            parseFromHTML(updatedVideoResponse.text, '.video-title'),
            updatedTitle
          );
        });
      });
    });
    describe('`videos/:id/deletions`', () => {
      it('removes the record from the database', async () => {
        await request(app)
          .post('/videos')
          .type('form')
          .send(testVideoToCreate);

        const video = await Video.findOne({});

        await request(app).post(`/videos/${video._id}/deletions`);

        const videos = await Video.find({});

        assert.isEmpty(videos);
      });
    });
  });
});
