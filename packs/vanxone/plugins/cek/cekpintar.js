// Fitur cek/cekpintar — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekpintar", {
  "name": "cekpintar",
  "command": [
    "pintar",
    "iq",
    "smart"
  ],
  "category": "cek",
  "desc": "Cek seberapa pintar kamu",
  "usage": ".cekpintar <nama>",
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
