// Fitur canvas/oh-no — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/oh-no", {
  "name": "oh-no",
  "command": [
    "oh-no",
    "ohno",
    "ohnomeme"
  ],
  "category": "image",
  "desc": "Membuat meme oh no",
  "usage": ".oh-no <teks>",
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
