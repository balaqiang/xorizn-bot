// Fitur fun/tod — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("fun/tod", {
  "name": "todgame",
  "command": [
    "todgame"
  ],
  "category": "fun",
  "desc": "Bermain Truth or Dare bersama teman-teman grup secara instan!",
  "usage": ".tod",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
