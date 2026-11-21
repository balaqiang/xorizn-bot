// Fitur owner/ganti-vemzo-large — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("owner/ganti-vemzo-large", {
  "name": "vemzo-large",
  "command": [
    "vemzo-large",
    "setvemzolarge",
    "gantivemzolarge"
  ],
  "category": "owner",
  "desc": "Preset: Ganti gambar vemzo.jpg, serta vemzo-v7 hingga vemzo-v11.jpg sekaligus",
  "usage": ".vemzo-large (reply/kirim gambar)",
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
