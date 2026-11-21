// Fitur search/mltour — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/mltour", {
  "name": "mltour",
  "command": [
    "mltour"
  ],
  "category": "search",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
