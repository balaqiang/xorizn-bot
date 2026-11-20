// Fitur sticker/bratlocal — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("sticker/bratlocal", {
  "name": "bratlocal",
  "command": [
    "bratlocal",
    "bratgojovid",
    "bratvermeilvid"
  ],
  "category": "image",
  "desc": "Bikin brat versi lokal (Gojo & Vermeil)",
  "usage": ".bratgojo <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 15,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
