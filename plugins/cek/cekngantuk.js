// Fitur cek/cekngantuk — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekngantuk", {
  "name": "cekngantuk",
  "command": [
    "ngantuk",
    "sleepy"
  ],
  "category": "cek",
  "desc": "Cek tingkat ngantuk kamu",
  "usage": ".cekngantuk <nama>",
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
