// Fitur user/bataldaftar — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("user/bataldaftar", {
  "name": "bataldaftar",
  "command": [
    "bataldaftar",
    "cancelreg",
    "canceldaftar",
    "regcancel"
  ],
  "category": "profil",
  "desc": "Batalkan sesi pendaftaran yang sedang aktif",
  "usage": ".bataldaftar",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
