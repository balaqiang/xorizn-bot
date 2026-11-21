// Fitur owner/ganti-rimuru-mp4 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-rimuru-mp4", {
  "name": "ganti-rimuru.mp4",
  "command": [
    "ganti-rimuru.mp4",
    "gantirimuruvideo",
    "setrimuruvideo"
  ],
  "category": "owner",
  "desc": "Ganti video rimuru.mp4",
  "usage": ".ganti-rimuru.mp4 (reply/kirim video)",
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
