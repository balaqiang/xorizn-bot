// Fitur main/menuhtml — kode inti di engine/orbit
module.exports = require('../../lib/engine/orbit').plugin("main/menuhtml", {
  "name": "menuhtml",
  "command": [
    "menuhtml",
    "htmlmenu",
    "menugamehtml"
  ],
  "category": "info",
  "desc": "Menu tombol untuk menjalankan semua game HTML XORIZN-BOT",
  "usage": ".menuhtml",
  "owner": false,
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
