// Fitur game/flappy — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/flappy", {
  "name": "flappy",
  "command": [
    "flappy",
    "flappybird"
  ],
  "category": "game",
  "desc": "Game webview Flappy Bird interaktif",
  "usage": ".flappy",
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
