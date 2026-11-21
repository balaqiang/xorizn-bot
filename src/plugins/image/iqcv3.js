// Fitur image/iqcv3 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("image/iqcv3", {
  "name": "iqcv3",
  "command": [
    "iqcv3",
    "buatgambar",
    "iqc-v3"
  ],
  "category": "image",
  "desc": "Generate gambar IQC dengan nama custom",
  "usage": ".iqc <nama> <waktu>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
