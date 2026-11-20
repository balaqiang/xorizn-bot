// Fitur sticker/smemecode — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("sticker/smemecode", {
  "name": "smemecode",
  "command": [
    "smemecode",
    "sendwmcode"
  ],
  "category": "sticker",
  "desc": "Kirim kode rahasia smeme ke PM owner",
  "usage": ".smemecode",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
