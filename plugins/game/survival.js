// Fitur game/survival — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("game/survival", {
  "name": "survival",
  "command": [
    "survival",
    "sv2"
  ],
  "category": "game",
  "desc": "Game survival lengkap dari Tensura.",
  "usage": ".survival <start|...>",
  "owner": false,
  "group": true,
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
