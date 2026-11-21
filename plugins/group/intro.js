// Fitur group/intro — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/intro", {
  "name": "intro",
  "command": [
    "perkenalan",
    "selamatdatang"
  ],
  "category": "group",
  "desc": "Tampilkan pesan intro grup",
  "usage": ".intro",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
