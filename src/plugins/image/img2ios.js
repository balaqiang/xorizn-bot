// Fitur canvas/img2ios — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/img2ios", {
  "name": "img2ios",
  "command": [
    "img2ios",
    "toios"
  ],
  "category": "image",
  "desc": "Bikin gambarmu menjadi gaya foto iOS",
  "usage": ".img2ios (reply/kirim foto)",
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
