// Fitur canvas/fakestory3 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakestory3", {
  "name": "fakestory3",
  "command": [
    "fakestory3",
    "fstory3",
    "igstory3",
    "quotestory"
  ],
  "category": "image",
  "desc": "Fake Instagram story dengan text overlay",
  "usage": ".fakestory3 <nama>|<text1>|<text2>",
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
