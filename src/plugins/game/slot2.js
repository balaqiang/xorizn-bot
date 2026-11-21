// Fitur game/slot2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/slot2", {
  "name": "slot2",
  "command": [
    "slot2",
    "slots2",
    "mesin2",
    "mesinslot2"
  ],
  "category": "game",
  "desc": "Inline Fruit Bonanza slot game",
  "usage": ".slot2",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 1,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
