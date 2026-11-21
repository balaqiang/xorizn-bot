// Fitur group/antimedia — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/antimedia", {
  "name": "antimedia",
  "command": [
    "antimedia",
    "am",
    "nomedia"
  ],
  "category": "group",
  "desc": "Mengatur antimedia di grup (blokir gambar/video/audio/dokumen)",
  "usage": ".antimedia <on/off>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
