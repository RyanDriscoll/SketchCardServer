'use strict';

const express = require('express');
const router = require('./server/gameData').router;
const PORT = process.env.PORT || 8080;

const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router);

app.use(function(err, req, res, next) {
  console.error(err, err.stack);
  res.status(err.status || 500).send(err);
});

app.listen(PORT, function() {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
