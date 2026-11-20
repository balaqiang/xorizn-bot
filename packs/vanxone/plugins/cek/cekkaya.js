// Fitur cek/cekkaya — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekkaya", {
  "name": "cekkaya",
  "command": [
    "kaya",
    "rich"
  ],
  "category": "cek",
  "desc": "Cek seberapa kaya kamu",
  "usage": ".cekkaya <nama>",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "admin": false,
  "botAdmin": false,
  "cooldown": 5,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
