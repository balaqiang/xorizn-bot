// Fitur user/notiflimit — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("user/notiflimit", {
  "name": "notiflimit",
  "command": [
    "notiflimit",
    "notifenergi"
  ],
  "category": "owner",
  "desc": "Mengaktifkan atau mematikan notifikasi potong limit secara global.",
  "usage": ".notiflimit",
  "owner": true,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 0,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
