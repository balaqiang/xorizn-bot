// Fitur canvas/fakestory — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakestory", {
  "name": "fakestory",
  "command": [
    "fakestory",
    "fstory",
    "fakeinsta",
    "igstory"
  ],
  "category": "image",
  "desc": "Membuat fake Instagram story dengan 2 gambar",
  "usage": ".fakestory <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
