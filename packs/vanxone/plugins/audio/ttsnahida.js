// Fitur tts/ttsnahida — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tts/ttsnahida", {
  "name": "ttsnahida",
  "command": [
    "ttsnahida",
    "nahidatts"
  ],
  "category": "audio",
  "desc": "Text to Speech dengan suara Nahida",
  "usage": ".ttsnahida <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
