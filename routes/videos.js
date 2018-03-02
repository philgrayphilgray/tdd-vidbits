const router = require('express').Router();
const Video = require('../models/video');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.post('/videos', async (req, res, next) => {
  const { title, description } = req.body;
  const video = await Video.create({ title, description });
  res.status(201).render('videos/show', { video });
});

module.exports = router;
