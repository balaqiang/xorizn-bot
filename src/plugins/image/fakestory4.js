// Fitur canvas/fakestory4 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakestory4", {
  "name": "fakestory4",
  "command": [
    "fakestory4",
    "fstory4",
    "igstory4",
    "albumstory"
  ],
  "category": "image",
  "desc": "Fake Instagram story dengan 2 gambar berbeda",
  "usage": ".fakestory4 <nama>",
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
