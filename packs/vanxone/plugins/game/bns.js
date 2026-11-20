// Fitur game/bns — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("game/bns", {
  "name": "benaratausalah",
  "command": [
    "benaratausalah",
    "bata",
    "benarsalah",
    "bors"
  ],
  "category": "game",
  "desc": "Game benar atau salah — jawab pertanyaan dengan ",
  "usage": ".benaratausalah",
  "owner": false,
  "group": true,
  "private": true,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
