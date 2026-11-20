// Fitur stalker/stalkdc — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("stalker/stalkdc", {
  "name": "stalkdc",
  "command": [
    "cekkdc"
  ],
  "category": "stalker",
  "desc": "Mengetahui info profil akun Discord berdasarkan ID",
  "usage": ".stalkdc <id_discord>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 10,
  "energi": 2,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
