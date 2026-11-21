// Fitur owner/ganti-orbit-mp4 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-orbit-mp4", {
  "name": "ganti-orbit.mp4",
  "command": [
    "ganti-orbit.mp4",
    "gantiorbitvideo",
    "setorbitvideo"
  ],
  "category": "owner",
  "desc": "Ganti video orbit.mp4",
  "usage": ".ganti-orbit.mp4 (reply/kirim video)",
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
