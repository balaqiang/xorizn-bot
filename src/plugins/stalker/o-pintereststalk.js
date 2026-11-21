// Fitur stalker/o-pintereststalk — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("stalker/pintereststalk", {
  "name": "pintereststalk",
  "command": [
    "pintereststalk",
    "pinterestid",
    "stalkpinterest",
    "stalkpin"
  ],
  "category": "stalker",
  "desc": "Melihat informasi lengkap akun Pinterest berdasarkan username.",
  "usage": ".pintereststalk <username>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
