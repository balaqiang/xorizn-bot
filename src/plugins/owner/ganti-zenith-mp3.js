// Fitur owner/ganti-zenith-mp3 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-zenith-mp3", {
  "name": "ganti-zenith.mp3",
  "command": [
    "ganti-zenith.mp3",
    "gantizenithaudio",
    "setzenithaudio"
  ],
  "category": "owner",
  "desc": "Ganti audio zenith.mp3",
  "usage": ".ganti-zenith.mp3 (reply/kirim audio)",
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
