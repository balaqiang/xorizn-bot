// Fitur owner/ganti-auroraai-mp4 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-mp4", {
  "name": "ganti-auroraai.mp4",
  "command": [
    "ganti-auroraai.mp4",
    "gantiauroraaivideo",
    "setauroraaivideo"
  ],
  "category": "owner",
  "desc": "Ganti video auroraai.mp4",
  "usage": ".ganti-auroraai.mp4 (reply/kirim video atau URL)",
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
