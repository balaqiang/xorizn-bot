// Fitur game/kyubigame — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/kyubigame", {
  "name": "kyubigame",
  "command": [
    "kyubigame",
    "kyubi",
    "naruto",
    "shinobi"
  ],
  "category": "game",
  "desc": "Jelajahi dunia shinobi dan hadapi musuh Ninja terkuat",
  "usage": ".kyubigame",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
