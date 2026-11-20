// Fitur canvas/iqc5 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/iqc5", {
  "name": "iqc5",
  "command": [
    "iqc5",
    "qc5"
  ],
  "category": "image",
  "desc": "Membuat Fake Quote iOS style tanpa API eksternal.",
  "usage": ".iqc5 [text/reply]",
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
