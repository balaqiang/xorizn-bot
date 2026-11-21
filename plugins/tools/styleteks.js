// Fitur tools/styleteks — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/styleteks", {
  "name": "styleteks",
  "command": [
    "styleteks",
    "fancytext",
    "gaya",
    "tulisan",
    "fontstyle"
  ],
  "category": "tools",
  "desc": "Mengubah teks biasa menjadi berbagai gaya tulisan keren (fancy text).",
  "usage": ".styleteks <teks>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
