// Fitur tts/ttsai — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tts/ttsai", {
  "name": "ttsvoice",
  "command": [
    "ttsvoice"
  ],
  "category": "audio",
  "desc": "",
  "usage": "",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
