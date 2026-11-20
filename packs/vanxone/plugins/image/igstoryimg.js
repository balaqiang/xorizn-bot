// Fitur canvas/igstoryimg — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/igstoryimg", {
  "name": "igstoryimg",
  "command": [
    "igstoryimg",
    "igstoryimage"
  ],
  "category": "image",
  "desc": "Membuat gambar layout Instagram Story dari gambarmu.",
  "usage": ".igstoryimg [kirim/reply gambar]",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
