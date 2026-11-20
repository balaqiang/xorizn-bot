// Fitur maker/fakeboard — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/fakeboard", {
  "name": "fakeboard",
  "command": [
    "fakeboard",
    "boardquote",
    "quoteboard",
    "papanquote"
  ],
  "category": "maker",
  "desc": "Membuat gambar papan quote/kutipan dengan author custom",
  "usage": ".fakeboard <teks>|<author>",
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
