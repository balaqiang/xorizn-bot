// Fitur owner/ganti-vemzo-mp4 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-vemzo-mp4", {
  "name": "ganti-vemzo.mp4",
  "command": [
    "ganti-vemzo.mp4",
    "gantivemzovideo",
    "setvemzovideo"
  ],
  "category": "owner",
  "desc": "Ganti video vemzo.mp4",
  "usage": ".ganti-vemzo.mp4 (reply/kirim video)",
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
