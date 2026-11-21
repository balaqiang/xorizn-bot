// Fitur game/speedydash — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/speedydash", {
  "name": "speedydash",
  "command": [
    "speedydash",
    "speedydashgame"
  ],
  "category": "game",
  "desc": "Main game endless runner Speedy Dash langsung di chat, kumpulin ring dan hindari musuh",
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
