// Fitur canvas/ektp — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("canvas/ektp", {
  "name": "ektp",
  "command": [
    "ektp",
    "ktp"
  ],
  "category": "image",
  "desc": "Bikin gambar e-KTP palsu",
  "usage": ".ektp <nik>|<nama>|<tanggalLahir> (reply/kirim foto)",
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
