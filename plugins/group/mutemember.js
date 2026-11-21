// Fitur group/mutemember — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/mutemember", {
  "name": "mutemember",
  "command": [
    "mutemember",
    "mutmember",
    "silentmember",
    "bisukanmember"
  ],
  "category": "group",
  "desc": "Bisukan member tertentu (pesan akan dihapus bot)",
  "usage": ".mutemember <@tag/reply/nomor>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": true,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
