// Fitur game/sos — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("game/sos", {
  "name": "sos",
  "command": [
    "sos",
    "sosgame",
    "mainsos"
  ],
  "category": "game",
  "desc": "Game SOS! Buat kata S-O-S di papan untuk menang. Ukuran papan bisa dipilih (3x3 hingga 10x10).",
  "usage": ".sos [@lawan] [tinggi] [lebar]",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
