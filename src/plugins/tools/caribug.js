// Fitur tools/caribug — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("tools/caribug", {
  "name": "caribug",
  "command": [
    "caribug",
    "debug",
    "findbug"
  ],
  "category": "tools",
  "desc": "Cari bug di kode pemrograman",
  "usage": ".caribug [kode] atau reply kode",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 20,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
