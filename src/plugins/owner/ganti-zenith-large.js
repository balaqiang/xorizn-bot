// Fitur owner/ganti-zenith-large — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("owner/ganti-zenith-large", {
  "name": "zenith-large",
  "command": [
    "zenith-large",
    "setzenithlarge",
    "gantizenithlarge"
  ],
  "category": "owner",
  "desc": "Preset: Ganti gambar zenith.jpg, serta zenith-v7 hingga zenith-v11.jpg sekaligus",
  "usage": ".zenith-large (reply/kirim gambar)",
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
