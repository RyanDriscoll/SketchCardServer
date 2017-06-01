'use strict';

const express = require('express');
const router = express.Router();
const axios = require('axios');
const teamColors = require('./teamColors');

//API key
const xmlStatsKey = process.env.xmlStats;

function monthOrDayToString(num) {
  let twoDigitDate = num.toString();
  if (twoDigitDate.length === 1) {
    return `0${twoDigitDate}`;
  }
  return twoDigitDate;
}

function createTeamId(name) {
  return name.toLowerCase()
    .split(' ')
    .join('-')
    .replace(/[.]/g, '');
}

function alphabetize(a, b) {
  return a.last_name.toLowerCase().localeCompare(b.last_name.toLowerCase());
}

const config = {
  headers: { Authorization: xmlStatsKey }
};

//Get Games Schedule
router.get('/games', (req, res, next) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = monthOrDayToString(today.getMonth() + 1);
  const day = monthOrDayToString(today.getDate());
  const xmlDate = `${year}${month}${day}`;
  const apiSchedule = `https://erikberg.com/events.json?date=${xmlDate}&sport=mlb`;
  const games = [];
  axios.get(apiSchedule, config)
    .then(sched => {
      sched.data.event.forEach(game => {
        const newGame = {};
        newGame.gameId = game.event_id;
        newGame.homeName = game.home_team.last_name;
        newGame.homeColors = teamColors[game.home_team.last_name];
        newGame.homeId = createTeamId(game.home_team.full_name);
        newGame.awayName = game.away_team.last_name;
        newGame.awayColors = teamColors[game.away_team.last_name];
        newGame.awayId = createTeamId(game.away_team.full_name);
        newGame.time = game.start_date_time;
        games.push(newGame);
      });
    })
    .then(() => res.send(games))
    .catch(err => console.error(err));
});

//Get Rosters
router.get('/team/:teamId', (req, res, next) => {
  const apiRoster = `https://erikberg.com/mlb/roster/${req.params.teamId}.json`;

  axios.get(apiRoster, config)
    .then(roster => {
      const sortedRoster = roster.data.players.sort(alphabetize);
      res.send(sortedRoster);
    })
    .catch(err => console.error(err));
});

module.exports = {router};
