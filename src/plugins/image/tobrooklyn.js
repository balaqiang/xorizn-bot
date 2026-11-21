// Fitur canvas/tobrooklyn — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("canvas/tobrooklyn", {
  "name": "tobrooklyn",
  "command": [
    "tobrooklyn",
    "brooklyn",
    "filterbrooklyn"
  ],
  "category": "image",
  "desc": "Membuat filter Brooklyn pada gambar",
  "usage": ".tobrooklyn (reply gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
