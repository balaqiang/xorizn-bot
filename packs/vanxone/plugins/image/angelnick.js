// Fitur canvas/angelnick — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/angelnick", {
  "name": "angelnick",
  "command": [
    "angelnick"
  ],
  "category": "image",
  "desc": "Bikin card angel nick dari fotomu",
  "usage": ".angelnick <teks> (reply/kirim foto)",
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
