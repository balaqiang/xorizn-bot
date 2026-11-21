// Fitur owner/ganti-auroraai-mp3 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-mp3", {
  "name": "ganti-auroraai.mp3",
  "command": [
    "ganti-auroraai.mp3",
    "gantiauroraaiaudio",
    "setauroraaiaudio"
  ],
  "category": "owner",
  "desc": "Ganti audio auroraai.mp3",
  "usage": ".ganti-auroraai.mp3 (reply/kirim audio atau URL)",
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
