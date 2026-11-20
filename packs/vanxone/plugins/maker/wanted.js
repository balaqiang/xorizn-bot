// Fitur maker/wanted — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/wanted", {
  "name": "wanted",
  "command": [
    "wanted",
    "wantedposter"
  ],
  "category": "maker",
  "desc": "Efek poster wanted",
  "usage": ".wanted (reply foto)",
  "owner": false,
  "group": false,
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
