// Fitur sticker/bratlocal — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("sticker/bratlocal", {
  "name": "gojo",
  "command": [
    "gojo",
    "gojovid",
    "vermeil",
    "vermeilvid"
  ],
  "category": "image",
  "desc": "Bikin brat versi lokal (Gojo & Vermeil)",
  "usage": ".gojo <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
