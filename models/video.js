const { mongoose } = require('../database');

const Video = mongoose.model(
  'Video',
  mongoose.Schema({
    title: {
      type: String,
      required: [true, 'Title is required.']
    },
    description: {
      type: String
    },
    url: {
      type: String,
      required: [true, 'Video URL is required.']
    }
  })
);

module.exports = Video;
