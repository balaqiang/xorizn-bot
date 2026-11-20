// Fitur canvas/vosv2 — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("canvas/vosv2", {
  "name": "vosv2",
  "command": [
    "vosv2",
    "vos2"
  ],
  "category": "image",
  "desc": "Membuat gambar kata-kata tema Windows Media Player HD tanpa nama dan foto profil.",
  "usage": ".vosv2 isi kata kata",
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
