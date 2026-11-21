// Fitur canvas/fakefbkomen — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakefbkomen", {
  "name": "fakefbkomen",
  "command": [
    "fakefbkomen",
    "fbkomen",
    "komenfb"
  ],
  "category": "image",
  "desc": "Bikin gambar komentar palsu facebook",
  "usage": ".fakefbkomen <nama>|<komentar> (reply/kirim foto)",
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
