// Fitur canvas/applemusic — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/applemusic", {
  "name": "applemusic-canvas",
  "command": [
    "applemusic-canvas",
    "applemusic",
    "applecanvas"
  ],
  "category": "image",
  "desc": "Buat gambar pemutar Apple Music dari foto",
  "usage": ".applemusic-canvas judul | artis (reply gambar)",
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
