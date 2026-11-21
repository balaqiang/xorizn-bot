// Fitur game/pac_man — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/pac_man", {
  "name": "pacman",
  "command": [
    "pacman",
    "pac"
  ],
  "category": "game",
  "desc": "Pac-Man classic - makan titik & hindari hantu!",
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
