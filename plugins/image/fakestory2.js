// Fitur canvas/fakestory2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakestory2", {
  "name": "fakestory2",
  "command": [
    "fakestory2",
    "fstory2",
    "igstory2"
  ],
  "category": "image",
  "desc": "Fake Instagram story dengan 1 gambar full",
  "usage": ".fakestory2 <nama>",
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
