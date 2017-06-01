'use strict';

const express = require('express');
const router = express.Router();
const gameData = require('./gameData');

router.use(gameData);

router.use(function (req, res) {
  res.status(404).end();
});

module.exports = router;
