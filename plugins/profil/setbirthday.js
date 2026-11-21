// Fitur user/setbirthday — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("user/setbirthday", {
  "name": "setbirthday",
  "command": [
    "setbirthday",
    "setbday",
    "settgl"
  ],
  "category": "profil",
  "desc": "Set tanggal ulang tahun",
  "usage": ".setbirthday <DD-MM>",
  "owner": false,
  "group": false,
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
