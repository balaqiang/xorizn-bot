// Fitur canvas/facepalm — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/facepalm", {
  "name": "facepalm",
  "command": [
    "facepalm"
  ],
  "category": "image",
  "desc": "Bikin gambar facepalm dari fotomu",
  "usage": ".facepalm (reply/kirim foto)",
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
