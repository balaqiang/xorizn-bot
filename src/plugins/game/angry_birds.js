// Fitur game/angry_birds — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/angry_birds", {
  "name": "angrybirds",
  "command": [
    "angrybirds",
    "angrybird",
    "abirds"
  ],
  "category": "game",
  "desc": "Angry Birds mini - tembak burung ke target!",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
