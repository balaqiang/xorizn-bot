// Fitur downloads/gimage — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("downloads/gimage", {
  "name": "gimage",
  "command": [
    "gimage",
    "image"
  ],
  "category": "search",
  "desc": "Mencari dan mendownload gambar dari Google",
  "usage": ".gimage [nama gambar]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
