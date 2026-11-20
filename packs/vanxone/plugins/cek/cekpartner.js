// Fitur cek/cekpartner — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekpartner", {
  "name": "cekpartner",
  "command": [
    "cekpartner",
    "partnerinfo"
  ],
  "category": "cek",
  "desc": "Cek detail status partner user",
  "usage": ".cekpartner @user",
  "owner": false,
  "group": false,
  "private": false,
  "premium": true,
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
