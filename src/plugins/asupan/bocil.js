// Fitur asupan/bocil — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("asupan/bocil", {
  "name": "bocil",
  "command": [
    "bocil",
    "bocilvid"
  ],
  "category": "asupan",
  "desc": "Video bocil",
  "usage": ".bocil",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
