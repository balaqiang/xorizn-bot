// Fitur info/buildml — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("info/buildml", {
  "name": "buildml",
  "command": [
    "buildml"
  ],
  "category": "info",
  "desc": "Build hero Mobile Legends",
  "usage": ".buildml <hero>",
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
