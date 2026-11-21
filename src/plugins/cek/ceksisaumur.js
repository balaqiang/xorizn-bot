// Fitur cek/ceksisaumur — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/ceksisaumur", {
  "name": "ceksisaumur",
  "command": [
    "ceksisaumur",
    "sisaumur"
  ],
  "category": "cek",
  "desc": "Cek sisa umur kamu",
  "usage": ".ceksisaumur <nama>",
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
