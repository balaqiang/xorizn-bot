// Fitur user/birthdaylist — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("user/birthdaylist", {
  "name": "birthdaylist",
  "command": [
    "birthdaylist",
    "bdaylist",
    "listultah",
    "ultahlist"
  ],
  "category": "profil",
  "desc": "Lihat daftar ulang tahun member",
  "usage": ".birthdaylist",
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
