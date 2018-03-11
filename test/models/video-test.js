const { assert } = require('chai');
const {
  connectDatabase,
  disconnectDatabase
} = require('../database-utilities');

const Video = require('../../models/video');

describe('Video model', () => {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);

  describe('#title', () => {
    it('is a string', () => {
      const titleAsInt = 3;
      const video = new Video({ title: titleAsInt });

      assert.strictEqual(video.title, titleAsInt.toString());
    });

    it('is required', () => {
      const video = new Video({
        description: 'test',
        url: 'http://google.com'
      });
      video.validateSync();
      assert.equal(video.errors.title.message, 'Title is required.');
    });
  });

  describe('#description', () => {
    it('is a string', () => {
      const descriptionAsInt = 5000;
      const video = new Video({ description: descriptionAsInt });

      assert.strictEqual(video.description, descriptionAsInt.toString());
    });
  });

  describe('#url', () => {
    it('is a string', () => {
      const urlAsInt = 666;
      const video = new Video({ url: urlAsInt });

      assert.strictEqual(video.url, urlAsInt.toString());
    });

    it('is required', () => {
      const video = new Video({
        title: 'test',
        description: 'testing 1, 2, 3....'
      });
      video.validateSync();
      assert.equal(video.errors.url.message, 'Video URL is required.');
    });
  });
});
