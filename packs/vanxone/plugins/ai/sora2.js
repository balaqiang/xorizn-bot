// Fitur ai/sora2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("ai/sora2", {
  "name": "sora2",
  "command": [
    "sora2",
    "sora"
  ],
  "category": "ai",
  "desc": "Ubah gambar menjadi video (Sora 2)",
  "usage": ".sora <prompt>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 20,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
