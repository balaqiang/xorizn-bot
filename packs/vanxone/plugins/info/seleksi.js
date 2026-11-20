// Fitur main/seleksi — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("main/seleksi", {
  "name": "seleksif02",
  "command": [
    "seleksif02",
    "f02",
    "joinf02"
  ],
  "category": "info",
  "desc": "Seleksi masuk F02",
  "usage": ".seleksif02",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
