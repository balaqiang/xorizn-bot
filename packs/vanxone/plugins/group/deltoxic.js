// Fitur group/deltoxic — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/deltoxic", {
  "name": "deltoxic",
  "command": [
    "deltoxic",
    "hapustoxic",
    "remtoxic",
    "removetoxic"
  ],
  "category": "group",
  "desc": "Hapus kata toxic dari daftar",
  "usage": ".deltoxic <kata>",
  "owner": false,
  "group": true,
  "private": false,
  "premium": false,
  "admin": true,
  "botAdmin": false,
  "cooldown": 3,
  "energi": 0,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
