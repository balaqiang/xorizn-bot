// Fitur owner/ganti-hsnai-allmenu — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-hsnai-allmenu", {
  "name": "ganti-hsnai-allmenu.jpg",
  "command": [
    "ganti-hsnai-allmenu.jpg",
    "gantiallemenu",
    "sethsnaiallmenu"
  ],
  "category": "owner",
  "desc": "Ganti gambar hsnai-allmenu.jpg (thumbnail allmenu)",
  "usage": ".ganti-hsnai-allmenu.jpg (reply/kirim gambar atau URL)",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
