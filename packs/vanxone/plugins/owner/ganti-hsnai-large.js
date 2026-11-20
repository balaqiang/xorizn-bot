// Fitur owner/ganti-hsnai-large — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-large", {
  "name": "hsnai-large",
  "command": [
    "hsnai-large",
    "sethsnailarge",
    "gantihsnailarge"
  ],
  "category": "owner",
  "desc": "Preset: Ganti gambar hsnai.jpg, serta hsnai-v7 hingga hsnai-v11.jpg sekaligus",
  "usage": ".hsnai-large (reply/kirim gambar atau URL)",
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
