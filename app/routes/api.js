const router = require('express').Router();
const songRouter = require('./SongRoute');
router.use('/songs',songRouter);
module.exports = router;