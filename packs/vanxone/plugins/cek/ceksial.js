// Fitur cek/ceksial — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/ceksial", {
  "name": "ceksial",
  "command": [
    "sial",
    "apes"
  ],
  "category": "cek",
  "desc": "Cek seberapa sial kamu",
  "usage": ".ceksial <nama>",
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
