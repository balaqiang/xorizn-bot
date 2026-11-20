// Fitur canvas/fakedev — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/fakedev", {
  "name": "fakedev",
  "command": [
    "fakedev"
  ],
  "category": "image",
  "desc": "Bikin gambar fakedev dari fotomu",
  "usage": ".fakedev <teks> (reply/kirim foto)",
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
