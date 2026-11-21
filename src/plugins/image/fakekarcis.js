// Fitur canvas/fakekarcis — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("canvas/fakekarcis", {
  "name": "fakekarcis",
  "command": [
    "fakekarcis",
    "karcisfake",
    "tiketbioskop",
    "faketiketfilm"
  ],
  "category": "image",
  "desc": "Bikin fake karcis bioskop (buat konten/gaguan doang)",
  "usage": ".fakekarcis <nama> | <film> | <jam>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
