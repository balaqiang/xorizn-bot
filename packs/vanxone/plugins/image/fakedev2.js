// Fitur canvas/fakedev2 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakedev2", {
  "name": "fakedev2",
  "command": [
    "fakedev2"
  ],
  "category": "image",
  "desc": "Bikin gambar fakedev 2 dari fotomu",
  "usage": ".fakedev2 <teks> (reply/kirim foto)",
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
