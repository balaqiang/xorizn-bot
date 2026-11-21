// Fitur owner/ganti-orbit-large — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-orbit-large", {
  "name": "orbit-large",
  "command": [
    "orbit-large",
    "setorbitlarge",
    "gantiorbitlarge"
  ],
  "category": "owner",
  "desc": "Preset: Ganti gambar orbit.jpg, serta orbit-v7 hingga orbit-v11.jpg sekaligus",
  "usage": ".orbit-large (reply/kirim gambar)",
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
