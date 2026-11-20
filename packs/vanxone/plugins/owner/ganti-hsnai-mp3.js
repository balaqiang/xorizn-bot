// Fitur owner/ganti-hsnai-mp3 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-mp3", {
  "name": "ganti-hsnai.mp3",
  "command": [
    "ganti-hsnai.mp3",
    "gantihsnaiaudio",
    "sethsnaiaudio"
  ],
  "category": "owner",
  "desc": "Ganti audio hsnai.mp3",
  "usage": ".ganti-hsnai.mp3 (reply/kirim audio atau URL)",
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
