// Fitur ai/roboguru — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/roboguru", {
  "name": "roboguru",
  "command": [
    "roboguru"
  ],
  "category": "ai",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
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
