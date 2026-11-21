// Fitur main/listmenu — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("main/listmenu", {
  "name": "listmenu",
  "command": [
    "listmenu",
    "menugroup",
    "groupmenu",
    "listgroup"
  ],
  "category": "info",
  "desc": "Menampilkan semua menu grup beserta fungsi setiap command",
  "usage": ".listmenu",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
