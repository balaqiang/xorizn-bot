// Fitur group/listtoxic — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/listtoxic", {
  "name": "listtoxic",
  "command": [
    "listtoxic",
    "toxiclist",
    "katatoxic",
    "lihatkata"
  ],
  "category": "group",
  "desc": "Lihat daftar kata toxic",
  "usage": ".listtoxic",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
