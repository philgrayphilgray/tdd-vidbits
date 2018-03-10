const router = require('express').Router();
const Video = require('../models/video');

router.get('/videos/create', (req, res) => {
  res.render('videos/create');
});

router.post('/videos', async (req, res, next) => {
  const { title, description } = req.body;
  const video = await new Video({ title, description });
  await video.save();
  res.status(201).render('videos/show', { video });
});

router.get('/', async (req, res, next) => {
  const videos = await Video.find({});
  res.status(201).render('index', { videos });
});

module.exports = router;
