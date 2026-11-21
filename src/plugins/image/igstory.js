// Fitur canvas/igstory — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/igstory", {
  "name": "igstory",
  "command": [
    "igstorypost"
  ],
  "category": "image",
  "desc": "Membuat gambar simulasi post Instagram Story dari foto profil dan gambarmu.",
  "usage": ".igstory [kirim/reply gambar]",
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
