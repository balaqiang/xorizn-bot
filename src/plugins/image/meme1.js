// Fitur canvas/meme1 — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("canvas/meme1", {
  "name": "meme1",
  "command": [
    "meme1",
    "drakememe"
  ],
  "category": "image",
  "desc": "Membuat meme drake format",
  "usage": ".meme1 <text1>|<text2>",
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
