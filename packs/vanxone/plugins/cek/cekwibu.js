// Fitur cek/cekwibu — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekwibu", {
  "name": "cekwibu",
  "command": [
    "wibu",
    "weeb"
  ],
  "category": "cek",
  "desc": "Cek seberapa wibu kamu",
  "usage": ".cekwibu <nama>",
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
