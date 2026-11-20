// Fitur owner/ganti-ourin-mp4 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("owner/ganti-ourin-mp4", {
  "name": "ganti-ourin.mp4",
  "command": [
    "ganti-ourin.mp4",
    "gantiourinvideo",
    "setourinvideo"
  ],
  "category": "owner",
  "desc": "Ganti video ourin.mp4",
  "usage": ".ganti-ourin.mp4 (reply/kirim video)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
