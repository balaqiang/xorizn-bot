// Fitur tts/ttsgoku — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tts/ttsgoku", {
  "name": "ttsgoku",
  "command": [
    "ttsgoku",
    "gokutts"
  ],
  "category": "audio",
  "desc": "Text to Speech dengan suara Goku",
  "usage": ".ttsgoku <text>",
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
