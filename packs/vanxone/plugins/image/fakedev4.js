// Fitur canvas/fakedev4 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakedev4", {
  "name": "fakedev4",
  "command": [
    "fakedev4"
  ],
  "category": "image",
  "desc": "Bikin gambar fakedev 4 dari fotomu",
  "usage": ".fakedev4 <teks> (reply/kirim foto)",
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
