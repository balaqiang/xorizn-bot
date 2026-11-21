// Fitur maker/wmp1 — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("maker/wmp1", {
  "name": "wmp1",
  "command": [
    "wmp1",
    "canvaswmp1",
    "wmp1meme"
  ],
  "category": "maker",
  "desc": "Membuat gambar Canvas WMP1 dengan teks custom",
  "usage": ".wmp1 <teks1|teks2|teks3|teks4>",
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
