// Fitur game/perangsarung — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("game/perangsarung", {
  "name": "perangsarung",
  "command": [
    "perangsarung"
  ],
  "category": "game",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
