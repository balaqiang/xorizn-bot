// Fitur maker/wmp2 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/wmp2", {
  "name": "wmp2",
  "command": [
    "wmp2",
    "canvaswmp2",
    "wmpmeme"
  ],
  "category": "maker",
  "desc": "Membuat gambar Canvas WMP2 dengan teks custom",
  "usage": ".wmp2 <teks1|teks2|teks3|teks4>",
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
