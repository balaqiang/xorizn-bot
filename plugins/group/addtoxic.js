// Fitur group/addtoxic — kode inti di engine/nimbus
module.exports = require('../../lib/engine/nimbus').plugin("group/addtoxic", {
  "name": "addtoxic",
  "command": [
    "addtoxic",
    "tambahtoxic",
    "addkata"
  ],
  "category": "group",
  "desc": "Tambah kata toxic ke daftar",
  "usage": ".addtoxic <kata>",
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
