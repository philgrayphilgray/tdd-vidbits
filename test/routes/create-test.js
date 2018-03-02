const { assert } = require('chai');
const request = require('supertest');

const app = require('../../app');
const Video = require('../../models/video');
const { mongoose, databaseUrl, options } = require('../../database');

describe('Server path: `/videos`', () => {
  describe('POST', () => {
    it('responds to new video creation with the status code 201', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form');
      assert.equal(response.status, 201);
    });
  });
  describe('when a video is submitted to the server', () => {
    beforeEach(async () => {
      await mongoose.connect(databaseUrl, options);
      await mongoose.connection.db.dropDatabase();
    });

    afterEach(async () => {
      await mongoose.disconnect();
    });

    const sampleData = {
      title: 'Magnetic Sound Effects',
      description: 'Collection of interesting magnetic sounds'
    };

    it('submits a video with a title and description', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(sampleData);

      const video = await Video.findOne({ sampleData });
      assert.isOk(video);
    });
  });
});
