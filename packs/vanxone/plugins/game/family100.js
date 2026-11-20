// Fitur game/family100 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("game/family100", {
  "name": "family100",
  "command": [
    "f100",
    "survei"
  ],
  "category": "game",
  "desc": "Survey says! Tebak jawaban teratas survei",
  "usage": ".family100",
  "owner": false,
  "group": true,
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
