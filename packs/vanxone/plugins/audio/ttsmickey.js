// Fitur tts/ttsmickey — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tts/ttsmickey", {
  "name": "ttsmickey",
  "command": [
    "ttsmickey",
    "mickeytts",
    "ttsmickeymouse"
  ],
  "category": "audio",
  "desc": "Text to Speech dengan suara Mickey Mouse",
  "usage": ".ttsmickey <text>",
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
