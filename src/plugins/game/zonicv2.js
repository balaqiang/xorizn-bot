// Fitur game/zonicv2 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("game/zonicv2", {
  "name": "zonicv2",
  "command": [
    "zonicv2",
    "sonicv2",
    "speedydashv2"
  ],
  "category": "game",
  "desc": "ZONIC V2 — Sonic Speed Adventure with laser and boss battles",
  "usage": ".zonicv2",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
