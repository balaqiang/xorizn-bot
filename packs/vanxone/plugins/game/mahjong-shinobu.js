// Fitur game/mahjong-shinobu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/mahjong-shinobu", {
  "name": "mahjong",
  "command": [
    "mahjong",
    "mjong",
    "mj",
    "kyoko"
  ],
  "category": "game",
  "desc": "Kyoko Mahjong v6.2 dengan HTML AI Rich Message.",
  "usage": ".mahjong",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
