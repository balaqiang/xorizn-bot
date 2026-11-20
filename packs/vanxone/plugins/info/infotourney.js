// Fitur info/infotourney — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("info/infotourney", {
  "name": "infotourney",
  "command": [
    "infotourney",
    "tourney",
    "turnamen",
    "mltourney"
  ],
  "category": "info",
  "desc": "Info turnamen Mobile Legends terbaru",
  "usage": ".infotourney",
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
