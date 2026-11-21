// Fitur ai/faceswap — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("ai/faceswap", {
  "name": "faceswap",
  "command": [
    "faceswap",
    "fs",
    "swapface"
  ],
  "category": "ai",
  "desc": "Tukar wajah dari 2 gambar",
  "usage": ".faceswap (kirim/reply 2 gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 30,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
