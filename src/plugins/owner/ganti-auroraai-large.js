// Fitur owner/ganti-auroraai-large — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-large", {
  "name": "auroraai-large",
  "command": [
    "auroraai-large",
    "setauroraailarge",
    "gantiauroraailarge"
  ],
  "category": "owner",
  "desc": "Preset: Ganti gambar auroraai.jpg, serta auroraai-v7 hingga auroraai-v11.jpg sekaligus",
  "usage": ".auroraai-large (reply/kirim gambar atau URL)",
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
