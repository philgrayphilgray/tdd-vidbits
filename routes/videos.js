const router = require('express').Router();
const Video = require('../models/video');

router.post('/videos', async (req, res, next) => {
  const { title, description } = req.body;
  await Video.create({ title, description });
  res.status(201).render('videos');
});

module.exports = router;
