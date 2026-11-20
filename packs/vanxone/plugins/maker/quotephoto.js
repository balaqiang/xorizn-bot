// Fitur maker/quotephoto — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/quotephoto", {
  "name": "quotephoto",
  "command": [
    "quotephoto",
    "qphoto",
    "quotepic",
    "katatutur",
    "picturequote"
  ],
  "category": "maker",
  "desc": "Buat gambar kata-kata quote estetik di atas kertas",
  "usage": ".quotephoto teks|author",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
