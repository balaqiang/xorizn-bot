// Fitur tools/ceknamadana — kode inti di engine/zenith
module.exports = require('../../lib/engine/zenith').plugin("tools/ceknamadana", {
  "name": "ceknamadana",
  "command": [
    "ceknamadana",
    "cekdana"
  ],
  "category": "tools",
  "desc": "Cek Nama Pengguna Dana",
  "usage": ".cekdana",
  "owner": false,
  "group": false,
  "private": false,
  "premium": false,
  "cooldown": 3,
  "energi": 1,
  "needs": {
    "apikeys": [],
    "scrapers": [],
    "assets": []
  }
})
