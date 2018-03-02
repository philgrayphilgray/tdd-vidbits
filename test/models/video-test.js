const { assert } = require('chai');
const { mongoose, databaseUrl, options } = require('../../database');

const Video = require('../../models/video');

async function connectDatabase() {
  await mongoose.connect(databaseUrl, options);
  await mongoose.connection.db.dropDatabase();
}

async function disconnectDatabase() {
  await mongoose.disconnect();
}

describe('#title', () => {
  it('is a string', () => {
    const titleAsInt = 3;
    const video = new Video({ title: titleAsInt });

    assert.strictEqual(video.title, titleAsInt.toString());
  });
});

describe('#description', () => {
  it('is a string', () => {
    const descriptionAsInt = 5000;
    const video = new Video({ description: descriptionAsInt });

    assert.strictEqual(video.description, descriptionAsInt.toString());
  });
});

module.exports = {
  connectDatabase,
  disconnectDatabase
};
