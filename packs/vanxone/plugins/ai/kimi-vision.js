// Fitur ai/kimi-vision — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/kimi-vision", {
  "name": "kimi-vision",
  "command": [
    "kimi-vision",
    "kimivision",
    "kimi-v"
  ],
  "category": "ai",
  "desc": "Analisis gambar memakai Kimi Vision",
  "usage": ".kimi-vision <pertanyaan> (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
