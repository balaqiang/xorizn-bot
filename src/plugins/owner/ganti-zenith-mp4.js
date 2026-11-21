// Fitur owner/ganti-zenith-mp4 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-zenith-mp4", {
  "name": "ganti-zenith.mp4",
  "command": [
    "ganti-zenith.mp4",
    "gantizenithvideo",
    "setzenithvideo"
  ],
  "category": "owner",
  "desc": "Ganti video zenith.mp4",
  "usage": ".ganti-zenith.mp4 (reply/kirim video)",
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
