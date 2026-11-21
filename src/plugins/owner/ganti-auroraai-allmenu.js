// Fitur owner/ganti-auroraai-allmenu — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("owner/ganti-auroraai-allmenu", {
  "name": "ganti-auroraai-allmenu.jpg",
  "command": [
    "ganti-auroraai-allmenu.jpg",
    "gantiallemenu",
    "setauroraaiallmenu"
  ],
  "category": "owner",
  "desc": "Ganti gambar auroraai-allmenu.jpg (thumbnail allmenu)",
  "usage": ".ganti-auroraai-allmenu.jpg (reply/kirim gambar atau URL)",
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
