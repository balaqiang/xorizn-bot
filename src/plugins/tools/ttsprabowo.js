// Fitur tts/ttsprabowo — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("tts/ttsprabowo", {
  "name": "ttsprabowo",
  "command": [
    "ttsprabowo"
  ],
  "category": "tools",
  "desc": "Text-to-speech pakai suara Prabowo",
  "usage": ".ttsprabowo <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
