// Fitur tts/holotts — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tts/holotts", {
  "name": "holotts",
  "command": [
    "holotts",
    "hololive",
    "hololivetts",
    "vnholo"
  ],
  "category": "audio",
  "desc": "TTS suara karakter Hololive via RVC Hugging Face",
  "usage": ".holotts <karakter>|<teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
