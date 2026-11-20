// Fitur jpm/stopjpm — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("jpm/stopjpm", {
  "name": "stopjpm",
  "command": [
    "stopjpm",
    "stopjasher",
    "stopjaser"
  ],
  "category": "broadcast",
  "desc": "Hentikan proses JPM",
  "usage": ".stopjpm",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
