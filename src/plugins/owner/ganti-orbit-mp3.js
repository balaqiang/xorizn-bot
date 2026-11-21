// Fitur owner/ganti-orbit-mp3 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-orbit-mp3", {
  "name": "ganti-orbit.mp3",
  "command": [
    "ganti-orbit.mp3",
    "gantiorbitaudio",
    "setorbitaudio"
  ],
  "category": "owner",
  "desc": "Ganti audio orbit.mp3",
  "usage": ".ganti-orbit.mp3 (reply/kirim audio)",
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
