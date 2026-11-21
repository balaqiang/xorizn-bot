// Fitur cek/ceklapar — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/ceklapar", {
  "name": "ceklapar",
  "command": [
    "ceklapar",
    "lapar",
    "hungry"
  ],
  "category": "cek",
  "desc": "Cek tingkat kelaparan kamu",
  "usage": ".ceklapar <nama>",
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
