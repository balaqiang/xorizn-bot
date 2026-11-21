// Fitur tts/ttseminem — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tts/ttseminem", {
  "name": "ttseminem",
  "command": [
    "ttseminem",
    "eminemtts"
  ],
  "category": "audio",
  "desc": "Text to Speech dengan suara Eminem",
  "usage": ".ttseminem <text>",
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
