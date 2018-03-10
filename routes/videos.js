const router = require('express').Router();
const Video = require('../models/video');

router.get('/create', (req, res) => {
  res.render('videos/create');
});

router.post('/', async (req, res, next) => {
  let { title, description } = req.body;
  if (!title) {
    const error = 'Title is required.';
    res.render('videos/create', { title, description, error });
    res.status(400);
  } else {
    const video = await new Video({ title, description });
    await video.save();
    res.redirect(`/videos/${video._id}`);
  }
});

router.get('/', async (req, res, next) => {
  const videos = await Video.find({});
  res.status(201).render('videos/index', { videos });
});

router.get('/:videoId', async (req, res, next) => {
  const video = await Video.findById({ _id: req.params.videoId });
  res.render('videos/show', { video });
});

module.exports = router;
