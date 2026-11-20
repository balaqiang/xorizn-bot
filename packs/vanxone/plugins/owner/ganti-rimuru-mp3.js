// Fitur owner/ganti-rimuru-mp3 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-rimuru-mp3", {
  "name": "ganti-rimuru.mp3",
  "command": [
    "ganti-rimuru.mp3",
    "gantirimuruaudio",
    "setrimuruaudio"
  ],
  "category": "owner",
  "desc": "Ganti audio rimuru.mp3",
  "usage": ".ganti-rimuru.mp3 (reply/kirim audio)",
  "owner": true,
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
