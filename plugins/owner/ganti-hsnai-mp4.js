// Fitur owner/ganti-hsnai-mp4 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-mp4", {
  "name": "ganti-hsnai.mp4",
  "command": [
    "ganti-hsnai.mp4",
    "gantihsnaivideo",
    "sethsnaivideo"
  ],
  "category": "owner",
  "desc": "Ganti video hsnai.mp4",
  "usage": ".ganti-hsnai.mp4 (reply/kirim video atau URL)",
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
