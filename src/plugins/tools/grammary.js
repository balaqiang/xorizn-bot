// Fitur tools/grammary — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/grammary", {
  "name": "grammarly",
  "command": [
    "grammarly",
    "aidetector",
    "checkai",
    "grammarlyai"
  ],
  "category": "tools",
  "desc": "Mengecek persentase teks AI menggunakan Grammarly AI Detector",
  "usage": ".grammarly <teks yang ingin dicek>",
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
