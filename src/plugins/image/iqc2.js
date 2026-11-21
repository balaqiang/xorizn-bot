// Fitur canvas/iqc2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/iqc2", {
  "name": "iqc2",
  "command": [
    "iqc2",
    "qc3"
  ],
  "category": "image",
  "desc": "Membuat Fake Quote iOS style dengan informasi baterai dan provider.",
  "usage": ".iqc2 [text/reply]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
