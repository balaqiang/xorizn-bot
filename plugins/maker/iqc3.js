// Fitur maker/iqc3 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/iqc3", {
  "name": "iqc3",
  "command": [
    "iqc3",
    "canvasiqc3",
    "iqc3maker"
  ],
  "category": "maker",
  "desc": "Membuat gambar Canvas IQC dari teks",
  "usage": ".iqc3 <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
