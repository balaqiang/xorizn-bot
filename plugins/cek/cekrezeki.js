// Fitur cek/cekrezeki — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekrezeki", {
  "name": "cekrezeki",
  "command": [
    "rezeki"
  ],
  "category": "cek",
  "desc": "Cek tingkat rezeki kamu hari ini",
  "usage": ".cekrezeki <nama>",
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
