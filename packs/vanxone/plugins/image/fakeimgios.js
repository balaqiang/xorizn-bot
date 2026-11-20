// Fitur canvas/fakeimgios — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("canvas/fakeimgios", {
  "name": "fakeimgios",
  "command": [
    "fakeimgios",
    "imgios"
  ],
  "category": "image",
  "desc": "Membuat gambar ss ios",
  "usage": ".fakeimgios",
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
