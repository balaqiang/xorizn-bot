// Fitur group/tagsider — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("group/tagsider", {
  "name": "tagsider",
  "command": [
    "tagsider",
    "tagnonaktif",
    "panggilsider"
  ],
  "category": "group",
  "desc": "Memanggil member tidak aktif dengan gaya idol ekspresif ✨",
  "usage": ".tagsider <pesan>",
  "owner": false,
  "group": true,
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
