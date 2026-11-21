// Fitur primbon/tafsirmimpi — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("primbon/tafsirmimpi", {
  "name": "tafsirmimpi",
  "command": [
    "tafsirmimpi",
    "artimimpi"
  ],
  "category": "primbon",
  "desc": "Cari tafsir mimpi",
  "usage": ".tafsirmimpi <kata kunci>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
