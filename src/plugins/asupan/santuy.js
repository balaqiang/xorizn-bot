// Fitur asupan/santuy — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("asupan/santuy", {
  "name": "santuy",
  "command": [
    "santuy",
    "santuyvid"
  ],
  "category": "asupan",
  "desc": "Video santuy",
  "usage": ".santuy",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
