// Fitur canvas/fakedev3 — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakedev3", {
  "name": "fakedev3",
  "command": [
    "fakedev3"
  ],
  "category": "image",
  "desc": "Bikin gambar fakedev 3 dari fotomu",
  "usage": ".fakedev3 <teks> (reply/kirim foto)",
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
