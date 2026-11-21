// Fitur search/clip — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("search/clip", {
  "name": "clip",
  "command": [
    "clip"
  ],
  "category": "search",
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
