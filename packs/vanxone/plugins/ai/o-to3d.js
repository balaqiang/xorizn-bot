// Fitur ai/o-to3d — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("ai/to3d", {
  "name": "to3d",
  "command": [
    "to3d",
    "3d",
    "3dfy",
    "to3dmodel"
  ],
  "category": "ai",
  "desc": "Ubah foto menjadi gaya 3D render",
  "usage": ".to3d (reply/kirim gambar)",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
  "admin": false,
  "botAdmin": false,
  "cooldown": 60,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
