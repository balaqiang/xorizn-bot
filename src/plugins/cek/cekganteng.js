// Fitur cek/cekganteng — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekganteng", {
  "name": "cekganteng",
  "command": [
    "ganteng",
    "handsome"
  ],
  "category": "cek",
  "desc": "Cek seberapa ganteng kamu",
  "usage": ".cekganteng <nama>",
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
