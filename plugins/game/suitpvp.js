// Fitur game/suitpvp — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/suitpvp", {
  "name": "suitpvp",
  "command": [
    "suitpvp",
    "janken"
  ],
  "category": "game",
  "desc": "Main suit (batu gunting kertas) dengan player lain",
  "usage": ".suit @tag",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
