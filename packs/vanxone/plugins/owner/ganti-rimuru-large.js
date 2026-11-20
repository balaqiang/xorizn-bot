// Fitur owner/ganti-rimuru-large — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-rimuru-large", {
  "name": "rimuru-large",
  "command": [
    "rimuru-large",
    "setrimurularge",
    "gantirimurularge"
  ],
  "category": "owner",
  "desc": "Preset: Ganti gambar rimuru.jpg, serta rimuru-v7 hingga rimuru-v11.jpg sekaligus",
  "usage": ".rimuru-large (reply/kirim gambar)",
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
