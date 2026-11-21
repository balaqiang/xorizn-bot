// Fitur sticker/img2sp — kode inti di engine/aurora
module.exports = require('../../lib/engine/aurora').plugin("sticker/img2sp", {
  "name": "img2sp",
  "command": [
    "img2sp",
    "i2sp"
  ],
  "category": "sticker",
  "desc": "Ubah 1 media atau 1 album (gambar/video) jadi WhatsApp Sticker Pack",
  "usage": ".img2sp [-crop|-fit] <nama pack>|<deskripsi>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 10,
  "energi": 3,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
