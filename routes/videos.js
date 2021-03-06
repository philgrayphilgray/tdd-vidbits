const router = require('express').Router();
const Video = require('../models/video');

router.get('/create', (req, res) => {
  res.render('videos/create');
});

router.post('/', async (req, res, next) => {
  let { title, description, url } = req.body;

  const video = await new Video({ title, description, url });
  video.validateSync();
  if (video.errors) {
    res.status(400).render('videos/create', { video });
  } else {
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

router.get('/:videoId/edit', async (req, res) => {
  const video = await Video.findById({ _id: req.params.videoId });
  res.render('videos/edit', { video });
});

router.post('/:videoId/updates', async (req, res) => {
  const { title, description, url } = req.body;
  const video = await Video.findOneAndUpdate(
    { _id: req.params.videoId },
    { title, description, url },
    { new: true }
  );
  video.validateSync();
  if (video.errors) {
    res.status(400).render('videos/edit', { video });
  } else {
    await video.save();
    res.redirect(`/videos/${video._id}`);
  }
});

router.post('/:videoId/deletions', async (req, res) => {
  await Video.deleteOne({ _id: req.params.videoId });
  res.redirect('/');
});

module.exports = router;
