// Fitur owner/ganti-vemzo-mp3 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-vemzo-mp3", {
  "name": "ganti-vemzo.mp3",
  "command": [
    "ganti-vemzo.mp3",
    "gantivemzoaudio",
    "setvemzoaudio"
  ],
  "category": "owner",
  "desc": "Ganti audio vemzo.mp3",
  "usage": ".ganti-vemzo.mp3 (reply/kirim audio)",
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
