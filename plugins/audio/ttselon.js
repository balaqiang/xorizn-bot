// Fitur tts/ttselon — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tts/ttselon", {
  "name": "ttselon",
  "command": [
    "ttselon",
    "elontts",
    "ttselonmusk"
  ],
  "category": "audio",
  "desc": "Text to Speech dengan suara Elon Musk",
  "usage": ".ttselon <text>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
