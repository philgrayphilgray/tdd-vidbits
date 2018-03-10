const router = require('express').Router();
const Video = require('../models/video');

router.get('/create', (req, res) => {
  res.render('videos/create');
});

router.post('/', async (req, res, next) => {
  let { title, description } = req.body;
  if (!title) {
    res.render('create', { title, description });
    res.status(400);
  } else {
    const video = await new Video({ title, description });
    await video.save();
    res.status(201).render('videos/show', { video });
  }
});

router.get('/', async (req, res, next) => {
  const videos = await Video.find({});
  res.status(201).render('videos/index', { videos });
});

module.exports = router;
