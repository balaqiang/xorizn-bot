// Fitur cek/cekfemboy — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekfemboy", {
  "name": "cekfemboy",
  "command": [
    "cekfemboy",
    "femboy"
  ],
  "category": "cek",
  "desc": "Cek seberapa femboy kamu",
  "usage": ".cekfemboy <nama>",
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
