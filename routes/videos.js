const router = require("express").Router();

router.post("/videos", (req, res, next) => {
  res.status(201).render("videos");
});

module.exports = router;
