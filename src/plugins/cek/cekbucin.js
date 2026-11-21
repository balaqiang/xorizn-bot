// Fitur cek/cekbucin — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("cek/cekbucin", {
  "name": "cekbucin",
  "command": [
    "bucin"
  ],
  "category": "cek",
  "desc": "Cek seberapa bucin kamu",
  "usage": ".cekbucin <nama>",
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
